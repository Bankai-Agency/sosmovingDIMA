#!/usr/bin/env node
// Extract shared HTML blocks from public/pages/index.html.
// index.html uses absolute paths (/images/..., /free-estimate) — works from any route.
// Output: src/data/shared/{navbar,callback-widget,footer,exit-popup}.html

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'public/pages/index.html');
const OUT_DIR = path.join(ROOT, 'src/data/shared');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const html = fs.readFileSync(SOURCE, 'utf8');
// Disable cheerio's HTML entity decoding — we want to preserve original markup byte-for-byte
const $ = cheerio.load(html, { decodeEntities: false });

function write(name, sel) {
  const el = $(sel).first();
  if (!el.length) {
    console.warn(`  [skip] not found: ${sel}`);
    return null;
  }
  // $.html(el) returns outer HTML of the element
  const out = $.html(el);
  fs.writeFileSync(path.join(OUT_DIR, `${name}.html`), out);
  console.log(`  ${name.padEnd(20)} → ${out.length} bytes`);
  return out;
}

console.log('Extracting shared blocks from index.html:');
write('navbar', 'div.navbar.w-nav');
write('callback-widget', 'div.callback-widget');
write('footer', 'footer.footer');
write('exit-popup', '#exit-popup');

console.log(`Output: ${path.relative(ROOT, OUT_DIR)}/`);
