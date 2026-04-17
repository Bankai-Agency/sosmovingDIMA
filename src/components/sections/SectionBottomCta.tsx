import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * bottom-cta-section — final CTA block before the footer, on 524 pages.
 *
 * VARIES per page:
 *  - Title / subtitle text
 *  - Phone number shown
 *  - Small decorative images
 *  - Embedded multi-step form (`form-steps-w`)
 *
 * Frame is stable: <section class="bottom-cta-section">.
 * Phase 3 plan: <BottomCta heading={...} subtitle={...} phone={...} />
 * driven by per-page JSON.
 */
export function SectionBottomCta(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
