import { getPageHTML } from '@/lib/page-renderer';

export default function AboutPage() {
  const html = getPageHTML('about-us');
  if (!html) return <div>Page not found</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
