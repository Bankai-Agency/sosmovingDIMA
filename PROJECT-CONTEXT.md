# SOS Moving - Project Context for AI Sessions

> **Read this file FIRST before doing anything.** It contains the full context of the project, what was done, what's broken, and what needs to happen next.

---

## TL;DR

We're cloning https://www.sosmovingla.net/ (a Webflow site, 551 pages) into Next.js. The approach is **NOT** a rewrite with Tailwind/React components. Instead, we extract the original HTML from each page and render it via `dangerouslySetInnerHTML` with the original Webflow CSS. The goal is a **pixel-perfect 1:1 clone** that deploys on Vercel and can be gradually migrated to React components later.

**Current status:** HTML and CSS work perfectly. **JavaScript is completely broken** - sliders, accordions, tabs, animations don't work because scripts load in the wrong order.

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

**Important:** The original site uses `rem` units everywhere with a responsive root `font-size`:
- Desktop: `html { font-size: 20px; }`
- 1440px: `html { font-size: 1.4285vw; }`
- 991px: `html { font-size: 1.65vw; }`
- 767px: `html { font-size: 15px; }`
- 468px: `html { font-size: 3.1578vw; }`

---

## JavaScript - THE MAIN PROBLEM

### What the original site loads (in order)

The original Webflow site loads scripts **synchronously** (no defer, no async) in this exact order:

```
1. jQuery 3.5.1 (synchronous, from local file)
2. Webflow chunk files (synchronous):
   - webflow.schunk.f2efb3c5440a81cf.js (used on ALL 550 pages)
   - webflow.schunk.81d31091c363b462.js (used on ALL 550 pages)
   - webflow.schunk.f919141e3448519b.js (used on 3 pages only)
   - webflow.schunk.9dfb96661114d3db.js (used on 3 pages only)
3. Webflow main bundle (synchronous, page-specific):
   - webflow.987c289e.*.js - used on homepage + gallery (2 pages)
   - webflow.8ef64be1.*.js - used on most city/service/blog pages (~545 pages)
   - webflow.4c1b5164.*.js - used on book-online + free-estimate (2 pages)
   - webflow.cf90aa9a.*.js - used on moving-services (1 page)
4. GSAP 3.14.2 (synchronous)
5. ScrollTrigger (synchronous)
6. ScrollToPlugin (synchronous)
7. Inline: gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
8. Inline scripts: chatbot, exit popup, form validation, touchbar animation
9. DOMContentLoaded handler: loadResources() which dynamically loads:
   - jQuery 3.7.1 (overwrites 3.5.1)
   - Slick Carousel
   - Masonry
   - Select2
   - Datepicker
   - InputMask
   - Finsweet scrolldisable
   - Custom script.js from jsdelivr (https://cdn.jsdelivr.net/gh/Evgeny2723/sos-moving@0ad49c3/script.js)
   - Custom style.css from jsdelivr
```

### What's in our `layout.tsx` now (BROKEN)

Currently all scripts have `defer` attribute. This causes problems:
1. `defer` makes scripts non-blocking but execution order between external scripts is not always guaranteed across browsers in Next.js context
2. Webflow JS needs jQuery to be available when it executes
3. `custom-scripts.js` starts with `gsap.registerPlugin()` which needs GSAP loaded first
4. `custom-scripts.js` also has a `loadResources()` function that tries to load scripts from `assets/libs/jsdelivr/...` paths that DON'T EXIST in our `public/` folder

### What the Webflow JS does

The Webflow main JS bundle is a webpack/rspack bundle that handles ALL Webflow interactions:
- **Sliders** (`.w-slider`) - location carousel, reviews, video reviews, latest news
- **Tabs** (`.w-tabs`) - service areas
- **Dropdowns** (`.w-dropdown`) - navbar dropdowns
- **Accordion** - FAQ items
- **IX2 animations** - page-specific interactions triggered by scroll, click, etc.
- **Navbar** (`.w-nav`) - mobile menu

Without this JS running correctly, the page is just static HTML with no interactivity.

### What MUST happen to fix JS

**Option A (recommended): Client-side ScriptLoader component**

Create a React client component that dynamically loads scripts in the correct order:

```
Step 1: Load jQuery 3.7.1
Step 2: Load Webflow chunk files (the 2 common ones)
Step 3: Load correct Webflow main bundle (page-specific)
Step 4: Load GSAP + ScrollTrigger + ScrollToPlugin
Step 5: Load jQuery plugins (Slick, Masonry, Select2, Datepicker, InputMask, scrolldisable)
Step 6: Load custom script.js from jsdelivr CDN
Step 7: Execute custom scripts (exit popup, touchbar, form validation)
```

**Option B: Fix `layout.tsx` script tags**

Remove `defer` and load scripts synchronously. But Next.js may not handle raw `<script>` tags correctly in server components.

### The `data-wf-page` problem

The original `<html>` tag has attributes:
```html
<html data-wf-domain="" data-wf-page="65a92d1fd36f5f043d607154" data-wf-site="645ab1d97922876b775bef4f">
```

- `data-wf-site` = `645ab1d97922876b775bef4f` (same for ALL pages)
- `data-wf-page` = unique per page (used by IX2 for page-specific animations)

Our `layout.tsx` has `<html lang="en" className="w-mod-js">` - missing both attributes. The Webflow IX2 engine may need `data-wf-site` to initialize. Built-in components (slider, tabs, dropdown) should work without `data-wf-page` since they use DOM-based initialization.

### Different Webflow bundles per page type

This is important! Different pages load different Webflow main JS files:

| Bundle | Pages |
|---|---|
| `webflow.987c289e.df925483dbcdb1a9.js` | Homepage, Gallery (2 pages) |
| `webflow.8ef64be1.fc9d6e2e8b58a7f8.js` | ~545 city/service/blog/about pages |
| `webflow.4c1b5164.e6782c011d2684fd.js` | Book Online, Free Estimate (2 pages) |
| `webflow.cf90aa9a.d07593ecc8d89ceb.js` | Moving Services (1 page) |

All share the same 2 common chunk files:
- `webflow.schunk.f2efb3c5440a81cf.js`
- `webflow.schunk.81d31091c363b462.js`

3 pages also need extra chunks:
- `webflow.schunk.f919141e3448519b.js`
- `webflow.schunk.9dfb96661114d3db.js`

The ScriptLoader needs to know which bundle to load per page. Or we can try loading ALL bundles (they use webpack chunk loading so extras might be harmless).

### `public/custom-scripts.js` - What it contains

6 sections extracted from inline `<script>` tags:

1. **GSAP register** (line 1): `gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);`
2. **Chatbot loader** (lines 5-124): Loads Chatbase chatbot on desktop, excludes certain pages
3. **loadScript/loadStyle/loadResources** (lines 129-192): Dynamic script loader that loads jQuery, plugins, and custom script.js. **PROBLEM**: Uses local paths like `assets/libs/jsdelivr/...` that don't exist. Must be changed to CDN URLs:
   - `assets/libs/jsdelivr/npm/@finsweet/attributes-scrolldisable@1/scrolldisable.js` -> `https://cdn.jsdelivr.net/npm/@finsweet/attributes-scrolldisable@1/scrolldisable.js`
   - `assets/libs/jsdelivr/npm/select2@4.1.0-rc.0/dist/js/select2.min.js` -> `https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js`
   - `assets/libs/jsdelivr/gh/Evgeny2723/sos-moving@552da70/style.css` -> `https://cdn.jsdelivr.net/gh/Evgeny2723/sos-moving@552da70/style.css`
   - `assets/libs/jsdelivr/gh/Evgeny2723/sos-moving@0ad49c3/script.js` -> `https://cdn.jsdelivr.net/gh/Evgeny2723/sos-moving@0ad49c3/script.js`
4. **Exit popup** (lines 196-252): Shows popup when mouse leaves viewport (desktop) or after 45s (mobile)
5. **Form validation** (lines 256-278): Validates required fields before submit
6. **Touchbar + Navbar animation** (lines 283-312): GSAP scroll animation - touchbar slides up, navbar slides away on scroll

---

## What's in `public/`

### Assets (from original Webflow CDN)
```
public/
├── assets/
│   └── cdn/
│       └── 645ab1d97922876b775bef4f/
│           ├── css/sosmovingla.webflow.shared.7488016f9.min.css  (same as webflow.css)
│           ├── js/  (Webflow JS files - duplicated at root)
│           └── [2500+ images: .avif, .webp, .png, .svg, .jpg]
├── pages/              (537 extracted HTML files)
├── webflow.css         (154KB - main stylesheet)
├── webflow.*.js        (4 main bundles + 4 chunk files)
├── custom-scripts.js   (11KB - inline scripts combined)
└── favicon/
```

### `_legacy/` directory (git-ignored)
Contains the original 551 HTML pages downloaded from Webflow. Each is a full HTML file (with `<html>`, `<head>`, `<body>`). Used as source for extraction scripts. NOT deployed.

---

## Extraction Scripts

### `scripts/extract-pages-html.mjs`
Extracts `<body>` content from each `_legacy/` HTML file, rewrites asset paths to absolute, and saves to `public/pages/`. This is how we got the 537 HTML files.

### `scripts/extract-all.mjs`
Extracts structured data (cities JSON, services JSON, blog Markdown, reviews, FAQ) for the future component-based approach. Not currently used in the live site.

---

## Visible Bugs (as reported by the owner)

1. **Sliders don't work** - Locations carousel, Reviews, Video Reviews, Latest News all display as static grids/lists instead of carousels
2. **FAQ accordion is fully open** - All FAQ items expanded by default, should be closed
3. **Service Areas tabs are all open** - Should show one region at a time
4. **No scroll animations** - GSAP-powered animations (touchbar, navbar hide, section reveals) don't play
5. **Navbar mobile menu probably broken** - Webflow JS handles this
6. **Forms probably broken** - Select2, Datepicker, InputMask not loading
7. **Exit popup not working** - Script not running

All caused by the same root issue: **JavaScript not loading in correct order**.

---

## Git History

```
d8a0797 Fix missing images (yelp logo, play button, video thumbnails)  <- LATEST
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

**But this is PHASE 2.** Phase 1 is getting the 1:1 clone working with all JS interactions.

---

## Key Files Quick Reference

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout - loads CSS + JS. **FIX SCRIPTS HERE** |
| `src/app/globals.css` | Responsive font-size + Webflow overrides |
| `src/lib/page-renderer.ts` | Reads HTML from `public/pages/` |
| `public/webflow.css` | Original Webflow CSS (154KB) |
| `public/custom-scripts.js` | Combined inline scripts. **FIX PATHS HERE** |
| `public/pages/*.html` | 537 extracted page HTML files |
| `public/webflow.*.js` | 8 Webflow JS files (4 bundles + 4 chunks) |
| `_legacy/` | Original HTML files (git-ignored, local only) |
| `scripts/extract-pages-html.mjs` | Extraction script |

---

## IMMEDIATE NEXT STEPS

### Step 1: Fix script loading (THE CRITICAL FIX)

Create `src/components/ScriptLoader.tsx` - a client component using `useEffect` to load scripts in order:

```
1. jQuery (await)
2. Webflow chunks (await)
3. Webflow main bundle (await - ideally page-specific, or load all 4)
4. GSAP + plugins (await)
5. Slick, Masonry, Select2, Datepicker, InputMask, scrolldisable (await Promise.all)
6. Custom script.js from jsdelivr (await)
7. Run remaining custom scripts (touchbar, exit popup, form validation)
```

### Step 2: Fix `custom-scripts.js`

- Change `assets/libs/jsdelivr/...` paths to CDN URLs
- OR remove the `loadResources()` function entirely if ScriptLoader handles all loading
- Keep: chatbot, exit popup, form validation, touchbar animation

### Step 3: Update `layout.tsx`

- Remove all `<script defer>` tags from `<body>`
- Add `<ScriptLoader />` component
- Add `data-wf-site="645ab1d97922876b775bef4f"` to `<html>` tag
- Consider adding `data-wf-page` per page (may need per-route logic)

### Step 4: Test

- Sliders should carousel
- FAQ should be collapsed
- Service Areas should show one tab
- Touchbar should animate on scroll
- Exit popup should trigger on mouse leave
- Forms should have input masks, datepickers, select2

### Step 5: Push to GitHub and verify on Vercel

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
