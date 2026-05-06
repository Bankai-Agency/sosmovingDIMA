// Dev preview: every unique variant of a given section type on one scroll.
// One dynamic route serves all 20+ section galleries. See TYPE_MAP below
// for the mapping of URL segment → which first-class tokens to collect.

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getSectionVariants } from '@/lib/dev-gallery';
import { VariantHeader } from '@/components/dev/VariantHeader';

interface TypeConfig {
  title: string;
  firstClasses: string[];
  note?: string;
}

const TYPE_MAP: Record<string, TypeConfig> = {
  'hero': {
    title: 'Hero',
    firstClasses: ['services-hero-section', 'hero-section'],
    note: 'Includes both the modern `services-hero-section` (used almost everywhere) and the legacy `hero-section` (only on `/` and `/moving-services`).',
  },
  'service-content': {
    title: 'Service Content',
    firstClasses: ['service-content-section'],
    note: 'Large text-with-image blocks on city/service pages. `is-mb-0` collapses bottom margin when two blocks stack.',
  },
  'faq': {
    title: 'FAQ',
    firstClasses: ['faq-section'],
  },
  'latest-news': {
    title: 'Latest News',
    firstClasses: ['latest-news-section'],
    note: 'Slider of recent blog posts.',
  },
  'section-reviews': {
    title: 'Reviews (text slider)',
    firstClasses: ['section-reviews'],
  },
  'reviews-section': {
    title: 'Reviews (rating logos)',
    firstClasses: ['reviews-section'],
    note: 'Yelp / Google / Thumbtack / Angi rating logos + total review count.',
  },
  'why-sos': {
    title: 'Why SOS',
    firstClasses: ['why-sos-section'],
  },
  'services-grid': {
    title: 'Services Grid',
    firstClasses: ['services-section'],
  },
  'bottom-cta': {
    title: 'Bottom CTA',
    firstClasses: ['bottom-cta-section'],
    note: 'Recurring "Ready to move?" CTA before the footer.',
  },
  'locations-office': {
    title: 'Locations (Office addresses)',
    firstClasses: ['locations-office-section'],
  },
  'locations-slider': {
    title: 'Locations (Slider)',
    firstClasses: ['locations-section'],
  },
  'local-white-content': {
    title: 'Local White Content',
    firstClasses: ['local-white-content-section'],
    note: 'Long SEO text block on city landings.',
  },
  'about-company': {
    title: 'About Company',
    firstClasses: ['about-company-section'],
    note: 'Only on `/` and `/moving-services`. Contains the vertical photo scroll.',
  },
  'services-areas': {
    title: 'Services Areas',
    firstClasses: ['services-areas'],
  },
  'contact': {
    title: 'Contact',
    firstClasses: ['contact-section'],
  },
  'team': {
    title: 'Team',
    firstClasses: ['team-section'],
  },
  'job': {
    title: 'Job / Careers',
    firstClasses: ['job-section'],
  },
  'gallery-photo': {
    title: 'Gallery Photo',
    firstClasses: ['gallery-photo-section'],
  },
  'blog-listing': {
    title: 'Blog Listing',
    firstClasses: ['blog-section'],
  },
  'milestones': {
    title: 'Milestones',
    firstClasses: ['milestones-section'],
  },
  'touchbar': {
    title: 'Touchbar',
    firstClasses: ['touchbar'],
  },
  'hero-form': {
    title: 'Hero Form',
    firstClasses: ['hero-form-section'],
  },
  'delivery': {
    title: 'Delivery',
    firstClasses: ['delivery-section'],
  },
};

export async function generateStaticParams() {
  return Object.keys(TYPE_MAP).map((type) => ({ type }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ type: string }> }
): Promise<Metadata> {
  const { type } = await params;
  const cfg = TYPE_MAP[type];
  return {
    title: cfg ? `${cfg.title} variants — Dev Gallery` : 'Dev Gallery — 404',
    robots: { index: false, follow: false },
  };
}

export default async function DevTypePage(
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  const cfg = TYPE_MAP[type];
  if (!cfg) notFound();

  const variants = getSectionVariants(cfg.firstClasses);
  const total = variants.reduce((s, v) => s + v.pages.length, 0);

  return (
    <main>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 9999,
          background: '#0a0a0a',
          color: '#fff',
          padding: '1rem 1.5rem',
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          borderBottom: '2px solid #fde047',
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
          {cfg.title} · {variants.length} variant{variants.length === 1 ? '' : 's'} · {total} total use{total === 1 ? '' : 's'}
        </h1>
        <p style={{ margin: '6px 0 0', color: '#bbb', fontSize: 13 }}>
          {cfg.note && <span>{cfg.note} · </span>}
          <a href="/dev" style={{ color: '#fde047' }}>← back to gallery</a>
        </p>
      </div>

      {variants.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#888', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
          No pages contain a section with first-class <code>{cfg.firstClasses.join(' | ')}</code>.
        </div>
      ) : (
        variants.map((v, i) => (
          <section key={v.fullClassName}>
            <VariantHeader index={i + 1} total={variants.length} variant={v} />
            <div dangerouslySetInnerHTML={{ __html: v.html }} />
          </section>
        ))
      )}
    </main>
  );
}
