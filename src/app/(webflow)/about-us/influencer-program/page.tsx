import type { Metadata } from 'next';
import { renderPage } from '@/lib/render-page';

export const metadata: Metadata = {
  description:
    "Join the SOS Moving Influencer Program — exclusive moving discounts from 10% to 100% for content creators. Partner with LA's top-rated moving company.",
};

export default function Page() {
  return renderPage('about-us__influencer-program');
}
