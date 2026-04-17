import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * Miscellaneous single-page sections — each renders as passthrough.
 * Keep them simple since they each appear on just 1 page.
 */

export function SectionMilestones(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
export function SectionHeroForm(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
export function SectionContent(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
export function SectionTouchbar(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
export function SectionDelivery(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
export function SectionPageWrapper(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}

/**
 * <code class="w-embed"> — inline Webflow embedded scripts/styles, 535 pages.
 * Must render as-is — these are usually page-specific scripts.
 */
export function SectionCodeEmbed(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}

/**
 * <div class="w-embed w-iframe"> — Webflow iframe embeds, 139 pages.
 */
export function SectionWEmbed(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
