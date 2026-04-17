// Parses a page HTML file and returns an ordered array of top-level sections.
// Each section: { type, tag, className, innerHtml }
// `type` is the first CSS class token (e.g. "services-hero-section").
// `innerHtml` is everything inside the element — preserved verbatim for 1:1 render.
//
// This runs at build time (in Server Components). After build, rendering is
// instant — the parsed data is frozen into static HTML.

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as cheerio from 'cheerio';
import type { ParsedSection } from '@/components/sections/types';

const PAGES_DIR = join(process.cwd(), 'public/pages');

const cache = new Map<string, ParsedSection[]>();

export function parsePageSections(slug: string): ParsedSection[] {
  if (cache.has(slug)) return cache.get(slug)!;

  const filePath = join(PAGES_DIR, `${slug}.html`);
  if (!existsSync(filePath)) return [];

  const html = readFileSync(filePath, 'utf-8');
  // Wrap in a fake body so cheerio treats the fragment as siblings of body
  const $ = cheerio.load(`<body>${html}</body>`, { decodeEntities: false });

  const sections: ParsedSection[] = [];
  $('body').children().each((_i, el) => {
    const $el = $(el);
    const tag = (el as cheerio.Element & { name?: string }).name ?? 'div';
    const className = $el.attr('class') ?? '';
    const type = className.split(/\s+/)[0] || '__noclass__';
    const innerHtml = $el.html() ?? '';
    sections.push({ type, tag, className, innerHtml });
  });

  cache.set(slug, sections);
  return sections;
}
