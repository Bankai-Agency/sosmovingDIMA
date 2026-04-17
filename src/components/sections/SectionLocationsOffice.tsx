import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * locations-office-section — city/office grid with photos + addresses, 116 pages.
 *
 * VARIES: location list (changes per page, some list 3-4, others more).
 * Frame: <div class="locations-office-section">.
 * Phase 3: <LocationsOffice offices={...} />.
 */
export function SectionLocationsOffice(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
