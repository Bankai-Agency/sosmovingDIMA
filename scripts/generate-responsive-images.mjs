#!/usr/bin/env node
// Generate responsive image variants (-p-500, -p-800, -p-1080, -p-1600)
// from base images, matching Webflow's naming convention.
//
// Reads: public/pages/*.html
// Extracts all srcset variants, checks which are missing, generates them from base.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const PAGES = path.join(PUBLIC, 'pages');

const VARIANT_RE = /-p-(500|800|1080|1600)\.(webp|jpg|jpeg|png|avif)$/i;

function findBaseImage(variantPath) {
  // "/images/general/foo-p-500.webp" -> base "/images/general/foo.webp"
  const m = variantPath.match(VARIANT_RE);
  if (!m) return null;
  const width = parseInt(m[1], 10);
  const ext = m[2];
  const base = variantPath.replace(VARIANT_RE, `.${ext}`);
  return { base, width, ext };
}

async function main() {
  // 1. Scan all HTML for image references
  const referenced = new Set();
  const htmlFiles = fs.readdirSync(PAGES).filter((f) => f.endsWith('.html'));

  for (const f of htmlFiles) {
    const html = fs.readFileSync(path.join(PAGES, f), 'utf8');
    // Extract src and srcset
    const srcMatches = html.matchAll(/src="(\/images\/[^"]+)"/g);
    for (const m of srcMatches) referenced.add(decodeURIComponent(m[1]));

    const srcsetMatches = html.matchAll(/srcset="([^"]+)"/g);
    for (const m of srcsetMatches) {
      const parts = m[1].split(',');
      for (const p of parts) {
        const url = p.trim().split(/\s+/)[0];
        if (url.startsWith('/images/')) referenced.add(decodeURIComponent(url));
      }
    }
  }

  // 2. Find variants where base exists but variant is missing
  const toGenerate = [];
  for (const ref of referenced) {
    const info = findBaseImage(ref);
    if (!info) continue; // not a variant

    const variantFs = path.join(PUBLIC, ref);
    if (fs.existsSync(variantFs)) continue; // already exists

    const baseFs = path.join(PUBLIC, info.base);
    if (!fs.existsSync(baseFs)) continue; // no base to resize from

    toGenerate.push({ variantFs, baseFs, width: info.width, ext: info.ext });
  }

  console.log(`Found ${toGenerate.length} variants to generate`);

  // 3. Generate using sharp
  let ok = 0;
  let fail = 0;
  for (const { variantFs, baseFs, width, ext } of toGenerate) {
    try {
      let pipeline = sharp(baseFs).resize({ width, withoutEnlargement: true });

      if (ext.toLowerCase() === 'webp') {
        pipeline = pipeline.webp({ quality: 82 });
      } else if (ext.toLowerCase() === 'avif') {
        pipeline = pipeline.avif({ quality: 60 });
      } else if (ext.toLowerCase() === 'png') {
        pipeline = pipeline.png({ compressionLevel: 9 });
      } else {
        pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
      }

      await pipeline.toFile(variantFs);
      ok++;
      if (ok % 50 === 0) console.log(`  Generated ${ok}/${toGenerate.length}`);
    } catch (err) {
      fail++;
      console.error(`  FAIL ${path.basename(variantFs)}: ${err.message}`);
    }
  }

  console.log(`\nDone. Generated: ${ok}, Failed: ${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
