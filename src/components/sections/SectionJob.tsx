import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/** job-section — careers page jobs list, 1 page. */
export function SectionJob(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
