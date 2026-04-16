import { getPageHTML } from '@/lib/page-renderer';

export default function ServicesPage() {
  const html = getPageHTML('services');
  if (!html) return <div>Page not found</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
