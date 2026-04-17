import { parsePageSections } from './page-sections';
import { SectionRenderer } from '@/components/sections/registry';

/**
 * Reads `public/pages/{slug}.html`, parses its top-level sections, and
 * renders each through a specialized component from the section registry.
 *
 * Usage in a page.tsx:
 *   export default function Page() { return renderPage('beverly-hills-movers'); }
 */
export function renderPage(slug: string) {
  const sections = parsePageSections(slug);
  if (!sections.length) {
    return <div>Page not found: {slug}</div>;
  }
  return <SectionRenderer sections={sections} />;
}
