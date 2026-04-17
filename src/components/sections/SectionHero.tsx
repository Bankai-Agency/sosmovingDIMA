import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * services-hero-section — the hero block used across almost every page.
 * 11 variants seen: base, is-blog-article-hero is-without-bg-image,
 * with-rating mobile (cities), is-reviews-hero-section, is-contact-section,
 * is-blog-article-hero is-free-quote-page (forms), etc.
 *
 * CONTENT THAT VARIES per page:
 *  - Title text (H1)
 *  - Background image / video
 *  - Rating badges visibility
 *  - Optional breadcrumbs (blog posts)
 *  - Embedded form (free-quote / book-online variants)
 *  - Call-to-action button text
 *  - On `is-contact-section`: contact-info block with phones/emails/map
 *
 * Frame: tag "section" or "div", className as extracted.
 * Phase 3 plan: replace this with a <Hero variant={...} data={...} /> JSX component
 * driven by per-page JSON in src/data/pages/{slug}/hero.json.
 */
export function SectionHero(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
