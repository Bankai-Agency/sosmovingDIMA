import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PAGES_DIR = join(process.cwd(), 'public/pages');

export function getPageHTML(slug: string): string | null {
  // Try exact match
  const filePath = join(PAGES_DIR, `${slug}.html`);
  if (existsSync(filePath)) {
    return readFileSync(filePath, 'utf-8');
  }
  return null;
}

export function getNestedPageHTML(parent: string, child: string): string | null {
  const slug = `${parent}__${child}`;
  return getPageHTML(slug);
}
