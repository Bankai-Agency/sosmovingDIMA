# SOS Moving - Project Context for AI Sessions

> **Read this file FIRST before doing anything.** It contains the full context of the project, what was done, what's broken, and what needs to happen next.

---

## TL;DR

We're cloning https://www.sosmovingla.net/ (a Webflow site, 551 pages) into Next.js. The approach is **NOT** a rewrite with Tailwind/React components. Instead, we extract the original HTML from each page and render it via `dangerouslySetInnerHTML` with the original Webflow CSS. The goal is a **pixel-perfect 1:1 clone** that deploys on Vercel and can be gradually migrated to React components later.

**Current status:** HTML, CSS, and most JavaScript now works. Sliders, accordions, FAQ, chatbot, exit popup, touchbar animation, and photo scroll are all functional. Some Webflow IX2 page-specific animations (hover effects, scroll-triggered reveals) may still be missing due to a jQuery version mismatch (`t is not a function` error in IX2 engine).

---

## The Owner

- **Dmitriy** - wants a 1:1 clone of the original Webflow site
- Deploys to Vercel from GitHub: https://github.com/Bankai-Agency/sosmovingDIMA
- Branch: `main`
- **CRITICAL**: He rejected a Tailwind CSS rewrite. He wants the ORIGINAL Webflow CSS, not a redesign. "Мне нужен результат 1 в 1"

---

## Architecture

### How Pages Work

Every page follows the same pattern:

1. Original HTML was extracted from `_legacy/` (551 Webflow HTML files, git-ignored) using `scripts/extract-pages-html.mjs`
2. The `<body>` content of each page was saved as a standalone HTML file in `public/pages/`
3. Asset paths were rewritten: `assets/cdn/...` -> `/assets/cdn/...` (absolute paths)
4. Each Next.js route reads the corresponding HTML file and renders it via `dangerouslySetInnerHTML`

### File: `src/lib/page-renderer.ts`
```typescript
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
const PAGES_DIR = join(process.cwd(), 'public/pages');

export function getPageHTML(slug: string): string | null {
  const filePath = join(PAGES_DIR, `${slug}.html`);
  if (existsSync(filePath)) return readFileSync(filePath, 'utf-8');
  return null;
}

export function getNestedPageHTML(parent: string, child: string): string | null {
  return getPageHTML(`${parent}__${child}`);
}
```

### Page naming convention in `public/pages/`
- `index.html` - homepage
- `beverly-hills-movers.html` - city page
- `services__apartment-movers.html` - service page (double underscore = nested route)
- `blog__how-to-pack-books.html` - blog post
- `about-us__faq.html` - about subpage
- Total: **537 HTML files**

### Next.js Routes

| Route | File | HTML Source |
|---|---|---|
| `/` | `src/app/page.tsx` | `public/pages/index.html` |
| `/beverly-hills-movers` | `src/app/(cities)/[citySlug]/page.tsx` | `public/pages/beverly-hills-movers.html` |
| `/services/apartment-movers` | `src/app/services/[slug]/page.tsx` | `public/pages/services__apartment-movers.html` |
| `/blog/how-to-pack` | `src/app/blog/[slug]/page.tsx` | `public/pages/blog__how-to-pack.html` |
| `/about-us/faq` | `src/app/about-us/faq/page.tsx` | `public/pages/about-us__faq.html` |
| `/free-estimate` | `src/app/free-estimate/page.tsx` | `public/pages/free-estimate.html` |
| etc. | | |

Dynamic routes use `generateStaticParams()` to read `public/pages/` directory and generate all static pages at build time.

---

## CSS Setup

### `public/webflow.css`
The original Webflow CSS file (154KB). Loaded via `<link>` in `layout.tsx`. This is the ONLY CSS that styles the site (besides `globals.css` overrides).

### `src/app/globals.css`
Contains inline styles from the original `<style>` tags:
- Responsive `font-size` rules (the original uses `rem` units based on root font size)
- Rating wrapper widths
- Review text truncation
- Misc overrides
- **CSS infinite scroll animation** for the about-company photo grid (`scrollUp` / `scrollDown` keyframes)

**Important:** The original site uses `rem` units everywhere with a responsive root `font-size`:
- Desktop: `html { font-size: 20px; }`
- 1440px: `html { font-size: 1.4285vw; }`
- 991px: `html { font-size: 1.65vw; }`
- 767px: `html { font-size: 15px; }`
- 468px: `html { font-size: 3.1578vw; }`

---

## JavaScript - SOLVED (mostly)

### ScriptLoader (`src/components/ScriptLoader.tsx`)

A client-side React component that loads all scripts in the correct sequential order using `useEffect` + dynamic `<script>` injection. This replaced the broken `<script defer>` approach.

**Loading order:**
```
Step 0: Fetch /wf-page-map.json + /wf-bundle-map.json
        Set data-wf-page on <html> for IX2 animations
Step 1: jQuery 3.7.1 (await)
Step 2: 2 common Webflow chunk files (await sequentially)
Step 3: Page-specific Webflow main bundle (await, determined by wf-bundle-map.json)
Step 4: GSAP + ScrollTrigger + ScrollToPlugin (await)
Step 5: Extra CSS (slick, datepicker, select2, custom style.css)
Step 6: jQuery plugins in parallel (Slick, Masonry, scrolldisable, InputMask, Datepicker, Select2)
Step 7: Custom script.js from jsdelivr CDN (await)
Step 8: custom-scripts.js (await)
```

### `public/wf-page-map.json`
Maps 550 URL paths to their `data-wf-page` IDs (extracted from `_legacy/` HTML files). Used by ScriptLoader to set `data-wf-page` attribute on `<html>` before Webflow JS loads.

### `public/wf-bundle-map.json`
Maps 550 URL paths to their correct Webflow main JS bundle filename. ScriptLoader loads only the needed bundle per page.

### Different Webflow bundles per page type

| Bundle | Pages |
|---|---|
| `webflow.987c289e.df925483dbcdb1a9.js` | Homepage, Gallery (2 pages) |
| `webflow.8ef64be1.fc9d6e2e8b58a7f8.js` | ~545 city/service/blog/about pages |
| `webflow.4c1b5164.e6782c011d2684fd.js` | Book Online, Free Estimate (2 pages) |
| `webflow.cf90aa9a.d07593ecc8d89ceb.js` | Moving Services (1 page) |

### `public/custom-scripts.js`

Cleaned-up version containing only runtime logic (no duplicate script loaders):

1. **Chatbot loader** - Loads Chatbase on desktop, excludes certain pages
2. **Passive event listeners** - For INP optimization
3. **Exit popup** - Shows on mouse leave (desktop) or after 45s (mobile)
4. **Form validation** - Validates required fields
5. **Touchbar + Navbar animation** - GSAP scroll animation with safety check for GSAP availability

### Known JS Issue: Webflow IX2 `t is not a function`

The Webflow IX2 engine throws `jQuery.Deferred exception: t is not a function` during initialization. This is likely caused by jQuery version mismatch (original site used 3.5.1, we load 3.7.1). Impact:
- Built-in Webflow components (sliders, tabs, dropdowns, navbar) **WORK** despite this error
- Page-specific IX2 animations (hover effects, scroll-triggered reveals) **may not work**
- The about-company photo scroll was fixed with a CSS-only animation as a workaround

**Possible fix:** Load jQuery 3.5.1 instead of 3.7.1, or patch the specific failing function.

---

## What's in `public/`

```
public/
├── assets/
│   └── cdn/
│       └── 645ab1d97922876b775bef4f/
│           ├── css/sosmovingla.webflow.shared.7488016f9.min.css
│           ├── js/  (Webflow JS files)
│           └── [2500+ images: .avif, .webp, .png, .svg, .jpg]
├── images/                (reorganized images with proper names)
│   ├── general/           (hero, company photos, icons)
│   ├── blog/              (blog post thumbnails)
│   ├── cities/            (city background images)
│   └── services/          (service page images)
├── pages/                 (537 extracted HTML files)
├── webflow.css            (154KB - main stylesheet)
├── webflow.*.js           (4 main bundles + 4 chunk files)
├── custom-scripts.js      (cleaned-up inline scripts)
├── wf-page-map.json       (550 URL → data-wf-page ID mappings)
├── wf-bundle-map.json     (550 URL → Webflow bundle filename mappings)
└── favicon/
```

### `_legacy/` directory (git-ignored)
Contains the original 551 HTML pages downloaded from Webflow. Each is a full HTML file (with `<html>`, `<head>`, `<body>`). Used as source for extraction scripts. NOT deployed.

---

## Extraction Scripts

### `scripts/extract-pages-html.mjs`
Extracts `<body>` content from each `_legacy/` HTML file, rewrites asset paths to absolute, and saves to `public/pages/`.

### `scripts/extract-all.mjs`
Extracts structured data (cities JSON, services JSON, blog Markdown, reviews, FAQ) for the future component-based approach. Not currently used.

---

## What's Working (verified in browser)

- ✅ Hero section with video background
- ✅ Google + Yelp review badges (logos load correctly)
- ✅ About company photo scroll animation (CSS infinite scroll)
- ✅ Video reviews slider with thumbnails + play buttons
- ✅ Text reviews slider
- ✅ Gallery slider with navigation arrows
- ✅ Latest News slider
- ✅ Locations slider
- ✅ FAQ accordion (closed by default)
- ✅ Service Areas accordion (closed by default)
- ✅ Services grid
- ✅ "Why SOS Moving" section
- ✅ Footer with all links
- ✅ Exit popup (triggers on mouse leave or timeout)
- ✅ Chatbot (loads on desktop after delay)
- ✅ Navbar with dropdowns
- ✅ Touchbar + Navbar scroll animation (GSAP)

## Remaining Issues

1. **IX2 hover/scroll animations** - Some Webflow IX2 page-specific animations may not trigger (the `t is not a function` error). Impact is minor since most visible features work.
2. **Forms untested end-to-end** - Select2, Datepicker, InputMask load but haven't been tested with form submission.
3. **Mobile untested** - No mobile testing done yet.
4. **Blog/city/service pages untested** - Only homepage verified so far.
5. **Some pages may have missing images** - Only homepage images fully verified. Other pages may reference images not yet downloaded.

---

## Git History

```
83861f2 Add data-wf-page per route + CSS photo scroll animation       <- LATEST
a0cd92c Fix JS loading order with ScriptLoader + download missing images
935ddd5 Add PROJECT-CONTEXT.md with full project state and WIP script fixes
d8a0797 Fix missing images (yelp logo, play button, video thumbnails)
4c548bb Switch to original Webflow HTML + CSS approach for 1:1 match
920a32c Pixel-perfect redesign matching original sosmovingla.net       <- Tailwind attempt (rejected)
0438184 Optimize for Vercel deployment
6a3565e Rebuild as Next.js app with component architecture
463f089 Initial commit: full SOS Moving LA website clone
```

---

## Vercel Deployment

- **Repo**: https://github.com/Bankai-Agency/sosmovingDIMA
- **Branch**: `main`
- **Framework preset**: Next.js (was changed from auto-detect which incorrectly chose "Static")
- The `_legacy/` folder is excluded via `.vercelignore`

---

## Future Plans (NOT started)

The long-term plan (documented in `.claude/plans/`) is to gradually replace `dangerouslySetInnerHTML` pages with proper React components:

1. Extract ~15 reusable section components (Hero, Reviews, FAQ, CTA, etc.)
2. Store city/service data in JSON files (`src/data/cities/*.json`)
3. Blog posts as Markdown with frontmatter
4. Replace jQuery libraries with React equivalents (Embla Carousel, Framer Motion, etc.)
5. Eventually connect Sanity CMS for blog

**But this is PHASE 2.** Phase 1 (1:1 clone with working JS) is mostly complete.

---

## Key Files Quick Reference

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout - loads Webflow CSS, Google Fonts, ScriptLoader |
| `src/app/globals.css` | Responsive font-size + Webflow overrides + photo scroll animation |
| `src/components/ScriptLoader.tsx` | Client component - loads all JS in correct order |
| `src/lib/page-renderer.ts` | Reads HTML from `public/pages/` |
| `src/types/global.d.ts` | TypeScript types for global window objects (gsap, jQuery, etc.) |
| `public/webflow.css` | Original Webflow CSS (154KB) |
| `public/custom-scripts.js` | Chatbot, exit popup, form validation, touchbar animation |
| `public/wf-page-map.json` | 550 URL path → data-wf-page ID mappings |
| `public/wf-bundle-map.json` | 550 URL path → Webflow bundle filename mappings |
| `public/pages/*.html` | 537 extracted page HTML files |
| `public/webflow.*.js` | 8 Webflow JS files (4 bundles + 4 chunks) |
| `_legacy/` | Original HTML files (git-ignored, local only) |
| `scripts/extract-pages-html.mjs` | Extraction script |

---

## IMMEDIATE NEXT STEPS

### Step 1: Test other page types
- Open a city page (e.g. `/beverly-hills-movers`) and verify all sections work
- Open a service page (e.g. `/services/apartment-movers`)
- Open a blog post
- Open `/free-estimate` and test the form

### Step 2: Fix IX2 if needed
- Try loading jQuery 3.5.1 instead of 3.7.1 to see if `t is not a function` resolves
- If that fixes IX2, the photo scroll CSS animation can be kept as a bonus

### Step 3: Mobile testing
- Test responsive behavior on mobile viewports
- Verify touchbar animation works on mobile

### Step 4: Missing images audit
- Run a script to check all `src=` references in `public/pages/*.html` against actual files in `public/`
- Download any missing images from the Webflow CDN

### Step 5: Full Vercel verification
- Verify all 537+ routes work on production deploy
- Check Lighthouse scores

---

## Dependencies in `package.json`

Currently installed but NOT YET USED (from the future component-based approach):
- `embla-carousel-react` - future replacement for Slick
- `framer-motion` - future replacement for GSAP
- `gray-matter`, `react-markdown`, `rehype-*`, `remark-*` - future blog rendering
- `react-hook-form`, `zod`, `react-imask` - future form handling
- `tailwindcss` - future styling (currently NOT used, original Webflow CSS is used)
- `cheerio` - used in extraction scripts only

These can be cleaned up later but don't hurt anything.
