import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/** blog-section — /blog listing page, 1 page. Phase 3: <BlogListing posts={...} pagination={...} /> */
export function SectionBlog(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
