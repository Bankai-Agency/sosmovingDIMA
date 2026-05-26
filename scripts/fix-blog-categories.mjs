#!/usr/bin/env node
/**
 * Фиксит категории блога:
 * 1. Скрейпит 11 страниц /category/* с sosmovingla.net (с пагинацией)
 * 2. Извлекает список slug'ов блог-статей в каждой категории
 * 3. Обновляет src/data/shared/categories.json (11 реальных категорий)
 * 4. Обновляет category: в frontmatter каждого .md файла в src/data/blog/
 */

import { load } from 'cheerio';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const ORIGIN = 'https://www.sosmovingla.net';
const BLOG_DIR = './src/data/blog';
const CATEGORIES_JSON = './src/data/shared/categories.json';

const CATEGORIES = [
  'after-the-move',
  'business-relocation',
  'general',
  'local-moving-tips',
  'long-distance',
  'los-angeles',
  'move-sustainably',
  'moving-day-preparation',
  'moving-professionals',
  'packing-tips',
  'top-places-to-live',
];

// Дружелюбные имена для отображения
const CATEGORY_LABELS = {
  'after-the-move': 'After the Move',
  'business-relocation': 'Business Relocation',
  'general': 'General',
  'local-moving-tips': 'Local Moving Tips',
  'long-distance': 'Long Distance',
  'los-angeles': 'Los Angeles',
  'move-sustainably': 'Move Sustainably',
  'moving-day-preparation': 'Moving Day Preparation',
  'moving-professionals': 'Moving Professionals',
  'packing-tips': 'Packing Tips',
  'top-places-to-live': 'Top Places to Live',
};

// ────────────────────────────────────────────────────────────
// Скрейпит страницу категории и возвращает массив slug'ов блог-статей.
// Учитывает пагинацию: ?page=2, ?page=3 etc, пока не вернётся 0 статей.
// ────────────────────────────────────────────────────────────
async function scrapeCategoryPage(categorySlug) {
  const allSlugs = new Set();
  let page = 1;

  while (true) {
    // Webflow CMS-pagination format: ?12faded4_page=N
    const url = page === 1
      ? `${ORIGIN}/category/${categorySlug}`
      : `${ORIGIN}/category/${categorySlug}?12faded4_page=${page}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SOS-Migration-Bot/1.0)' },
    });
    if (!res.ok) break;

    const html = await res.text();
    const $ = load(html);

    let foundOnThisPage = 0;
    // Ищем ссылки на блог-статьи. Webflow обычно использует <a href="/blog/slug">
    $('a[href*="/blog/"]').each((_i, el) => {
      const href = $(el).attr('href') || '';
      const m = href.match(/\/blog\/([a-z0-9-]+)$/i);
      if (m && m[1] && m[1] !== 'blog' && !allSlugs.has(m[1])) {
        allSlugs.add(m[1]);
        foundOnThisPage++;
      }
    });

    console.log(`  /category/${categorySlug}${page > 1 ? `?page=${page}` : ''}: +${foundOnThisPage} статей (всего ${allSlugs.size})`);

    if (foundOnThisPage === 0) break;
    if (page > 50) break; // safety
    page++;
  }

  return [...allSlugs];
}

// ────────────────────────────────────────────────────────────
// Обновить frontmatter в .md файле — заменить category: "..."
// ────────────────────────────────────────────────────────────
function updateMdCategory(slug, newCategory) {
  const path = join(BLOG_DIR, `${slug}.md`);
  let content;
  try {
    content = readFileSync(path, 'utf-8');
  } catch {
    return false;
  }

  // Заменить category: "..." (внутри frontmatter)
  const updated = content.replace(
    /^category:\s*"[^"]*"$/m,
    `category: "${newCategory}"`
  );

  if (updated === content) return false;
  writeFileSync(path, updated);
  return true;
}

// ────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────
console.log('🔍 Скрейплю 11 страниц категорий с sosmovingla.net...\n');

const blogToCategory = new Map(); // blog-slug → category-slug

for (const cat of CATEGORIES) {
  console.log(`\n📁 Категория: ${cat}`);
  const slugs = await scrapeCategoryPage(cat);
  for (const slug of slugs) {
    // Если статья уже в другой категории — оставляем первую (категория может пересекаться)
    if (!blogToCategory.has(slug)) {
      blogToCategory.set(slug, cat);
    }
  }
}

console.log(`\n📊 Всего собрано маппингов: ${blogToCategory.size}`);

// Список наших .md файлов
const ourBlogSlugs = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace('.md', ''));

console.log(`📝 Наших .md статей: ${ourBlogSlugs.length}`);

// Применяем
let updated = 0;
let notInMap = 0;
const missingSlugs = [];
for (const slug of ourBlogSlugs) {
  const cat = blogToCategory.get(slug);
  if (!cat) {
    notInMap++;
    missingSlugs.push(slug);
    // Без фолбэка — оставляем "general" если не нашли
    // (general уже выбран как наименее специфичный)
    if (updateMdCategory(slug, 'general')) updated++;
    continue;
  }
  if (updateMdCategory(slug, cat)) updated++;
}

console.log(`\n✅ Обновлено .md файлов: ${updated}`);
console.log(`⚠️  Не нашли в маппинге (fallback → general): ${notInMap}`);
if (missingSlugs.length > 0 && missingSlugs.length < 50) {
  console.log(`   Не нашли: ${missingSlugs.slice(0, 20).join(', ')}${missingSlugs.length > 20 ? '...' : ''}`);
}

// Обновить categories.json — теперь это массив реальных категорий, не заголовков статей
writeFileSync(
  CATEGORIES_JSON,
  JSON.stringify(CATEGORIES, null, 2) + '\n'
);
console.log(`\n📄 ${CATEGORIES_JSON} обновлён (11 категорий)`);

// Сохранить labels отдельно для UI
const LABELS_JSON = './src/data/shared/category-labels.json';
writeFileSync(
  LABELS_JSON,
  JSON.stringify(CATEGORY_LABELS, null, 2) + '\n'
);
console.log(`📄 ${LABELS_JSON} создан (имена для UI)`);
