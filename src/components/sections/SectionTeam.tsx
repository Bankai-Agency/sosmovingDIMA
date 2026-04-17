import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/** team-section — meet-our-team grid, 1 page. */
export function SectionTeam(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
