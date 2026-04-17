import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * services-areas — service-area list/map block, 2 pages (index, sitemap).
 *
 * Frame: <section class="services-areas">.
 * Phase 3: <ServiceAreas areas={...} /> (share with sitemap if possible).
 */
export function SectionServicesAreas(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
