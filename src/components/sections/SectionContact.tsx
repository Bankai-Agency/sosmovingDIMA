import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * contact-section (is-footer-next) — contact CTA block, 3 pages.
 *
 * Frame: <div class="contact-section is-footer-next">.
 * Phase 3: <ContactCta /> — share with BottomCta maybe.
 */
export function SectionContact(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
