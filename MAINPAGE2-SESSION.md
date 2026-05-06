# /mainpage2 redesign session — context dump

> Write-up of the `/mainpage2` redesign work done in this session. Read this + `PROJECT-CONTEXT.md` + `CLAUDE.md` to resume.

## What changed

Replaced the old `/mainpage2` with a full redesign driven by screenshots of external references (MindMarket, Terminal Industries, Nivisgear, Sharmax, Tom Carder Media, HHhusher, StartDuck, GoatMovers, Growth-Hub-2). All files under `src/app/(new-design)/` and `src/components/mainpage2/` + a few primitives under `src/components/core/` and `src/components/ui/`.

### Fonts
- `src/app/(new-design)/layout.tsx`
  - Uses `next/font/google` with **Geist** (sans) + **Roboto Mono** (mono). No Switzer/Manrope/Fontshare anymore.
- `src/app/(new-design)/globals.css`
  - `--color-bg: #000000` (pure black), `--color-surface: #1a1a1a`
  - `--font-sans: var(--font-geist-sans), ...` (Geist default)
  - `--font-mono: var(--font-roboto-mono), ...`
  - `.font-mono { letter-spacing: -0.02em }` — default tracking for all mono text

### Hero (`sections/Hero.tsx`)
- Left-aligned layout. Large h1 in 2 RevealText lines: `SOS Moving Company` + `in Los Angeles` (`Los` / `Angeles` accent yellow).
- Title Case (not uppercase).
- Animated tagline between h1 and subtitle: `Your move, made [easy|fast|stress-free|affordable|trusted]` via `ContainerTextFlip` (yellow solid pill, letter morph, `interval=3000`, `animationDuration=600`).
- `sr-only` span with full phrase for SEO.
- Subtitle with `text-balance`.
- Video bg preserved (giant SOS watermark removed).
- Bottom row: stats (10,000+ / 4.9 / 20+) on the **left** + 2 **rating pills** (Yelp + Google, with stars, score/5, YelpLogo/GoogleLogo SVGs) on the **right**, `lg:justify-between`.
- `.hero-switzer` CSS in globals.css still provides Terminal-derived h1 clamp (`font-size: clamp(2.25rem, 6.5vw, 6.125rem)`, `font-weight: 600`, `line-height: 0.95`, `letter-spacing: clamp(...)`).

### Navbar (`layout/Navbar.tsx`)
- Smart sticky: transparent over hero (scrollY < 85% vh), collapses to dark plate (`bg-[#141414]`) after hero, auto-hides on down-scroll and returns on up-scroll via `useEffect` + `lastScrollY` ref.
- Three dropdowns (Moving / Locations / About Us) mirroring legacy `src/data/shared/navigation.json` + `navbar.html`:
  - Moving: 7 services (Apartment/Commercial/Long-Distance/Packing/White Glove/Storage/Local Movers) + All Services CTA card.
  - Locations: 6 cities (LA / Orange County / Calabasas / Portland / Seattle / Denver).
  - About Us: 6 sub-pages (Our Team, Gallery, Contact Us, Company Policy, Apartment Partnership, Refer Friends & Get Cash).
- Separate top-level links: Reviews (`#reviews`), FAQ (`#faq`), Blog (`/blog`).
- Mega-dropdown panel (`grid-cols-[240px_1fr] max-w-[720px]`): CTA image card left, 2-col link list right.
- **Pill-nav hover animation** (from React Bits PillNav, CSS port):
  - `.pill-nav-link` in globals.css — yellow circle expands from bottom on hover, label slides up while yellow hover-label slides in (`pill-label` + `pill-label-hover` stack with `translateY` transitions, `cubic-bezier(.5,0,0,1)`).
  - Marked `is-open` on active dropdown trigger so its pill stays filled yellow.
- Get a quote CTA plate stays yellow (`bg-accent`).
- Circle phone button (40×40 `bg-accent`) inside main plate.
- Mobile full-screen menu preserved.

### Footer (`layout/Footer.tsx`)
- 1:1 layout port of MindMarket footer but adapted to our palette:
  - `bg-accent` (yellow) with `text-[#151414]`, `rounded-t-[35px] lg:rounded-t-[50px]`.
  - Top row: blurb + rounded white pill `Get a quote` CTA // 2-col nav links.
  - Middle row: huge `Let's / Move` heading (fluid clamp `clamp(3.625rem, ..., 10.875rem)`, `font-weight: 500`, `line-height: 0.95`, `letter-spacing: -0.06em`) + contact info (LA office, email, phone).
  - Bottom row: copyright + USDOT/CAL-T/MC + social links.
- **Self-running seamless marquee** at the top: `Get your free quote` (text-[14vw]) × 3 repeats animated with existing `.animate-marquee-left` keyframe — smooth loop, hover:underline on each link.
- `overflow-x-hidden` (NOT `overflow-hidden`) so page scrolls to bottom.
- `min-h-[100svh]` removed — natural height.

### Sections
- **All h2 unified** to `text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em]` across About, Services, BestMovers, WhySos, Reviews, ServiceAreas, Gallery, Faq, LatestBlogs, VideoReviews, Locations.
- **SectionLabel** rewritten to mono eyebrow `font-mono text-sm text-text-muted uppercase tracking-[0.1em] mb-3` (no dot, not yellow). Applied as "buttonsabove heading" pattern everywhere.

- **About** — unchanged beyond h2 normalization.
- **Services** (`sections/Services.tsx`) — larger cards `min-h-[460px]` with `aspect-[4/3]` image at top always visible + `BorderGlow` hover effect (from React Bits). Icon + title stacked below image. Accent glow via `glowColor="52 100 60"`.
- **BestMovers** — bullet list items use `font-mono font-medium uppercase tracking-[-0.02em]`.
- **WhySos** (`sections/WhySos.tsx`) — **hhhusher-style**: one big image (aspect 16/10 → 16/9 → 21/10, rounded-3xl) with title overlay top-left, 4 numbered pill-tabs at bottom (grid 2 cols mobile, 4 cols desktop). Auto-rotates every 5s, pauses on hover.
- **Reviews** (`sections/Reviews.tsx`) — 2-col grid: left heading + accent pill CTA; right 2 vertical marquee columns with opposing directions (`animate-marquee-up/down` from globals.css). Review card is Goat-Movers spec: name (Geist 600 24px), city (Roboto Mono 700 16px) + source circle with Yelp/Google real SVG logos (yelp uses user-provided SVG path), hover on source circle → `bg-accent text-accent-text`.
  - `src/data/mainpage2/homepage.json` — added `city` field to each review (LA, Beverly Hills, Santa Monica, Pasadena, Glendale, Burbank).
- **VideoReviews** (NEW `sections/VideoReviews.tsx`) — "Real Moves, Real Stories" horizontal scrolling portrait video cards (aspect 3/4), yellow pill `Watch All Video-Reviews` + prev/next buttons. ⚠️ Still uses gallery videoIds + thumbs; user flagged this needs real video-review content but hasn't provided it yet.
- **ServiceAreas** (`sections/ServiceAreas.tsx`) — 2-col: left = `RegionMap` card with green live dot + `Get your free quote` yellow pill CTA, sticky on lg; right = accordion list of regions → click expands to show neighborhood pills. Each row has `01/02/…` mono number + region name + expand/collapse circle button.
- **Gallery** — masonry `columns-2 sm:columns-3` with `break-inside-avoid`, framer-motion `InView` primitive (stagger blur/scale reveal). 10 SOS images.
- **LatestBlogs** (NEW `sections/LatestBlogs.tsx`) — "From the blog". Server component, `getBlogPosts({ limit: 6 })`. Horizontal scroll with large cards (`w-[82vw] sm:w-[440px] md:w-[480px] lg:w-[520px]`, aspect 4/3 image + meta + title). 4th card intentionally scrolls off-screen. Yellow pill `View all articles` CTA in header.
- **Faq** (`sections/Faq.tsx`) — title outside grid, 2-col: left accordion (rounded-3xl surface, items with circle icon + answer reveal), right `Any questions left?` card with 4 contact circles (phone/text/email/quote) in accent — phone is solid yellow. Container `max-w-7xl` (was `max-w-[90rem]` — fixed to match rest).
- **QuoteForm** (NEW `sections/QuoteForm.tsx`) — 1:1 port of growth-hub-2 form structure, adapted to dark palette:
  - Card `bg-surface` rounded-[2rem], inputs `h-[3.75rem] rounded-2xl bg-white/5` (60px height, no border just fill), radio with 6px accent ring on checked state, textarea min-h-40. Yellow submit pill + privacy note. Decorative `$119 per hour` sticker (rotated 12° yellow circle).
- **BottomCta** (`sections/BottomCta.tsx`) — tall pre-footer banner (`h-[92svh] min-h-[640px] max-h-[1100px]`), rounded-2xl/3xl framed (not full-bleed). Parallax image (`Helpers-and-Truck.webp`) via `useScroll` + `useTransform` with `y: -12% → +12%`. Dark gradient overlay. Title: `Let's [move/roll/go/pack]` with `ContainerTextFlip` morph. Subtitle + yellow pill CTA below.
  - **ImageTrail** (`src/components/core/image-trail.{tsx,css}`) — React Bits GSAP mouse-trail port. 8 SOS images follow the pointer inside the CTA card. `gsap` dependency installed.

### Primitives (`src/components/core/` + `src/components/ui/`)
- `src/components/core/in-view.tsx` — lightweight `InView` wrapper (framer-motion `useInView` + `motion.div` with variants + `initial="hidden"/animate="visible"`), used by Gallery.
- `src/components/core/text-loop.tsx` — motion-primitives-style TextLoop (cycle children with AnimatePresence mode="wait"). Currently unused (replaced by ContainerTextFlip in Hero), but left in repo.
- `src/components/core/scroll-based-velocity.tsx` — Magic UI ScrollVelocity port. Currently unused (replaced by simpler `.animate-marquee-left` in Footer), kept for future use.
- `src/components/core/image-trail.{tsx,css}` — GSAP mouse-trail, used by BottomCta.
- `src/components/ui/container-text-flip.tsx` — Aceternity-style word cycle with morphing yellow box + letter blur/opacity stagger. Used in Hero + BottomCta.
- `src/components/mainpage2/ui/BorderGlow.{tsx,css}` — React Bits mesh-gradient border glow that tracks cursor near edges. Used in Services cards.

### Button (`src/components/mainpage2/ui/Button.tsx`)
- Iterated through many designs (Terminal, Nivisgear, Goat). Current: **startduck `.u-button` spec** — pill `rounded-full`, `font-medium leading-none tracking-[-0.03em]`, `px-8 py-4 text-base`, accent yellow primary, simple hover bg shift.
- `size` prop kept for API compatibility but ignored.
- Variants: primary (yellow), outline (white border + backdrop-blur), ghost (transparent).

### Page composition (`src/app/(new-design)/mainpage2/page.tsx`)
Order:
```
<Hero />
<MarqueeBand />
<BrandReveal />
<About />
<Services />
<BestMovers />
<WhySos />
<Reviews />
<VideoReviews />
<ServiceAreas />
<Gallery />
<LatestBlogs />
<Faq />
<QuoteForm />
<BottomCta />
<Footer />
```

### Known open items
- **VideoReviews content**: user flagged that current videoIds/thumbs are from Gallery and wants real client video-review content. Needs real data pass.
- **Navigation.json** — still used by Footer/Navbar in parts; no changes made beyond what's in Navbar.tsx data.
- **Dropdowns Moving/Locations/About Us** — image CTA cards use available images (`Long-Distance-Movers-Los-Angeles.avif`, `Movers-Los-Angeles.avif`, `Helpers-and-Truck.webp`). Replace if better art appears.

## 2026-04-19 — Polish pass (design-system cleanup)

Follow-up session that tightened the existing /mainpage2 redesign against feedback. Nothing structural; every change is a local edit to an existing section or a new small UI primitive.

### H2 unified across all sections
All `<h2>` eyebrows now use the same Tailwind scale: `text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em]`. Previous divergence (About, BestMovers, Steps had custom scales) was flattened. Exceptions: QuoteForm H2 when embedded in Footer card, BottomCta's oversized CTA heading.

### Section-level changes
- **Hero**: Yelp/Google rating callouts moved from mid-right to bottom-right (pinned). Score typography dropped from 2.5rem → 1.75rem so the rating pair feels balanced; both cards are now `<a target="_blank">` to `company.social.yelp` and `company.social.google` with hover accent + `↗` icon. Price callout "$119/hr" removed. Bottom-left stats row enlarged: 10,000+ / 4.9 / 20+ at ~4.5rem.
- **About**: SectionLabel "About" moved above H2 in the right column (was next to / right of H2). Stats card on the left keeps flex-1 photo pushing the avatars+numbers card to bottom.
- **Services (BorderGlow cards)**: rebuilt content layout — title + description with pad 6-7, icon moved onto image top-right as a 48-56px badge (backdrop-blur, bg-black/50 → bg-accent on hover). Default border `transparent`, hover → `rgba(255,255,255,0.15)`. Added `description` rendering from `homepage.json`. "View all services" text-link replaced with the standard `<Button>`.
- **BestMovers (Local experts)**: full rewrite in design-system style. 2-col grid, left = SectionLabel + standard H2 + description + 4 numbered highlights as Steps-style hairline rows with **icon-on-left** (56-64px badge, 22px SVG), right = sticky 4:5 photo with all overlays removed (no rating pill, no $119 sticker, no credentials). CTA buttons removed entirely.
- **Steps (new section)**: 2-col block inspired by Figma node 44:2389. Left column (sticky top-24): H2 + aspect-square photo swapping with active step + `Let's talk` Button. Right column: accordion of 7 steps with L-shaped top+left borders (`border-t border-l border-white/10`) and 8px gap between rows. Photo + active-caption animate via `AnimatePresence`. Placed between BestMovers and WhySos in page.tsx.
- **WhySos**: image goes full-bleed viewport-width+height (`w-screen h-screen left-1/2 -translate-x-1/2`). H2 + SectionLabel + active-text overlay live ON the image (top padding), tab-pills overlay ON the image (bottom padding, in a centred max-w-7xl wrapper). Background gradients changed to `from-black/75 via-black/25 to-transparent` on both top and bottom halves so overlaid text reads in any viewport. Rotation: `useEffect` with `setTimeout` keyed on `[active]` — auto-advances every 5s, resets on click. Active tab shows a horizontal `scaleX: 0 → 1` progress fill in yellow matching the rotation duration.
- **ServiceAreas**: city neighbourhood pills got stroke removed (`border border-white/10` → no border), font bumped from `text-sm` to `text-base` (+2px), height `h-9 → h-10`, right padding `pr-4 → pr-5`. Map-side "Get your free quote" CTA button removed.
- **Reviews, VideoReviews, LatestBlogs**: horizontal scrollers already had edge-fade mask via `mask-image: linear-gradient(...)` from previous session — kept as-is. Blog cards got default bg bumped `bg-white/[0.03] → bg-white/[0.06]` with hover `bg-white/[0.1]`; removed "NEW" badge and category tag + any stroke.
- **FAQ**: H2 restyled to the unified blog-heading scale. Accordion question `h3` now uses blog card title spec (`text-2xl lg:text-[1.75rem] font-semibold leading-[1.15]`), answer text thinned to `font-normal text-text-muted` with looser `leading-[1.5]`. Right sidebar: 4 circle icons replaced with 2 pill Buttons — "Call us" (primary) + "Write us" (outline). Section padding tightened `py-20 md:py-28 → py-16 md:py-20`, accordion row padding `py-8 → py-6`.
- **QuoteForm**: rewritten to 2-col layout matching About/BestMovers (left = SectionLabel + H2 + blurb + phone/email icons, right = form card). Form body extracted to `ui/QuoteFormFields.tsx` and reused by the modal. Entire QuoteForm section is now rendered **inside Footer** (before the marquee), not as a standalone main-page section.
- **BrandReveal**: disabled. File kept at `sections/BrandReveal.tsx` with a header comment explaining why + date; import commented out in `page.tsx`. Re-enabling is a single line change.

### New UI primitives
- `ui/VideoReviewPlayer.tsx` — mp4 facade with custom play button (44-48px pill), clicking anywhere on the card plays. `data-video-card="idle|playing"` attribute drives the shared hover cursor.
- `ui/WatchCursor.tsx` — single, portaled, fixed-positioned yellow "▶ WATCH" cursor that tracks any element matching its `cardSelector` via delegated `mousemove` on a container ref. 180ms delayed-hide prevents flicker when moving between adjacent cards. Replaced per-card cursors that were flying in from (0,0) on each new card.
- `ui/QuoteFormFields.tsx` — the raw form body (inputs + radios + textarea + submit + privacy blurb). Used by both `sections/QuoteForm.tsx` and the new `ui/QuoteModal.tsx`.
- `ui/QuoteModal.tsx` — portal modal with the same form. Listens for a global `sos:open-quote-modal` window event, exports `openQuoteModal()` helper. Locks body scroll while open, `Escape` to close, backdrop click to close. Mounted once near the bottom of `page.tsx`.
- `ui/Button.tsx` — upgraded to a client component. Any `Button` with `href` in `QUOTE_HREFS = {"/free-estimate", "/book-online"}` now calls `openQuoteModal()` on click instead of navigating. All existing callers keep working; the modal picks them up transparently.

### Body/html paint experiment — reverted
Briefly tried a "sharp black→white" zone (FAQ + QuoteForm + BottomCta on white bg driven by a scroll-linked fixed panel: `ScrollPaint.tsx`, `WhiteZone.tsx`). User opted out ("белый фон убери вообще") — both primitives deleted, body bg restored to `var(--color-bg)`, FAQ H2 got `text-white` back.

### Final order on /mainpage2
```
<Hero /> <MarqueeBand /> <About /> <Services /> <BestMovers /> <Steps /> <WhySos />
<Reviews /> <VideoReviews /> <ServiceAreas /> <Gallery /> <LatestBlogs /> <Faq />
<BottomCta />
<Footer>  ← now hosts <QuoteForm />
<QuoteModal />  ← mounted once outside <main>
```

## Stack
- Next.js 16.2.4 (Turbopack dev)
- React 19
- framer-motion (motion)
- Tailwind CSS v4 (@theme inline)
- Lenis smooth-scroll (`SmoothScroll.tsx` in layout)
- gsap (new — for ImageTrail)
- next/font with Geist + Roboto Mono

## Dev
- Dev server runs externally on port 3000 (user owns it). `preview_start` refuses to manage it — verifications happened via `curl http://localhost:3000/mainpage2`.
- `.next/dev/logs/next-development.log` has server+browser compile/error events; recent entries show clean compiles.

---

## 2026-04-30 — Production unblock + multi-pass polish

Long iterative pass touching nearly every section. Two infra fixes unblocked production deploys; the rest is design / interaction polish.

### Production deploy unblocked (Vercel Hobby)

Two consecutive build-time blockers, fixed in commits `05a9fd4` and `59aab50`:

1. **Cron schedule rejected on Hobby plan** — `vercel.json` had `*/5 * * * *` for `/api/cron/publish-scheduled`. Hobby permits 1 cron run / day max; build aborted with `Hobby accounts are limited to daily cron jobs`. Changed to `0 0 * * *` (midnight UTC). Trade-off: scheduled blog publishes drift up to 24h vs the 5-min original — acceptable until/unless Pro is bought.
2. **`function_size_exceeded` (250 MB)** on `/api/upload`. `src/lib/admin/image-store.ts` calls `join(process.cwd(), "public/images/blog") + existsSync` — Next's file tracer treats the referenced folder as a runtime dependency and rolled the entire 262 MB `public/images/blog/` into the function bundle. Fix: `outputFileTracingExcludes` in `next.config.ts`:
   ```ts
   outputFileTracingExcludes: {
     "/api/upload":            ["public/**", ".next/**", "src/data/blog/**"],
     "/api/cron/publish-scheduled": ["public/**", ".next/**"],
     "/mainpage2":             [...heavy admin-only deps...],
   }
   ```
   Verified locally with `vercel build`: warning gone, function under 250 MB.

Also added `.vercel` to `.gitignore`. Vercel CLI used to confirm: 10h-old prod deploy was the last successful one before this; webhook had been failing silently on every push since the admin-cms merge introduced @blocknote / @neondatabase / drizzle / next-auth / @octokit.

### Hero
- Right-side rating callouts redesigned — twice. Final form: glass pills (`h-14`, `bg-white/10` + `backdrop-blur-md` + `border-white/15`) with logo badge on left, score + 5 stars + mono review-count label, ↗ arrow on right. Class `glass-phone-btn` reused so they get the shimmer sweep + scale on hover (see Navbar section). Per-platform brand colors:
  - **Yelp** — logo `#FF1A1A` red on rest, on hover badge becomes `#FF1A1A` and logo flips to white via `currentColor` (YelpMark uses `fill="currentColor"`).
  - **Google** — multicolor logo on rest, on hover badge becomes Google Blue `#4285F4` and the multicolor SVG is forced white via CSS filter `brightness-0 invert` wrapping `<Mark />`.
  - Yellow glow ring around the badge that the previous iteration added was **removed** at user request — only `transform: scale(1.08)` spring remains.
- Stats row scaled down: `text-2xl sm:text-4xl md:text-5xl lg:text-[4.5rem]` → `text-xl sm:text-3xl md:text-4xl lg:text-[3rem]` with `gap-x-4 sm:gap-x-8` and `h-8 sm:h-12` dividers (was 4.5rem / 64-72 / 12-16).
- **Mobile fixes** (Figma feedback "h1 looks smaller than h2 on mobile"):
  - `.hero-switzer h1` clamp min `2.25rem` → `3.25rem`, viewport unit `6.5vw` → `8vw`. At 375px now reads ~52 px (vs 36 px before, vs same 36 px other H2s).
  - Inner content group: `justify-center` → `justify-end md:justify-center` — content sits flush at bottom on mobile while staying centered on desktop.
  - Stats row laid out with `gap-x-4 sm:gap-x-8`, smaller numbers + visible `h-10 sm:h-16 w-px` dividers — fits in single line at 360-420px viewports.

### Navbar — phone CTA + dropdown polish
- Replaced 40×40 phone-icon disc with a **glass pill** showing `(909) 443-0004` next to a yellow accent badge. `bg-white/10 + backdrop-blur-md + border-white/20`, h-14 (matches "Read more" blog spec, matches Get-a-quote pill). Forces `Button` into h-14 too via `!h-14 md:!h-14 lg:!h-14 !px-8 ...` className override — both buttons in nav now look identical in size to LatestBlogs cards' "Read more".
- New CSS class `.glass-phone-btn` in globals.css. Three layered hover effects:
  - Diagonal yellow→white **shimmer sweep** via `::after` pseudo, `translateX(-130% → 130%)` over 0.9s
  - Yellow badge `transform: scale(1.08)` with bouncy `cubic-bezier(0.34, 1.56, 0.64, 1)`
  - Phone icon **rings** — 3-shake animation `phone-ring` keyframe (-14° / +14° / 0°) over 0.7s
  - Class is reused on the Hero rating pills (their badge transitions to brand color instead of staying yellow).
- `Get a quote` Button moved **inside** the main bar plate so the compact (post-hero) plate contains both phone + quote in one rounded pill. Bar `gap-6` → `gap-3` (tighter spacing between buttons).
- Dropdown panel left/right column gap `gap-3` → `gap-6` so the link list breathes from the image card.
- Dropdown link hover: yellow underline (poor contrast on white panel) → **letter-wave** (each char shifts up 2 px with 18 ms stagger) + arrow ↗ slides in from `-translate-x-2 + opacity-0`. The yellow leading dot was added then removed at user request.
- Social-icons row in nav was prototyped (Instagram/TikTok/YouTube on xl+) and rolled back ("ладно не добавляй").

### WhySos — full-bleed + tab UX rework
- Section padding `py-20 md:py-28` → none. Image is `w-screen h-screen` (full viewport on every device).
- Top + bottom gradient overlays darkened to `from-black/95 via-black/60 to-transparent` (was `/75 /25`). Heading and tabs read regardless of photo subject.
- Description text **swaps with active tab** under the H2 (`AnimatePresence mode="wait"` keyed on `active`, fade + 10 px slide). Lost during the earlier "keep one heading" pass; restored.
- Tab pills:
  - Stroke removed entirely (`borderWidth: 0`).
  - Inactive `bg-black/30` → `bg-white/[0.08]` so they look glass-ish, not patches of darkness.
  - Active `bg-white/20` (no full-bg yellow fill anymore).
  - Label is **always white** — fixes "couldn't read which tab is active until yellow filled it".
  - Progress indicator: previously a yellow rectangle filling the whole tab bg → now a **3 px accent bar pinned to bottom** of the active tab, animates `scaleX 0 → 1` over 5 s. Cleaner, tab content stays visible from t=0.
- Auto-rotate logic switched from `setInterval` + `paused` boolean to a single `setTimeout` keyed on `[active]` so any click both selects the tab and resets the 5 s clock; mouse-pause behavior dropped.

### Services
- Last two service cards' images swapped: `packing-img.webp` / `storage-img.webp` (mockup star/lightning) → `Packers-and-movers.avif` / `storage-bg.webp` (real photos). Updated in `src/data/mainpage2/homepage.json`.

### BestMovers / "Local Experts"
- Iterative redesign:
  1. Numbers `01–04` removed before each highlight title.
  2. Numbered hairline rows → **rounded plates** (`rounded-2xl bg-white/[0.04] hover:bg-white/[0.07]`), `gap-3` between cards, no border.
  3. Icon badge moved from right → **left** of each row, badge sized up `w-14 → w-16` (md), inner SVG `18 → 22 px`. Color stays accent yellow.
- Right column photo: all overlays already removed from earlier session. Buttons (Get-a-quote + phone) removed entirely from the heading column too.

### Steps
- Border style for accordion rows changed: `border-t border-l border-white/10` (L-shaped) → **fully rounded plates** (`rounded-2xl bg-white/[0.04]` rest, `bg-white/[0.08]` open, no border). Matches BestMovers card style.

### Reviews
- "View all reviews" mega-button (`px-10 sm:px-16 py-6 sm:py-7 text-xl sm:text-2xl bg-accent`) replaced with the standard `<Button>` so it matches every other CTA on the page.
- **Mobile layout** (Figma 461:15767): single vertical column → horizontal native scroll → **two horizontal auto-marquees** with opposing directions:
  - Row 1 — `animate-marquee-left`, tripled array (`-33.333% keyframe = exactly 1 set`), 15 s.
  - Row 2 — `animate-marquee-right`, reversed tripled array, 15 s. Mirrors desktop's two opposing vertical columns.
  - Cards `w-[82vw]` so each takes nearly the whole viewport. Edge-fade mask left+right.
- Desktop layout (`hidden sm:grid grid-cols-2`) untouched.

### VideoReviews — drag scroll + correct play/pause
- Scroller now supports **drag-to-pan with inertia** (mouse/pen only, native touch is preserved):
  - Threshold 5 px before pointer capture is taken — preserves the simple click-to-play path.
  - Velocity sampled from a rolling 80 ms window of pointer positions; on release `requestAnimationFrame` decays at `velocity *= 0.93` until `< 0.4 px/frame` (iOS-style momentum).
  - Inertia is cancelled on next pointer-down so a fast successive drag feels responsive.
  - `snap-x snap-mandatory` removed (was producing the abrupt snap user complained about); free pan with momentum is the new behavior.
  - When a real drag fires (`s.moved === true`), the trailing `click` event is swallowed via a one-shot capture-phase listener so we don't auto-play the card the user happened to release over.
- `VideoReviewPlayer.tsx`:
  - Idle state: `onClick={play}` on card, `<video pointer-events-none>` so click reaches the card.
  - Playing state: `onClick={undefined}`, `<video pointer-events: auto controls>` — clicks now reach native HTML5 controls (pause/seek/volume work). Bug introduced and fixed in this pass.

### LatestBlogs — slider controls
- Server component split into `LatestBlogs.tsx` (server, `getBlogPosts({ limit:6 })`) + `LatestBlogsClient.tsx` (client, owns scroll ref + prev/next).
- Prev/next buttons are 48 px circles `border-border` styled identically to VideoReviews controls. Live **inline in the header row** beside `View all articles` — final order: `[View all articles] [prev] [next]`.
- `step: 520 px` per click (matches `lg:w-[520px]` card width). The intermediate `HorizontalScroller.tsx` primitive is no longer used by LatestBlogs (kept around in case other sections want it).

### FAQ
- Whole section scaled down so it doesn't dwarf its neighbours:
  | | Was | Now |
  |---|---|---|
  | section padding | `py-20 md:py-28` | `py-14 md:py-16` |
  | H2 | `lg:text-[5rem]` (80 px) | `lg:text-6xl` (60 px) |
  | accordion `h3` | `lg:text-[1.75rem]` (28 px) | `lg:text-[1.375rem]` (22 px) |
  | answer `p` | `text-base md:text-lg` | `text-sm md:text-base` |
  | sidebar `h3` | `md:text-[2.5rem]` (40 px) | `md:text-3xl` (30 px) |
  | sidebar subtitle | `md:text-2xl` | `md:text-lg` |
  | row padding | `px-6 md:px-10 py-6` | `px-5 md:px-8 py-4 md:py-5` |
  | expand-icon disc | `h-10 md:h-12 w-12` | `h-9 md:h-10 w-10` |
  | sidebar pad / width | `p-8 md:p-12` / `460px` | `p-6 md:p-8` / `380px` |
- A brief center-only experiment (`max-w-3xl mx-auto` + `text-center`, sidebar removed) was applied then reverted at user request.

### Pill button — visible edge against dark page bg
- `.pill-btn--primary` on hover transitions yellow → `#1a1a1a`. Page bg is also dark, so the dark fill blended into the page (only the curved sides were visible). Fixed: added `box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18)` on `:hover` / `:focus-visible` with `transition: box-shadow 0.55s cubic-bezier(0.5,0,0,1)` so the entire pill outline is now visible after hover lands. No layout shift (uses inset shadow, not border).

### General buttons
- `Button.tsx` base class:
  - Mobile: `w-full sm:w-auto` — every CTA spans full container width on phones.
  - Desktop: `h-12 md:h-14 lg:h-[60px]`, `px-6 md:px-8 lg:px-9`, `text-[0.9375rem] md:text-base lg:text-[1.0625rem]`, `gap-3 md:gap-4`. Roughly +25 % visual weight at lg vs the pre-pass spec.

### Stack-quirk note: turbopack CSS HMR
- This session triggered the well-known turbopack stale-CSS cache 4 separate times (changes in `globals.css` not picked up by HMR even after page reload). Each time the workaround was: stop dev server → `rm -rf .next` → `preview_start` again. Worth keeping in mind: if a CSS edit "doesn't apply" after a few seconds, restart instead of debugging the rule.

### Final order on /mainpage2 (unchanged from previous session)
```
<Hero /> <MarqueeBand /> <About /> <Services /> <BestMovers /> <Steps /> <WhySos />
<Reviews /> <VideoReviews /> <ServiceAreas /> <Gallery /> <LatestBlogs /> <Faq />
<BottomCta />
<Footer>  ← hosts <QuoteForm />
<QuoteModal />  ← mounted once outside <main>
```
