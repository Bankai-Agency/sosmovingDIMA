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
