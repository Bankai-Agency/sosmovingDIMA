import { getPageHTML } from '@/lib/page-renderer';

export default function BlogPage() {
  const html = getPageHTML('blog');
  if (!html) return <div>Page not found</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
