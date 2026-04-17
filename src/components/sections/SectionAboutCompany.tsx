import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * about-company-section — "About Company" block with vertical photo scroll.
 * Used on index.html and moving-services.html only.
 *
 * Frame: <section class="about-company-section">.
 * Phase 3: <AboutCompany copy={...} photos={...} />
 * (currently driven by a CSS @keyframes scroll animation in globals.css).
 */
export function SectionAboutCompany(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
