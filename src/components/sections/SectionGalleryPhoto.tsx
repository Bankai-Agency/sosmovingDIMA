import { SharedSection } from './SharedSection';
import type { ParsedSection } from './types';

/** gallery-photo-section — gallery page photo mosaic, 1 page. */
export function SectionGalleryPhoto(section: ParsedSection) {
  return <SharedSection tag={section.tag} className={section.className} innerHtml={section.innerHtml} />;
}
