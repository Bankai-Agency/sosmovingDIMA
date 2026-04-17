import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * section-reviews (is-have-slider) — text/video review carousel, 130 pages.
 *
 * VARIES per page: review texts, author names, photos, star ratings, video thumbs.
 * Frame stable: <section class="section-reviews is-have-slider">.
 * Phase 3: <ReviewsTextCarousel items={...} /> with Embla or Motion slider.
 */
export function SectionReviewsText(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
