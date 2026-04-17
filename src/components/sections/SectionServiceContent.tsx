import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * service-content-section — text-and-image content block, 242 occurrences
 * (cities, services, about-us-sub). Two variants (base, is-mb-0).
 *
 * VARIES: heading, paragraph, image, list items.
 * Frame: <div class="service-content-section">.
 * Phase 3: <ServiceContent heading={...} body={...} image={...} />.
 */
export function SectionServiceContent(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
