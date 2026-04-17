import type { ParsedSection } from './types';
import { SharedSection } from './SharedSection';
import { SectionHero } from './SectionHero';
import { SectionBottomCta } from './SectionBottomCta';
import { SectionReviewsText } from './SectionReviewsText';
import { SectionReviewsRating } from './SectionReviewsRating';
import { SectionWhySos } from './SectionWhySos';
import { SectionServices } from './SectionServices';
import { SectionFaq } from './SectionFaq';
import { SectionLatestNews } from './SectionLatestNews';
import { SectionServiceContent } from './SectionServiceContent';
import { SectionLocationsOffice } from './SectionLocationsOffice';
import { SectionLocalWhiteContent } from './SectionLocalWhiteContent';
import { SectionLocationsSlider } from './SectionLocationsSlider';
import { SectionAboutCompany } from './SectionAboutCompany';
import { SectionContact } from './SectionContact';
import { SectionServicesAreas } from './SectionServicesAreas';
import { SectionTeam } from './SectionTeam';
import { SectionJob } from './SectionJob';
import { SectionGalleryPhoto } from './SectionGalleryPhoto';
import { SectionBlog } from './SectionBlog';
import {
  SectionMilestones,
  SectionHeroForm,
  SectionContent,
  SectionTouchbar,
  SectionDelivery,
  SectionPageWrapper,
  SectionCodeEmbed,
  SectionWEmbed,
} from './SectionMisc';

type SectionComponent = (s: ParsedSection) => React.ReactElement | null;

/**
 * Map primary CSS class → specialized component.
 * Everything unmapped falls back to <SharedSection> (identical pass-through).
 *
 * Some Webflow classes are shared between a <section> and a <div> with
 * different semantics — we disambiguate with `${type}|${tag}` when needed.
 * Hero on index/moving-services uses `<section class="hero-section">` distinctly
 * from city pages' `<div class="services-hero-section">`.
 */
const REGISTRY: Record<string, SectionComponent> = {
  // Hero variants (the BIG one, 532+ occurrences across 11 variants)
  'services-hero-section': SectionHero,
  'hero-section': SectionHero,
  'hero-form-section': SectionHeroForm,

  // Body frames
  'bottom-cta-section': SectionBottomCta,
  'section-reviews': SectionReviewsText,
  'reviews-section': SectionReviewsRating,
  'why-sos-section': SectionWhySos,
  'services-section': SectionServices,
  'faq-section': SectionFaq,
  'latest-news-section': SectionLatestNews,
  'service-content-section': SectionServiceContent,
  'locations-office-section': SectionLocationsOffice,
  'local-white-content-section': SectionLocalWhiteContent,
  'locations-section': SectionLocationsSlider,
  'about-company-section': SectionAboutCompany,
  'contact-section': SectionContact,
  'services-areas': SectionServicesAreas,

  // Single-page sections
  'team-section': SectionTeam,
  'job-section': SectionJob,
  'gallery-photo-section': SectionGalleryPhoto,
  'blog-section': SectionBlog,
  'milestones-section': SectionMilestones,
  'content-section': SectionContent,
  'touchbar': SectionTouchbar,
  'delivery-section': SectionDelivery,
  'page-wrapper': SectionPageWrapper,

  // Webflow embeds (scripts/iframes)
  'code': SectionCodeEmbed,
  'w-embed': SectionWEmbed,
};

export function SectionRenderer({ sections }: { sections: ParsedSection[] }) {
  return (
    <>
      {sections.map((s, i) => {
        const Comp = REGISTRY[s.type] ?? SharedSection;
        // SharedSection has a different prop signature, handle it separately
        if (Comp === SharedSection) {
          return <SharedSection key={i} tag={s.tag} className={s.className} innerHtml={s.innerHtml} />;
        }
        return <Comp key={i} {...s} />;
      })}
    </>
  );
}
