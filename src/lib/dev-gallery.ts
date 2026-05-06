// Dev-only utility: scans every public/pages/*.html and collects unique
// variants of a given top-level section type. Used by the /dev/* preview
// pages to render every component variation on a single scroll.
//
// Pattern matches page-sections.ts — wraps HTML in <body>, takes direct
// children, groups by the full className string.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';

export interface SectionVariant {
  /** First CSS class token (the "type") */
  firstClass: string;
  /** Full class attribute, e.g. "services-hero-section is-blog-article-hero is-without-bg-image" */
  fullClassName: string;
  /** Page slugs where this exact className appears, sorted alphabetically */
  pages: string[];
  /** outerHTML of the first occurrence (used as the rendering sample) */
  html: string;
  /** HTML tag (usually 'section' or 'div') */
  tag: string;
}

const PAGES_DIR = join(process.cwd(), 'public/pages');
const variantCache = new Map<string, SectionVariant[]>();

/**
 * Returns every unique className variant for the given section types,
 * sorted by page-count desc (most common variant first).
 *
 * Results are cached per firstClasses tuple — safe to call on every request
 * because the underlying HTML files are immutable at runtime.
 */
export function getSectionVariants(firstClasses: string[]): SectionVariant[] {
  const cacheKey = [...firstClasses].sort().join('|');
  const cached = variantCache.get(cacheKey);
  if (cached) return cached;

  const variantMap = new Map<string, SectionVariant>();
  const typeSet = new Set(firstClasses);

  for (const f of readdirSync(PAGES_DIR)) {
    if (!f.endsWith('.html')) continue;
    const slug = f.slice(0, -5);
    const html = readFileSync(join(PAGES_DIR, f), 'utf8');
    const $ = cheerio.load(`<body>${html}</body>`, { decodeEntities: false });

    $('body').children().each((_i, el) => {
      const className = ($(el).attr('class') ?? '').trim();
      const firstClass = className.split(/\s+/)[0] || '__noclass__';
      if (!typeSet.has(firstClass)) return;
      const key = className || '(no class)';
      if (!variantMap.has(key)) {
        variantMap.set(key, {
          firstClass,
          fullClassName: key,
          pages: [],
          html: $.html(el) ?? '',
          tag: (el as cheerio.Element & { name?: string }).name ?? 'div',
        });
      }
      variantMap.get(key)!.pages.push(slug);
    });
  }

  const result = Array.from(variantMap.values())
    .map(v => ({ ...v, pages: [...v.pages].sort() }))
    .sort((a, b) => b.pages.length - a.pages.length);

  variantCache.set(cacheKey, result);
  return result;
}

/** Page count for a variant — convenience wrapper. */
export function variantPageCount(v: SectionVariant): number {
  return v.pages.length;
}
