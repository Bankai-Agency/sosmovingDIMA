#!/usr/bin/env node
/**
 * Extract body content from all legacy HTML pages
 * and save as static HTML files in public/pages/
 */
import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'fs';
import { join, relative } from 'path';

const LEGACY = './_legacy';
const OUTPUT = './public/pages';

mkdirSync(OUTPUT, { recursive: true });

function fixAssetPaths(html) {
  return html
    .replace(/assets\/cdn\/645ab1d97922876b775bef4f\//g, '/images/general/')
    .replace(/assets\/cdn\/645ab1d97922878b6f5bef7f\//g, '/images/blog/')
    .replace(/href="(?!http|mailto|tel|#|javascript)([^"]*?)\/index\.html"/g, 'href="/$1"')
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href="\.\.\/([^"]*?)\/index\.html"/g, 'href="/$1"')
    .replace(/href="\.\.\/\.\.\/([^"]*?)\/index\.html"/g, 'href="/$1"')
    // Remove broken asset refs
    .replace(/src="[^"]*assets\/speedy[^"]*"/g, 'src=""')
    .replace(/src="[^"]*assets\/libs[^"]*"/g, 'src=""')
    .replace(/src="[^"]*assets\/other[^"]*"/g, 'src=""');
}

function extractPageContent(htmlPath) {
  const html = readFileSync(htmlPath, 'utf-8');
  const $ = load(html);

  // Remove scripts, noscript, and code embeds with style
  $('script').remove();
  $('noscript').remove();

  let content = '';
  $('body > *').each((i, el) => {
    const tag = $(el).prop('tagName');
    const cls = $(el).attr('class') || '';
    if (tag === 'SCRIPT' || tag === 'NOSCRIPT') return;
    if (cls === 'code w-embed') {
      // Keep this one - it has important inline styles
      content += $.html(el) + '\n';
      return;
    }
    content += $.html(el) + '\n';
  });

  return fixAssetPaths(content);
}

// Process all pages
let count = 0;

function processDir(dir, outputSubdir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (!statSync(fullPath).isDirectory()) continue;
    if (entry === 'assets' || entry === '.git' || entry === '.claude') continue;

    const indexPath = join(fullPath, 'index.html');
    if (existsSync(indexPath)) {
      const slug = relative(LEGACY, fullPath).replace(/\//g, '__');
      const outputPath = join(OUTPUT, `${slug}.html`);

      try {
        const content = extractPageContent(indexPath);
        writeFileSync(outputPath, content);
        count++;
      } catch (e) {
        // skip
      }

      // Process subdirectories
      processDir(fullPath, join(outputSubdir, entry));
    }
  }
}

// Also process root index.html
const rootContent = extractPageContent(join(LEGACY, 'index.html'));
writeFileSync(join(OUTPUT, 'index.html'), rootContent);
count++;

processDir(LEGACY, '');

console.log(`Extracted ${count} pages to ${OUTPUT}`);
