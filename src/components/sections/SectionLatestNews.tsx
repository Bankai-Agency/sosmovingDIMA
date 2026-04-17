import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * latest-news-section (is-have-slider) — "Latest Articles" / "Read more" blog carousel.
 * 397 pages (mostly blog posts, plus homepage + moving-services).
 *
 * VARIES: usually a fixed list of 6-12 recent blog posts — shared template.
 * Frame: <div class="latest-news-section is-have-slider">.
 * Phase 3: <LatestNews posts={...} />.
 */
export function SectionLatestNews(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
