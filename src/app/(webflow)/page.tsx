import { getPageHTML } from '@/lib/page-renderer';

export default function HomePage() {
  const html = getPageHTML('index');
  if (!html) return <div>Page not found</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
