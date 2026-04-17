import { notFound } from 'next/navigation';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { renderPage } from '@/lib/render-page';

export async function generateStaticParams() {
  const dir = join(process.cwd(), 'public/pages');
  return readdirSync(dir)
    .filter(f => f.endsWith('.html') && f.includes('-movers') && !f.includes('__'))
    .map(f => ({ citySlug: f.replace('.html', '') }));
}

export default async function CityPage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const pagesDir = join(process.cwd(), 'public/pages');
  if (!existsSync(join(pagesDir, `${citySlug}.html`))) notFound();
  return renderPage(citySlug);
}
