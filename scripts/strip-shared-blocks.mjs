#!/usr/bin/env node
// Strip shared HTML blocks (navbar, callback-widget, footer, exit-popup) from
// every public/pages/*.html. These blocks are now rendered via <SharedHtmlBlock />
// in (webflow)/layout.tsx, so duplicating them in per-page HTML causes double render.
//
// Selectors (all via cheerio):
//   div.navbar.w-nav              — navbar wrapper (always at top of body)
//   div.callback-widget           — right-side floating call/quote widget
//   footer.footer                 — site footer
//   #exit-popup                   — exit-intent popup
//
// Usage:
//   node scripts/strip-shared-blocks.mjs                 # strip all
//   node scripts/strip-shared-blocks.mjs --dry-run       # print counts, no writes
//   node scripts/strip-shared-blocks.mjs --only=FILE.html  # one file

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PAGES = path.join(ROOT, 'public/pages');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const onlyArg = args.find((a) => a.startsWith('--only='));
const onlyFile = onlyArg ? onlyArg.slice('--only='.length) : null;

const SELECTORS = [
  { name: 'navbar',          sel: 'div.navbar.w-nav' },
  { name: 'callback-widget', sel: 'div.callback-widget' },
  { name: 'footer',          sel: 'footer.footer' },
  { name: 'exit-popup',      sel: '#exit-popup' },
];

const files = onlyFile ? [onlyFile] : fs.readdirSync(PAGES).filter((f) => f.endsWith('.html'));

let totalStripped = 0;
let totalBytesSaved = 0;

for (const f of files) {
  const full = path.join(PAGES, f);
  const html = fs.readFileSync(full, 'utf8');
  const originalLen = html.length;
  // Wrap in a fake body so cheerio treats it as a fragment; decodeEntities off preserves Webflow's & encoding
  const $ = cheerio.load(`<body>${html}</body>`, { decodeEntities: false });

  const removed = {};
  for (const { name, sel } of SELECTORS) {
    const hits = $(sel);
    removed[name] = hits.length;
    hits.remove();
  }

  const anyRemoved = Object.values(removed).some((n) => n > 0);
  if (!anyRemoved) continue;

  // Extract inner HTML of the fake body wrapper
  const newHtml = $('body').html() ?? html;
  if (!dryRun) fs.writeFileSync(full, newHtml);

  const saved = originalLen - newHtml.length;
  totalBytesSaved += saved;
  totalStripped++;

  if (totalStripped <= 5 || onlyFile) {
    console.log(`  ${f}`);
    for (const { name } of SELECTORS) {
      if (removed[name]) console.log(`    - ${name} (${removed[name]})`);
    }
    console.log(`    saved ${saved} bytes`);
  }
}

console.log('');
console.log(`Processed: ${files.length} files`);
console.log(`Modified:  ${totalStripped}`);
console.log(`Saved:     ${(totalBytesSaved / 1024 / 1024).toFixed(2)} MB`);
if (dryRun) console.log('[dry-run] No files written.');
