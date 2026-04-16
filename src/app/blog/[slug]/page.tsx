import { notFound } from 'next/navigation';
import { getNestedPageHTML } from '@/lib/page-renderer';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function generateStaticParams() {
  const dir = join(process.cwd(), 'public/pages');
  return readdirSync(dir)
    .filter(f => f.startsWith('blog__') && f.endsWith('.html'))
    .map(f => ({ slug: f.replace('blog__', '').replace('.html', '') }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const html = getNestedPageHTML('blog', slug);
  if (!html) notFound();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
