#!/usr/bin/env node
/**
 * Удаляет дублирующиеся <navbar> и <footer> на top-level из HTML-страниц
 * в public/pages/. Эти блоки добавляются глобально через layout.tsx, поэтому
 * не должны находиться в теле страницы.
 *
 * Цели: 41 новая страница, перенесённая через scrape-missing-pages.mjs
 * (которая в исходной версии не вырезала эти блоки).
 *
 * Usage:
 *   node scripts/strip-duplicate-navbar-footer.mjs              # все файлы в public/pages
 *   node scripts/strip-duplicate-navbar-footer.mjs <file> [...]
 */

import { load } from 'cheerio';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const PAGES_DIR = './public/pages';

function stripFile(path) {
  const html = readFileSync(path, 'utf-8');
  const $ = load(html, { decodeEntities: false });

  let removed = 0;

  // Удалить ВСЕ <footer> элементы (HTML5 footer — используется только для site footer)
  $('footer').each((_i, el) => {
    $(el).remove();
    removed++;
  });

  // Удалить Webflow-навбар везде где найдём (характерный класс "navbar w-nav")
  $('.navbar.w-nav').each((_i, el) => {
    $(el).remove();
    removed++;
  });

  // Дополнительно — если есть просто .navbar на верху, без w-nav
  $('body > .navbar').each((_i, el) => {
    $(el).remove();
    removed++;
  });

  if (removed === 0) return false;

  // Сохраняем только body content (как делает extract-pages-html.mjs)
  let content = '';
  // Если есть body, берём его детей. Иначе — корневые ноды.
  const bodyKids = $('body > *');
  const targetKids = bodyKids.length > 0 ? bodyKids : $.root().children();

  targetKids.each((_i, el) => {
    content += $.html(el) + '\n';
  });

  writeFileSync(path, content);
  return removed;
}

// ────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

let files;
if (args.length > 0) {
  files = args;
} else {
  files = readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(PAGES_DIR, f));
}

console.log(`🧹 Проверяю ${files.length} файлов...\n`);

let totalCleaned = 0;
for (const file of files) {
  try {
    const removed = stripFile(file);
    if (removed) {
      console.log(`  ✓ ${file}: убрано ${removed} блоков`);
      totalCleaned++;
    }
  } catch (e) {
    console.warn(`  ⚠ ${file}: ${e.message}`);
  }
}

console.log(`\n✅ Готово. Очищено файлов: ${totalCleaned} из ${files.length}`);
