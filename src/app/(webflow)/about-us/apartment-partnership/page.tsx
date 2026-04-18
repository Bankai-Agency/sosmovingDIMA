import type { Metadata } from 'next';
import { renderPage } from '@/lib/render-page';

export const metadata: Metadata = {
  description:
    'Partner with SOS Moving for apartment communities — discounted rates for residents, damage prevention, COI handling, and dedicated move coordination.',
};

export default function Page() {
  return renderPage('about-us__apartment-partnership');
}
