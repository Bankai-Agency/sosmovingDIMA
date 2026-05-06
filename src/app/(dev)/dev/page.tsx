// Dev gallery landing — links to every /dev/<section-type> preview.
// Not production content. Lives under (webflow) so it inherits the real
// webflow.css + ScriptLoader, so section variants render identically
// to how they appear on live pages (slider/IX2 scripts still work).

import Link from 'next/link';

export const metadata = {
  title: 'Dev Gallery',
  robots: { index: false, follow: false },
};

const SECTIONS: { href: string; label: string; note: string }[] = [
  { href: '/dev/hero', label: 'Hero', note: '12 variants · 534 pages' },
  { href: '/dev/service-content', label: 'Service Content', note: '6 variants · 126 pages' },
  { href: '/dev/faq', label: 'FAQ', note: '2 variants · 123 pages' },
  { href: '/dev/latest-news', label: 'Latest News', note: '2 variants · 399 pages' },
  { href: '/dev/section-reviews', label: 'Reviews (text slider)', note: '130 pages' },
  { href: '/dev/reviews-section', label: 'Reviews (rating logos)', note: '127 pages' },
  { href: '/dev/why-sos', label: 'Why SOS', note: '128 pages' },
  { href: '/dev/services-grid', label: 'Services Grid', note: '122 pages' },
  { href: '/dev/bottom-cta', label: 'Bottom CTA', note: '524 pages' },
  { href: '/dev/locations-office', label: 'Locations (Office)', note: '116 pages' },
  { href: '/dev/locations-slider', label: 'Locations (Slider)', note: '12 pages' },
  { href: '/dev/local-white-content', label: 'Local White Content', note: '115 pages' },
  { href: '/dev/about-company', label: 'About Company', note: '2 pages · homepage only' },
  { href: '/dev/services-areas', label: 'Services Areas', note: '2 pages' },
  { href: '/dev/contact', label: 'Contact', note: '3 pages' },
  { href: '/dev/team', label: 'Team', note: '1 page' },
  { href: '/dev/job', label: 'Job / Careers', note: '1 page' },
  { href: '/dev/gallery-photo', label: 'Gallery Photo', note: '1 page' },
  { href: '/dev/blog-listing', label: 'Blog Listing', note: '1 page' },
  { href: '/dev/milestones', label: 'Milestones', note: '1 page · homepage' },
  { href: '/dev/touchbar', label: 'Touchbar', note: '1 page · homepage' },
  { href: '/dev/hero-form', label: 'Hero Form', note: '1 page · moving-services' },
  { href: '/dev/delivery', label: 'Delivery', note: '1 page · packing-services' },
];

const wrap: React.CSSProperties = {
  maxWidth: 880,
  margin: '2rem auto',
  padding: '0 1.25rem',
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  color: '#0a0a0a',
};

export default function DevIndex() {
  return (
    <div style={wrap}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Dev Gallery</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Every component variation of the (webflow) legacy stack on one scrollable page, rendered with the real webflow.css + JS. For redesign planning.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
        {SECTIONS.map(s => (
          <li key={s.href}>
            <Link
              href={s.href}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 16px',
                border: '1px solid #e5e5e5',
                borderRadius: 8,
                textDecoration: 'none',
                color: 'inherit',
                background: '#fff',
              }}
            >
              <span style={{ fontWeight: 600 }}>{s.label}</span>
              <span style={{ color: '#888', fontFamily: 'monospace', fontSize: 13 }}>{s.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
