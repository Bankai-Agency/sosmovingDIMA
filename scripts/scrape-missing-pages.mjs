#!/usr/bin/env node
/**
 * Скрейпит указанные страницы с https://www.sosmovingla.net
 * Сохраняет HTML в public/pages/{slug}.html в том же формате, что extract-pages-html.mjs.
 * Скачивает все картинки в public/images/general/ или /blog/ и переписывает пути.
 *
 * Usage:
 *   node scripts/scrape-missing-pages.mjs <url-path> [<url-path>...]
 *   node scripts/scrape-missing-pages.mjs --list path/to/urls.txt
 *
 * Например:
 *   node scripts/scrape-missing-pages.mjs /la-crescenta-movers
 *   node scripts/scrape-missing-pages.mjs --list /tmp/missing.txt
 */

import { load } from 'cheerio';
import { writeFileSync, mkdirSync, existsSync, readFileSync, createWriteStream } from 'fs';
import { join, basename, dirname } from 'path';
import { pipeline } from 'stream/promises';

const ORIGIN = 'https://www.sosmovingla.net';
const PAGES_DIR = './public/pages';
const IMAGES_GENERAL = './public/images/general';
const IMAGES_BLOG = './public/images/blog';

mkdirSync(PAGES_DIR, { recursive: true });
mkdirSync(IMAGES_GENERAL, { recursive: true });
mkdirSync(IMAGES_BLOG, { recursive: true });

// ────────────────────────────────────────────────────────────
// URL path → output slug (имя файла без .html)
// /la-crescenta-movers → la-crescenta-movers
// /services/compliance → services__compliance
// /careers/accounting-specialist → careers__accounting-specialist
// /blog/foo-bar → blog__foo-bar
// /category/general → category__general
// ────────────────────────────────────────────────────────────
function urlPathToSlug(urlPath) {
  const clean = urlPath.replace(/^\//, '').replace(/\/$/, '');
  return clean.replace(/\//g, '__');
}

// ────────────────────────────────────────────────────────────
// Скачать изображение в локальный путь, вернуть локальный URL
// ────────────────────────────────────────────────────────────
const downloadedImages = new Map(); // remoteUrl → localPath

async function downloadImage(remoteUrl, isBlogContext) {
  if (downloadedImages.has(remoteUrl)) {
    return downloadedImages.get(remoteUrl);
  }

  // Определить категорию по содержимому URL (Webflow CDN paths)
  // 645ab1d97922876b775bef4f → general (общие ассеты)
  // 645ab1d97922878b6f5bef7f → blog (картинки статей)
  let targetDir;
  let subPath;
  if (remoteUrl.includes('645ab1d97922878b6f5bef7f') || isBlogContext) {
    targetDir = IMAGES_BLOG;
    subPath = '/images/blog/';
  } else if (remoteUrl.includes('645ab1d97922876b775bef4f')) {
    targetDir = IMAGES_GENERAL;
    subPath = '/images/general/';
  } else {
    // Внешние или неизвестные — fallback в general
    targetDir = IMAGES_GENERAL;
    subPath = '/images/general/';
  }

  const filename = decodeURIComponent(basename(remoteUrl.split('?')[0]));
  const localPath = join(targetDir, filename);
  const localUrl = `${subPath}${filename}`;

  if (existsSync(localPath)) {
    downloadedImages.set(remoteUrl, localUrl);
    return localUrl;
  }

  try {
    const fullUrl = remoteUrl.startsWith('http') ? remoteUrl : `${ORIGIN}${remoteUrl.startsWith('/') ? '' : '/'}${remoteUrl}`;
    const res = await fetch(fullUrl);
    if (!res.ok) {
      console.warn(`  ⚠ image ${res.status}: ${fullUrl}`);
      downloadedImages.set(remoteUrl, remoteUrl); // оставить как есть
      return remoteUrl;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(localPath, buffer);
    console.log(`  ✓ image: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`);
    downloadedImages.set(remoteUrl, localUrl);
    return localUrl;
  } catch (e) {
    console.warn(`  ⚠ image fail: ${remoteUrl} — ${e.message}`);
    downloadedImages.set(remoteUrl, remoteUrl);
    return remoteUrl;
  }
}

// ────────────────────────────────────────────────────────────
// Извлечь body content (как делает extract-pages-html.mjs)
// ────────────────────────────────────────────────────────────
function extractBodyContent(html) {
  const $ = load(html);
  $('script').remove();
  $('noscript').remove();

  // КРИТИЧНО: убрать дублирующиеся navbar и footer — они приходят
  // глобально из src/app/(webflow)/layout.tsx. Без strip'а будет
  // 2 navbar и 2 footer на странице.
  $('footer').remove();
  $('.navbar.w-nav').remove();
  $('body > .navbar').remove();

  let content = '';
  $('body > *').each((_i, el) => {
    const tag = $(el).prop('tagName');
    if (tag === 'SCRIPT' || tag === 'NOSCRIPT') return;
    content += $.html(el) + '\n';
  });
  return content;
}

// ────────────────────────────────────────────────────────────
// fixAssetPaths из extract-pages-html.mjs + дополнения
// ────────────────────────────────────────────────────────────
function fixAssetPaths(html) {
  return html
    // Webflow public CDN (актуальный путь, как на live sosmovingla.net)
    .replace(/https?:\/\/cdn\.prod\.website-files\.com\/645ab1d97922876b775bef4f\//g, '/images/general/')
    .replace(/https?:\/\/cdn\.prod\.website-files\.com\/645ab1d97922878b6f5bef7f\//g, '/images/blog/')
    // Старые self-hosted пути (для совместимости с extract-pages-html.mjs)
    .replace(/https?:\/\/(?:www\.)?sosmovingla\.net\/assets\/cdn\/645ab1d97922876b775bef4f\//g, '/images/general/')
    .replace(/https?:\/\/(?:www\.)?sosmovingla\.net\/assets\/cdn\/645ab1d97922878b6f5bef7f\//g, '/images/blog/')
    .replace(/\/?assets\/cdn\/645ab1d97922876b775bef4f\//g, '/images/general/')
    .replace(/\/?assets\/cdn\/645ab1d97922878b6f5bef7f\//g, '/images/blog/')
    // Внутренние ссылки sosmovingla.net → относительные
    .replace(/https?:\/\/(?:www\.)?sosmovingla\.net\//g, '/')
    .replace(/https?:\/\/(?:www\.)?sosmovingla\.net(?=["'\s])/g, '/')
    // index.html → /
    .replace(/href="([^"]*?)\/index\.html"/g, 'href="/$1"')
    .replace(/href="index\.html"/g, 'href="/"')
    // Broken asset refs (см. extract-pages-html.mjs)
    .replace(/src="[^"]*assets\/speedy[^"]*"/g, 'src=""')
    .replace(/src="[^"]*assets\/libs[^"]*"/g, 'src=""')
    .replace(/src="[^"]*assets\/other[^"]*"/g, 'src=""');
}

// ────────────────────────────────────────────────────────────
// Найти все картинки в HTML и скачать их
// ────────────────────────────────────────────────────────────
async function downloadAllImages(html, isBlogPage) {
  const $ = load(html, { decodeEntities: false });

  // Собираем все image URL: src, srcset, data-*, style
  const imageUrls = new Set();

  $('img').each((_i, el) => {
    const $el = $(el);
    const src = $el.attr('src');
    if (src && !src.startsWith('data:')) imageUrls.add(src);

    const srcset = $el.attr('srcset');
    if (srcset) {
      srcset.split(',').forEach((part) => {
        const url = part.trim().split(/\s+/)[0];
        if (url && !url.startsWith('data:')) imageUrls.add(url);
      });
    }
  });

  // Background-image в style атрибутах
  $('[style*="url("]').each((_i, el) => {
    const style = $(el).attr('style') || '';
    const matches = [...style.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)];
    matches.forEach((m) => {
      if (m[1] && !m[1].startsWith('data:')) imageUrls.add(m[1]);
    });
  });

  // Фильтруем — только Webflow CDN или картинки с sosmovingla
  const targets = [...imageUrls].filter(
    (u) =>
      u.includes('sosmovingla.net') ||
      u.includes('cdn.prod.website-files.com') ||
      u.includes('assets/cdn/') ||
      u.startsWith('/assets/cdn/')
  );

  console.log(`  → найдено ${targets.length} картинок для скачивания`);

  // Скачиваем последовательно (чтобы не убить sosmovingla)
  for (const url of targets) {
    await downloadImage(url, isBlogPage);
  }
}

// ────────────────────────────────────────────────────────────
// Скрейпить одну страницу
// ────────────────────────────────────────────────────────────
async function scrapePage(urlPath) {
  const slug = urlPathToSlug(urlPath);
  const outputPath = join(PAGES_DIR, `${slug}.html`);
  const isBlog = urlPath.startsWith('/blog/');

  console.log(`\n📄 ${urlPath}  →  ${slug}.html`);

  if (existsSync(outputPath)) {
    console.log(`  ⏭  уже существует, пропускаю`);
    return;
  }

  const fullUrl = `${ORIGIN}${urlPath}`;
  const res = await fetch(fullUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SOS-Migration-Bot/1.0)' },
  });

  if (!res.ok) {
    console.error(`  ✗ HTTP ${res.status} — ${fullUrl}`);
    return;
  }

  const html = await res.text();

  // 1. Скачать все картинки
  await downloadAllImages(html, isBlog);

  // 2. Извлечь body content
  let content = extractBodyContent(html);

  // 3. Переписать asset paths
  content = fixAssetPaths(content);

  // 4. Сохранить
  writeFileSync(outputPath, content);
  console.log(`  ✓ сохранено: ${outputPath} (${(content.length / 1024).toFixed(1)}KB)`);
}

// ────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

let urls = [];
if (args[0] === '--list' && args[1]) {
  urls = readFileSync(args[1], 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
} else {
  urls = args.filter((a) => a.startsWith('/'));
}

if (urls.length === 0) {
  console.error('Usage: node scripts/scrape-missing-pages.mjs <url-path> [...] | --list file.txt');
  process.exit(1);
}

console.log(`Скрейплю ${urls.length} страниц с ${ORIGIN}\n`);

for (const url of urls) {
  try {
    await scrapePage(url);
  } catch (e) {
    console.error(`✗ ${url}: ${e.message}`);
  }
}

console.log(`\n✅ Готово. Обработано ${urls.length} страниц.`);
