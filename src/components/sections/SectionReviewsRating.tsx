import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/**
 * reviews-section (is-have-slider) — Yelp/Google review store-logo slider, 127 pages.
 *
 * VARIES: logos, rating numbers, review counts — otherwise stable.
 * Frame: <section class="reviews-section is-have-slider">.
 * Phase 3: <ReviewsStoreStrip ratings={{yelp: {...}, google: {...}}} />.
 */
export function SectionReviewsRating(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
