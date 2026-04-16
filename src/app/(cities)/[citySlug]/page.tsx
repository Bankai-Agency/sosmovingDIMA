import { notFound } from 'next/navigation';
import { getPageHTML } from '@/lib/page-renderer';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function generateStaticParams() {
  const dir = join(process.cwd(), 'public/pages');
  return readdirSync(dir)
    .filter(f => f.endsWith('.html') && f.includes('-movers') && !f.includes('__'))
    .map(f => ({ citySlug: f.replace('.html', '') }));
}

export default async function CityPage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const html = getPageHTML(citySlug);
  if (!html) notFound();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
