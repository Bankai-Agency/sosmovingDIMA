import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * services-section — "SOS Moving Services" grid of icon tiles, 122 pages.
 *
 * VARIES: service list (usually identical — Apartment/Commercial/Packing/
 * White Glove/Storage/Movers), some pages highlight current service.
 * Frame: <section class="services-section">.
 * Phase 3: <ServicesGrid items={...} activeHref={...} />.
 */
export function SectionServices(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
