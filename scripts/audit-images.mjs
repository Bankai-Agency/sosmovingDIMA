#!/usr/bin/env node
// Audit all image references across public/pages/*.html
// Reports: referenced images that don't exist on disk (and no fallback via srcset base).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const PAGES = path.join(PUBLIC, 'pages');

const VARIANT_RE = /-p-(500|800|1080|1600)\.(webp|jpg|jpeg|png|avif)$/i;

function baseOf(p) {
  const m = p.match(VARIANT_RE);
  if (!m) return null;
  return p.replace(VARIANT_RE, `.${m[2]}`);
}

const htmlFiles = fs.readdirSync(PAGES).filter((f) => f.endsWith('.html'));
const refs = new Map(); // path -> Set(pages where referenced)

for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(PAGES, f), 'utf8');

  const addRef = (url) => {
    if (!url.startsWith('/images/') && !url.startsWith('/assets/')) return;
    const decoded = decodeURIComponent(url);
    if (!refs.has(decoded)) refs.set(decoded, new Set());
    refs.get(decoded).add(f);
  };

  // src="..."
  for (const m of html.matchAll(/\bsrc="([^"]+)"/g)) addRef(m[1]);
  // srcset="url1 1x, url2 2x, ..."
  for (const m of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const p of m[1].split(',')) {
      const u = p.trim().split(/\s+/)[0];
      if (u) addRef(u);
    }
  }
  // background-image: url(...)
  for (const m of html.matchAll(/url\(['"]?(\/(?:images|assets)\/[^'")]+)['"]?\)/g)) addRef(m[1]);
  // data-src, data-original, poster
  for (const m of html.matchAll(/\b(?:data-src|data-original|poster)="([^"]+)"/g)) addRef(m[1]);
}

// Classify refs
let exist = 0;
let missingWithBase = 0;
const missingNoBase = [];

for (const [ref, pagesSet] of refs) {
  const diskPath = path.join(PUBLIC, ref);
  if (fs.existsSync(diskPath)) {
    exist++;
    continue;
  }
  const base = baseOf(ref);
  if (base && fs.existsSync(path.join(PUBLIC, base))) {
    missingWithBase++;
    continue;
  }
  missingNoBase.push({ ref, pages: Array.from(pagesSet).slice(0, 3), totalPages: pagesSet.size });
}

// Sort by frequency
missingNoBase.sort((a, b) => b.totalPages - a.totalPages);

console.log(`Total unique referenced paths: ${refs.size}`);
console.log(`  Exist on disk: ${exist}`);
console.log(`  Missing but base variant exists (can regenerate): ${missingWithBase}`);
console.log(`  Missing with NO base available: ${missingNoBase.length}`);
console.log('');
console.log('Top 50 missing (no base) — by usage count:');
console.log('');

for (const { ref, pages, totalPages } of missingNoBase.slice(0, 50)) {
  console.log(`  [${totalPages}x] ${ref}`);
  console.log(`    used in: ${pages.join(', ')}${totalPages > pages.length ? ', ...' : ''}`);
}

// Write full report
const reportPath = path.join(__dirname, '..', 'image-audit-report.txt');
const reportLines = [
  `Image Audit Report`,
  `Generated: ${new Date().toISOString()}`,
  ``,
  `Total unique referenced: ${refs.size}`,
  `Exist on disk: ${exist}`,
  `Missing but base exists: ${missingWithBase}`,
  `Missing with no base: ${missingNoBase.length}`,
  ``,
  `=== Missing (no base) ===`,
  ...missingNoBase.map(({ ref, totalPages }) => `[${totalPages}x] ${ref}`),
];
fs.writeFileSync(reportPath, reportLines.join('\n'));
console.log(`\nFull report: ${reportPath}`);
