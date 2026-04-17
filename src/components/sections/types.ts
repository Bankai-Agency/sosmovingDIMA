// Parsed section descriptor — what comes out of parsePageSections()
export interface ParsedSection {
  /** Primary class token, e.g. "services-hero-section" */
  type: string;
  /** Tag name, e.g. "section" or "div" */
  tag: string;
  /** Full className string (including variants), e.g. "services-hero-section is-blog-article-hero" */
  className: string;
  /** Inner HTML of the element (everything between open/close tag) */
  innerHtml: string;
}
