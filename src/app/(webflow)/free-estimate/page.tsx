import { getPageHTML } from '@/lib/page-renderer';

export default function FreeEstimatePage() {
  const html = getPageHTML('free-estimate');
  if (!html) return <div>Page not found</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
