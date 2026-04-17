import React from 'react';
import type { ParsedSection } from './types';

/**
 * Generic fallback — renders a section's outer tag + className unchanged,
 * with the raw innerHtml slotted in via dangerouslySetInnerHTML.
 *
 * Specialized components (SectionHero, SectionBottomCta, etc.) can override
 * this to provide custom JSX/styles, but the default is a 1:1 passthrough
 * that preserves the original Webflow structure exactly.
 *
 * Phase 3 redesign: replace the guts of each specialized component
 * with new JSX/Tailwind — innerHtml becomes either data-extracted props
 * or left as a slot, depending on how radically the redesign changes.
 */
export function SharedSection({ tag, className, innerHtml }: Omit<ParsedSection, 'type'>) {
  const Tag = (tag || 'div') as keyof React.JSX.IntrinsicElements;
  return React.createElement(Tag, {
    className: className || undefined,
    dangerouslySetInnerHTML: { __html: innerHtml },
  });
}
