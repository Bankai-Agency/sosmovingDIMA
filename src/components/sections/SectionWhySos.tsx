import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * why-sos-section — "Why SOS Moving" USP section with icons + photo, 128 pages.
 *
 * VARIES: bullet texts per page (slightly — more generic on cities).
 * Frame: <section class="why-sos-section">.
 * Phase 3: <WhySos items={...} /> with icon components.
 */
export function SectionWhySos(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
