# SOS Moving - Project Context for AI Sessions

> **Read this file FIRST before doing anything.** It contains the full context of the project, what was done, what's broken, and what needs to happen next.

---

## TL;DR

We're cloning https://www.sosmovingla.net/ (a Webflow site, 551 pages) into Next.js. The project now runs **two parallel stacks**:

1. **Webflow legacy stack** (`src/app/(webflow)/`) — pixel-perfect 1:1 clone of the original site. Each page extracts the original `<body>` HTML and renders it via `dangerouslySetInnerHTML` with the original Webflow CSS + jQuery/Slick/GSAP. 537 static pages.
2. **New-design stack** (`src/app/(new-design)/`) — modern React 19 + Tailwind 4 + framer-motion + Three.js + Lenis. Currently hosts only `/mainpage2` (an alternative homepage). This is the target stack for the future full migration (see `CLAUDE.md`).

**Current status:** Phase 1 (1:1 Webflow clone) and Phase 2 (componentize shared blocks) are complete. Prod build outputs **907 static pages + `/mainpage2`** in ~1.5s.

- ✅ Phase 1 (commit `c2e71ce`): jQuery pinned to 3.5.1, `%2520` double-encode fix, image audit
- ✅ mainpage2 integration (commit `7979d27`): new-design route group, Tailwind 4, framer-motion, Three.js, Lenis, Manrope fonts, 30+ components under `src/components/mainpage2/`
- ✅ Phase 2 (commit `f281700`): navbar / footer / exit-popup extracted to `src/data/shared/*.html` and rendered once via `SharedHtmlBlock`, eliminating 537× duplication across `public/pages/*.html` (saved 13.21 MB); latent Webflow `../..//images/` protocol-relative bug fixed in 534 files; 924 missing responsive image variants regenerated with sharp

Sliders, accordions, FAQ, tabs, dropdowns, chatbot, exit popup, touchbar animation, and photo scroll all work. Page-specific Webflow IX2 hover/scroll animations still have reduced functionality in places — CSS workarounds applied where parity matters (e.g. about-company photo scroll).

---

## The Owner

- **Dmitriy** - wants a 1:1 clone of the original Webflow site, with a gradual path to a modern stack
- Deploys to Vercel from GitHub: https://github.com/Bankai-Agency/sosmovingDIMA
- Branch: `main`
- **CRITICAL**: He rejected a Tailwind CSS rewrite for the legacy clone. The Webflow stack must keep the original Webflow CSS, not a redesign. "Мне нужен результат 1 в 1"
- The new-design stack (`/mainpage2`) is a **separate track** — it does NOT replace the legacy clone yet. Full migration plan is in `CLAUDE.md`.

---

## Architecture

### Route Groups (Next.js App Router)

All routes live under one of two route groups. Route groups (folders wrapped in parentheses) do NOT add to the URL path — they only organize files and allow a separate root layout per group.

```
src/app/
├── (webflow)/              # legacy 1:1 clone — 537 pages
│   ├── layout.tsx          # loads webflow.css, ScriptLoader, SharedHtmlBlock (navbar/footer/exit-popup)
│   ├── page.tsx            # homepage (/)
│   ├── (cities)/[citySlug]/page.tsx
│   ├── services/[slug]/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── about-us/...
│   ├── book-online/
│   ├── free-estimate/
│   ├── category/
│   ├── globals.css         # Webflow responsive font-size + CSS scroll keyframes
│   └── sitemap.ts
└── (new-design)/           # modern stack — /mainpage2 only (for now)
    ├── layout.tsx          # loads Manrope fonts, new globals, SmoothScroll (Lenis), SchemaOrg
    ├── globals.css         # Tailwind 4 + new-design tokens
    └── mainpage2/
        └── page.tsx
```

### How Legacy (Webflow) Pages Work

Every legacy page follows the same pattern:

1. Original HTML was extracted from `_legacy/` (551 Webflow HTML files, git-ignored) using `scripts/extract-pages-html.mjs`
2. The `<body>` content of each page was saved as a standalone HTML file in `public/pages/`
3. Asset paths were rewritten: `assets/cdn/...` → `/assets/cdn/...` (absolute paths)
4. **Phase 2:** navbar, footer, and exit-popup markup was stripped from all 537 HTML files and moved to `src/data/shared/*.html` — these now come from `SharedHtmlBlock` in the layout, not from the page HTML
5. Each Next.js route in `(webflow)/` reads the corresponding trimmed HTML file and renders it via `dangerouslySetInnerHTML`

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
| `/` | `src/app/(webflow)/page.tsx` | `public/pages/index.html` |
| `/beverly-hills-movers` | `src/app/(webflow)/(cities)/[citySlug]/page.tsx` | `public/pages/beverly-hills-movers.html` |
| `/services/apartment-movers` | `src/app/(webflow)/services/[slug]/page.tsx` | `public/pages/services__apartment-movers.html` |
| `/blog/how-to-pack` | `src/app/(webflow)/blog/[slug]/page.tsx` | `public/pages/blog__how-to-pack.html` |
| `/about-us/faq` | `src/app/(webflow)/about-us/faq/page.tsx` | `public/pages/about-us__faq.html` |
| `/free-estimate` | `src/app/(webflow)/free-estimate/page.tsx` | `public/pages/free-estimate.html` |
| `/mainpage2` | `src/app/(new-design)/mainpage2/page.tsx` | React components under `src/components/mainpage2/` |

Dynamic routes use `generateStaticParams()` to read `public/pages/` directory and generate all static pages at build time.

---

## Shared Components (Phase 2)

Before Phase 2, every one of the 537 `public/pages/*.html` files contained a full copy of the same navbar, footer, and exit-popup — ~25KB of duplicated markup per page (~13 MB wasted).

### `src/components/shared/SharedHtmlBlock.tsx`
Server Component that reads a file from `src/data/shared/*.html` at build time and renders it via `dangerouslySetInnerHTML`. Used by `(webflow)/layout.tsx` to render the navbar, footer, and exit-popup exactly once, on every legacy route.

### `src/data/shared/`
Single source of truth for shared Webflow markup and a few structured fallbacks:

| File | Purpose |
|---|---|
| `navbar.html` | Top navigation + dropdown menus |
| `footer.html` | Site footer with links |
| `exit-popup.html` | Exit-intent modal |
| `callback-widget.html` | Floating callback CTA |
| `company.json` | Company info (phone, address) for future React migration |
| `navigation.json` | Nav structure for future React migration |
| `categories.json`, `faq.json`, `reviews.json` | Structured content for future React migration |

### Migration scripts added in Phase 2

| Script | Purpose |
|---|---|
| `scripts/extract-shared-blocks.mjs` | Extracts navbar / footer / exit-popup from `public/pages/index.html` (which already uses absolute paths) and writes them to `src/data/shared/` |
| `scripts/strip-shared-blocks.mjs` | Removes those three blocks from every `public/pages/*.html` so they're rendered only once from the layout |
| `scripts/fix-relative-paths.mjs` | Normalizes latent Webflow `../..//images/...` (protocol-relative, 404-prone) paths to absolute `/images/...` in 534 files |

Re-run this trio if the base HTML is re-extracted from `_legacy/`.

---

## CSS Setup

### Webflow legacy stack

#### `public/webflow.css`
The original Webflow CSS file (154KB). Loaded via `<link>` in `(webflow)/layout.tsx`. This is the ONLY CSS that styles the legacy clone (besides `(webflow)/globals.css` overrides).

#### `src/app/(webflow)/globals.css`
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

### New-design stack

#### `src/app/(new-design)/globals.css`
Tailwind 4 entry + new-design tokens. Completely independent from `webflow.css`. Manrope font (variable weights) loaded from `public/mainpage2/fonts/`.

---

## JavaScript - SOLVED (mostly, legacy stack)

### ScriptLoader (`src/components/ScriptLoader.tsx`)

A client-side React component that loads all scripts in the correct sequential order using `useEffect` + dynamic `<script>` injection. Used ONLY by the `(webflow)` layout.

**Loading order:**
```
Step 0: Fetch /wf-page-map.json + /wf-bundle-map.json
        Set data-wf-page on <html> for IX2 animations
Step 1: jQuery 3.5.1 (await) — pinned to match the original site
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

### IX2 status

Since Phase 1 pinned jQuery to **3.5.1** (matching the original site), the old `t is not a function` error from the 3.7.1 mismatch no longer fires. Most built-in Webflow components work. Some complex page-specific IX2 hover/scroll animations still need verification across routes. CSS workarounds (`@keyframes scrollUp` / `scrollDown`) remain for the about-company photo scroll as a bonus — they also act as a safety net if IX2 regresses.

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
├── images/                (downloaded from Webflow CDN)
│   ├── general/           (hero, company photos, service icons, video thumbnails, location backgrounds)
│   ├── blog/              (blog post thumbnails + responsive variants)
│   ├── cities/            (city hero backgrounds + responsive variants)
│   ├── services/          (service page hero images)
│   └── team/              (team avatars)
├── mainpage2/             (NEW — assets for new-design stack)
│   ├── data/
│   ├── fonts/             (Manrope variable fonts)
│   ├── images/
│   └── videos/
├── pages/                 (537 extracted HTML files — trimmed of navbar/footer/exit-popup in Phase 2)
├── webflow.css            (154KB - main stylesheet for legacy stack)
├── webflow.*.js           (4 main bundles + 4 chunk files)
├── custom-scripts.js      (cleaned-up inline scripts)
├── wf-page-map.json       (550 URL → data-wf-page ID mappings)
├── wf-bundle-map.json     (550 URL → Webflow bundle filename mappings)
└── favicon/
```

### `src/data/shared/` (NEW — single source of truth for shared Webflow blocks)
See the **Shared Components** section above.

### `_legacy/` directory (git-ignored)
Contains the original 551 HTML pages downloaded from Webflow. Each is a full HTML file (with `<html>`, `<head>`, `<body>`). Used as source for extraction scripts. NOT deployed.

---

## Extraction & Build Scripts

### Legacy extraction
- `scripts/extract-pages-html.mjs` — Extracts `<body>` content from each `_legacy/` HTML file, rewrites asset paths to absolute, and saves to `public/pages/`.
- `scripts/extract-all.mjs` — Extracts structured data (cities JSON, services JSON, blog Markdown, reviews, FAQ) for the future component-based approach. Not currently used.
- `scripts/extract-sections.mjs` — Helper for extracting specific page sections. Investigation only, not in build pipeline.

### Phase 2 shared-block pipeline
- `scripts/extract-shared-blocks.mjs` — Pulls navbar / footer / exit-popup from `index.html` into `src/data/shared/`.
- `scripts/strip-shared-blocks.mjs` — Removes those blocks from all 537 `public/pages/*.html` files (saved 13.21 MB).
- `scripts/fix-relative-paths.mjs` — Normalizes `../..//images/...` to `/images/...` across 534 files (fixes latent Webflow protocol-relative 404 bug).

### Image tooling
- `scripts/generate-responsive-images.mjs` — Scans every `public/pages/*.html` for `src=` and `srcset=` references to `/images/...`, detects Webflow's `-p-500/800/1080/1600.{webp|jpg|png|avif}` variant pattern, and — when a referenced variant is missing but its base file exists — regenerates the variant using `sharp` (quality 82 for webp/jpeg, 60 for avif). Phase 2 run generated **924** missing variants.
- `scripts/audit-images.mjs` — Audits coverage of referenced images across all extracted pages.

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
- ✅ Services grid — "SOS Moving Services" section on the homepage. The Apartment Movers / Commercial / Packing / White Glove / Storage / Movers visuals are icons in the grid, referenced from `public/images/general/`.
- ✅ "Why SOS Moving" section
- ✅ Footer with all links (now rendered once via `SharedHtmlBlock`)
- ✅ Navbar with dropdowns (now rendered once via `SharedHtmlBlock`)
- ✅ Exit popup (now rendered once via `SharedHtmlBlock`; triggers on mouse leave or timeout)
- ✅ Chatbot (loads on desktop after delay)
- ✅ Touchbar + Navbar scroll animation (GSAP)
- ✅ `/mainpage2` — alternative homepage on the new-design stack (Tailwind 4 + framer-motion + Three.js + Lenis smooth scroll)
- ✅ Prod build: 907 static pages + `/mainpage2`, build time ~1.5s

## Remaining Issues

1. **IX2 hover/scroll animations** — After pinning jQuery 3.5.1 most IX2 works, but page-specific animations still need broad verification across city/service/blog routes. CSS workarounds remain where parity is critical.
2. **Forms untested end-to-end** — Select2, Datepicker, InputMask load but haven't been tested with form submission.
3. **Mobile untested** — No mobile testing done yet.
4. **Blog/city/service pages untested** — Only homepage and `/mainpage2` verified so far.
5. **Image coverage** — Phase 2 regenerated 924 variants. Pages that reference images whose BASE file is absent still need to be audited (the generator only fills variants when a base exists).

---

## Git History

```
f281700 Phase 2: Componentize shared blocks + fix relative paths     <- LATEST
7979d27 Add /mainpage2 with new design stack (Tailwind 4 + motion + Three.js)
c2e71ce Phase 1 polish: jQuery 3.5.1, fix %2520 double-encode, image audit
d8c6ed1 Add responsive image generator script + 14 blog variants
b2cac41 docs: update PROJECT-CONTEXT with current state
fe50c51 Download 505 missing images from Webflow CDN
c7fdb0d Update PROJECT-CONTEXT.md with latest progress
83861f2 Add data-wf-page per route + CSS photo scroll animation
a0cd92c Fix JS loading order with ScriptLoader + download missing images
935ddd5 Add PROJECT-CONTEXT.md with full project state and WIP script fixes
```

---

## Vercel Deployment

- **Repo**: https://github.com/Bankai-Agency/sosmovingDIMA
- **Prod**: https://sosmoving-2.vercel.app/
- **Branch**: `main`
- **Framework preset**: Next.js (was changed from auto-detect which incorrectly chose "Static")
- The `_legacy/` folder is excluded via `.vercelignore`

---

## Future Plans

See `CLAUDE.md` for the authoritative two-stack long-term migration plan. Short version:

### Phase 3 (next)
Continue componentizing shared blocks on the legacy stack:
- **Hero** master component — extract the homepage / city / service hero shapes
- **BottomCta** master component — the recurring "Get a free estimate" CTA block
- **MultiStepForm** master component — the quote / book-online form
- **ArticleContent** master component — blog post body

These would be Server Components reading structured data (JSON / Markdown) while still emitting Webflow-class markup for visual parity.

### Eventual full migration off the Webflow stack
Once master components exist on the legacy side, the path is:
1. Keep `(new-design)` as the target stack (Tailwind 4, React 19, framer-motion, Three.js, Lenis)
2. Port page templates one at a time: simple pages first (`about-us`, `free-estimate`), then `cities`, `services`, finally `blog`
3. Migrate content out of HTML into typed JSON / Markdown
4. When every page is on the new stack → delete `(webflow)/` route group, `webflow.css`, jQuery / Slick / GSAP, `ScriptLoader`, `public/pages/*.html`, `wf-*.json`

**Do NOT start the full migration without an explicit request from Dmitriy.** (See `CLAUDE.md`.)

---

## Key Files Quick Reference

| File | Purpose |
|---|---|
| `CLAUDE.md` | Hard project rules + long-term migration plan. Read first. |
| `src/app/(webflow)/layout.tsx` | Legacy root layout — loads Webflow CSS, ScriptLoader, SharedHtmlBlock × 3 |
| `src/app/(webflow)/globals.css` | Responsive font-size + Webflow overrides + photo scroll animation |
| `src/app/(new-design)/layout.tsx` | New-design root layout — Manrope fonts, Lenis, SchemaOrg |
| `src/app/(new-design)/globals.css` | Tailwind 4 + new-design tokens |
| `src/components/ScriptLoader.tsx` | Client component — loads all JS in correct order (legacy only) |
| `src/components/shared/SharedHtmlBlock.tsx` | Server Component — renders `src/data/shared/*.html` once in the layout |
| `src/components/mainpage2/` | 30+ React components for the new-design homepage |
| `src/lib/page-renderer.ts` | Reads HTML from `public/pages/` |
| `src/types/global.d.ts` | TypeScript types for global window objects (gsap, jQuery, etc.) |
| `src/data/shared/*.html` | Single source of truth for navbar / footer / exit-popup / callback-widget |
| `public/webflow.css` | Original Webflow CSS (154KB) |
| `public/custom-scripts.js` | Chatbot, exit popup, form validation, touchbar animation |
| `public/wf-page-map.json` | 550 URL path → data-wf-page ID mappings |
| `public/wf-bundle-map.json` | 550 URL path → Webflow bundle filename mappings |
| `public/pages/*.html` | 537 extracted page HTML files (trimmed of shared blocks in Phase 2) |
| `public/mainpage2/` | Assets (fonts, images, videos, data) for the new-design stack |
| `public/webflow.*.js` | 8 Webflow JS files (4 bundles + 4 chunks) |
| `_legacy/` | Original HTML files (git-ignored, local only) |
| `scripts/extract-pages-html.mjs` | Extraction script |
| `scripts/extract-shared-blocks.mjs` | Phase 2 — pulls navbar/footer/exit-popup out of index.html |
| `scripts/strip-shared-blocks.mjs` | Phase 2 — removes shared blocks from all 537 page files |
| `scripts/fix-relative-paths.mjs` | Phase 2 — normalizes `../..//images/...` to `/images/...` |
| `scripts/generate-responsive-images.mjs` | Generates missing `-p-500/800/1080/1600` variants via `sharp` |
| `scripts/audit-images.mjs` | Audits image coverage across extracted pages |

---

## IMMEDIATE NEXT STEPS

### Step 1: Test other page types
- Open a city page (e.g. `/beverly-hills-movers`) and verify all sections work after Phase 2
- Open a service page (e.g. `/services/apartment-movers`)
- Open a blog post
- Open `/free-estimate` and test the form
- Confirm shared navbar/footer/exit-popup render correctly from `SharedHtmlBlock` on each route type

### Step 2: Verify IX2 across routes
- jQuery 3.5.1 is now pinned. Spot-check city / service / blog pages for hover and scroll-triggered animations.
- If regressions appear, extend the CSS workaround pattern from `globals.css`.

### Step 3: Phase 3 — master components (see Future Plans)
- Start with `Hero`, then `BottomCta`, `MultiStepForm`, `ArticleContent`.

### Step 4: Mobile testing
- Test responsive behavior on mobile viewports for both stacks.

### Step 5: Full Vercel verification
- Verify all 907 routes work on production deploy
- Check Lighthouse scores for both `/` (legacy) and `/mainpage2` (new)

---

## Dependencies in `package.json`

### Active on the new-design stack (`/mainpage2`)
- `tailwindcss` (v4) — styling
- `framer-motion` (aka `motion`) — animation
- `three` — 3D / WebGL effects
- `lenis` — smooth scroll
- `next/font` with Manrope

### Active on the legacy stack
- Original Webflow CSS + vendored jQuery 3.5.1 + Slick + GSAP (loaded via `ScriptLoader`, not as npm deps in the bundle)

### Installed but not yet wired into the legacy stack
- `embla-carousel-react` — future replacement for Slick
- `gray-matter`, `react-markdown`, `rehype-*`, `remark-*` — future blog rendering
- `react-hook-form`, `zod`, `react-imask` — future form handling
- `cheerio` — used in extraction scripts only

These will become primary once Phase 3 and the full migration (per `CLAUDE.md`) begin.
