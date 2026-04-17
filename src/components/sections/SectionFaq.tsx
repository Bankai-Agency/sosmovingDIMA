import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * faq-section — accordion FAQ, 123 pages. Two variants (base, is-mb-0).
 *
 * VARIES: question/answer pairs per page.
 * Frame: <div class="faq-section"> or <section class="faq-section">.
 * Phase 3: <Faq items={...} />.
 */
export function SectionFaq(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
