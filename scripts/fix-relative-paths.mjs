#!/usr/bin/env node
// Convert all Webflow-generated relative paths to absolute paths.
// Webflow used `../..//images/...` and `../..//free-estimate` etc. in pages
// served from nested URLs. On dev server (and in some browsers) these
// protocol-relative URLs (`//images/...`) resolve to `http://images/...`
// which fails. Absolute paths (`/images/...`) always work from any URL.
//
// Usage:
//   node scripts/fix-relative-paths.mjs                # apply to all pages
//   node scripts/fix-relative-paths.mjs --dry-run
//   node scripts/fix-relative-paths.mjs --only=FILE.html

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PAGES = path.join(ROOT, 'public/pages');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const onlyArg = args.find((a) => a.startsWith('--only='));
const onlyFile = onlyArg ? onlyArg.slice('--only='.length) : null;

// Patterns to normalize:
//  "../..//images/...", "../../images/..." -> "/images/..."
//  "..//images/...",    "../images/..."    -> "/images/..."
//  "../..//free-estimate"                  -> "/free-estimate"
//  "/../..", "/../",    "/.."              -> "/"
//  href="/../.."                           -> "/"
//  href="/.."                              -> "/"
//
// Strategy: operate ONLY on quoted attribute values (src="...", href="...",
// srcset="..." etc.) to avoid touching page text.

const ATTR_RE = /(\bsrc|\bhref|\bsrcset|\bposter|\bdata-src|\bdata-original)="([^"]*)"/g;

function rewriteUrl(u) {
  // Trim leading sequences of "../" and "/../" / "/../.."
  // Also collapse leading multiple slashes after them.
  // Examples handled:
  //   "../..//images/x.jpg"  -> "/images/x.jpg"
  //   "../../images/x.jpg"   -> "/images/x.jpg"
  //   "..//images/x.jpg"     -> "/images/x.jpg"
  //   "../images/x.jpg"      -> "/images/x.jpg"
  //   "/../../"              -> "/"
  //   "/../.."               -> "/"
  //   "/../"                 -> "/"
  //   "/.."                  -> "/"
  //   "../../"               -> "/"

  if (!u) return u;

  // Skip absolute URLs (http://, https://, //host/)
  if (/^(https?:)?\/\//.test(u)) {
    // But catch double-slash right at start like "//images/"
    if (u.startsWith('//images/') || u.startsWith('//free-estimate') || u.startsWith('//blog') || u.startsWith('//services') || u.startsWith('//about-us') || u.startsWith('//book-online') || u.startsWith('//category') || u.startsWith('//sitemap') || u.startsWith('//favicon')) {
      return u.slice(1); // "//images/x" -> "/images/x"
    }
    return u; // real external URL, leave alone
  }

  // Skip data:, mailto:, tel:, #, javascript:
  if (/^(data|mailto|tel|javascript):/.test(u) || u.startsWith('#')) return u;

  // Handle special cases: "/../..", "/../", "/.."
  let normalized = u;
  // Collapse any sequence of "/.." or "/../../" at start
  normalized = normalized.replace(/^\/?(\.\.\/)+/, '/');
  // Collapse remaining "/../" and "/.."
  normalized = normalized.replace(/\/\.\.\/?/g, '/');
  // Collapse leading "//"
  while (normalized.startsWith('//')) normalized = '/' + normalized.slice(2);
  return normalized;
}

function rewriteSrcset(val) {
  return val
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      const m = trimmed.match(/^(\S+)(\s+.+)?$/);
      if (!m) return part;
      return rewriteUrl(m[1]) + (m[2] || '');
    })
    .join(', ');
}

function rewriteHtml(html) {
  return html.replace(ATTR_RE, (full, attr, val) => {
    const newVal = attr === 'srcset' ? rewriteSrcset(val) : rewriteUrl(val);
    return `${attr}="${newVal}"`;
  });
}

const files = onlyFile ? [onlyFile] : fs.readdirSync(PAGES).filter((f) => f.endsWith('.html'));

let changed = 0;
let bytesSaved = 0;
let samplesShown = 0;

for (const f of files) {
  const full = path.join(PAGES, f);
  const before = fs.readFileSync(full, 'utf8');
  const after = rewriteHtml(before);
  if (after === before) continue;

  if (!dryRun) fs.writeFileSync(full, after);
  changed++;
  const saved = before.length - after.length;
  bytesSaved += saved;
  if (samplesShown < 3 || onlyFile) {
    console.log(`  ${f}: ${saved} bytes saved`);
    samplesShown++;
  }
}

console.log('');
console.log(`Processed: ${files.length}`);
console.log(`Changed:   ${changed}`);
console.log(`Saved:     ${(bytesSaved / 1024).toFixed(1)} KB`);
if (dryRun) console.log('[dry-run] No files written.');
