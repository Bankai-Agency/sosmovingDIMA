#!/usr/bin/env node
/**
 * Extract each section from the original homepage HTML
 * and create React components that render the original markup.
 */
import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const html = readFileSync('./_legacy/index.html', 'utf-8');
const $ = load(html);

// Fix image paths in HTML - replace relative asset paths with /images/ paths
function fixPaths(htmlStr) {
  return htmlStr
    // Fix CDN image paths to local
    .replace(/assets\/cdn\/645ab1d97922876b775bef4f\//g, '/images/general/')
    .replace(/assets\/cdn\/645ab1d97922878b6f5bef7f\//g, '/images/blog/')
    // Fix relative paths
    .replace(/href="(?!http|mailto|tel|#|\/)(.*?)\/index\.html"/g, 'href="/$1"')
    .replace(/href="index\.html"/g, 'href="/"')
    // Fix internal links - remove index.html
    .replace(/\/index\.html/g, '')
    // Escape JSX issues
    .replace(/class="/g, 'className="')
    .replace(/for="/g, 'htmlFor="')
    .replace(/tabindex="/g, 'tabIndex="')
    .replace(/maxlength="/g, 'maxLength="')
    .replace(/readonly/g, 'readOnly')
    .replace(/autocomplete="/g, 'autoComplete="')
    .replace(/<!--.*?-->/gs, '')
    // Fix self-closing tags
    .replace(/<img([^>]*)(?<!\/)>/g, '<img$1 />')
    .replace(/<br([^>]*)(?<!\/)>/g, '<br$1 />')
    .replace(/<input([^>]*)(?<!\/)>/g, '<input$1 />')
    .replace(/<hr([^>]*)(?<!\/)>/g, '<hr$1 />')
    // Fix style attributes
    .replace(/style="([^"]*)"/g, (match, styles) => {
      const reactStyle = styles.split(';').filter(Boolean).map(s => {
        const [prop, ...vals] = s.split(':');
        if (!prop || !vals.length) return '';
        const camelProp = prop.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return `"${camelProp}": "${vals.join(':').trim()}"`;
      }).filter(Boolean).join(', ');
      return `style={{${reactStyle}}}`;
    })
    // Fix boolean attributes
    .replace(/ loading="lazy"/g, ' loading="lazy"')
    .replace(/ disabled /g, ' disabled={true} ')
    .replace(/ data-/g, ' data-')
    // Dangerous: just use dangerouslySetInnerHTML for complex sections
    ;
}

// Extract the full body content
const body = $('body').html();

// Extract navbar
const navbar = $.html('.navbar-wrapper') || $.html('[data-animation="default"]');

// Extract each section
const sections = [];
$('body > *').each((i, el) => {
  const tag = $(el).prop('tagName');
  const cls = $(el).attr('class') || '';
  const id = $(el).attr('id') || '';

  if (tag === 'SECTION' || cls.includes('section') || cls.includes('navbar') || cls.includes('footer') || cls.includes('popup')) {
    const rawHtml = $.html(el);
    const sectionName = cls.split(' ')[0] || id || `section-${i}`;
    sections.push({ name: sectionName, html: rawHtml, index: i });
  }
});

console.log(`Found ${sections.length} top-level elements`);
sections.forEach(s => console.log(`  ${s.index}: ${s.name}`));

// Instead of individual components, write the FULL page HTML as a single component
// This is the simplest approach for 1:1 matching

// Extract just the relevant body content (no scripts, no GTM noscript)
let pageContent = '';
$('body > *').each((i, el) => {
  const tag = $(el).prop('tagName');
  if (tag === 'SCRIPT' || tag === 'NOSCRIPT') return;
  const cls = $(el).attr('class') || '';
  // Skip the code/embed blocks that contain style
  if (cls === 'code w-embed') return;
  pageContent += $.html(el) + '\n';
});

// Fix all asset paths
pageContent = pageContent
  .replace(/assets\/cdn\/645ab1d97922876b775bef4f\//g, '/images/general/')
  .replace(/assets\/cdn\/645ab1d97922878b6f5bef7f\//g, '/images/blog/')
  .replace(/assets\/cdn\/gsap\/[^"']*/g, '') // Remove local GSAP paths (loaded via CDN)
  .replace(/assets\/speedy\/[^"']*/g, '') // Remove speedy scripts
  .replace(/assets\/libs\/[^"']*/g, '') // Remove local lib paths
  .replace(/assets\/other\/[^"']*/g, ''); // Remove other assets

writeFileSync('/tmp/homepage-content.html', pageContent);
console.log(`\nFull page content: ${pageContent.length} chars`);
console.log('Written to /tmp/homepage-content.html');
