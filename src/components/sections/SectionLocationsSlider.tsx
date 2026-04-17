import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * locations-section (is-have-slider) — horizontal city carousel, 11 pages.
 *
 * Frame: <section class="locations-section is-have-slider">.
 * Phase 3: <LocationsSlider cities={...} />.
 */
export function SectionLocationsSlider(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
