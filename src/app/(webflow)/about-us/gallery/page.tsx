import { getNestedPageHTML } from '@/lib/page-renderer';

export default function Page() {
  const html = getNestedPageHTML('about-us', 'gallery');
  if (!html) return <div>Page not found</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
