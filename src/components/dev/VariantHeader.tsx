// Shared header strip above each variant in dev gallery pages.
// Shows the variant number, className, page count, and the source page
// used as the rendering sample. Server Component.

import type { SectionVariant } from '@/lib/dev-gallery';

interface Props {
  index: number;
  total: number;
  variant: SectionVariant;
}

export function VariantHeader({ index, total, variant }: Props) {
  const samples = variant.pages.slice(0, 3).join(', ');
  const more = variant.pages.length > 3 ? ` (+${variant.pages.length - 3} more)` : '';
  return (
    <div
      style={{
        padding: '12px 20px',
        background: '#fef08a',
        borderTop: '2px solid #000',
        borderBottom: '1px solid #000',
        fontFamily: 'var(--font-inter), ui-monospace, monospace',
        fontSize: 13,
        color: '#0a0a0a',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
        #{index}/{total}&nbsp;&nbsp;<code>{variant.tag}.{variant.fullClassName.replace(/\s+/g, '.')}</code>
      </div>
      <div style={{ color: '#444' }}>
        {variant.pages.length} page{variant.pages.length === 1 ? '' : 's'} · rendering sample from <code>/{variant.pages[0]}</code>
        {variant.pages.length > 1 && (
          <>
            {' '}· also on: <code>{samples}</code>{more}
          </>
        )}
      </div>
    </div>
  );
}
