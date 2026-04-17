import { readFileSync } from 'fs';
import { join } from 'path';

const SHARED_DIR = join(process.cwd(), 'src/data/shared');

// Read once at build time. In dev, this will re-read on HMR since it's in a Server Component.
function read(name: string): string {
  try {
    return readFileSync(join(SHARED_DIR, `${name}.html`), 'utf-8');
  } catch {
    return '';
  }
}

/**
 * Renders a shared HTML block from src/data/shared/{name}.html
 * Server Component — reads file at build time, renders via dangerouslySetInnerHTML.
 * The HTML is from Webflow and includes absolute paths + className hooks that
 * webflow.css and ScriptLoader/IX2 depend on.
 */
export function SharedHtmlBlock({ name }: { name: 'navbar' | 'footer' | 'exit-popup' }) {
  const html = read(name);
  if (!html) return null;
  return <div data-shared-block={name} dangerouslySetInnerHTML={{ __html: html }} />;
}
