import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * local-white-content-section — local SEO text block (white background), 115 pages.
 *
 * VARIES: long city-specific descriptions.
 * Frame: <div class="local-white-content-section">.
 * Phase 3: <LocalContent heading={...} paragraphs={...} />.
 */
export function SectionLocalWhiteContent(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
