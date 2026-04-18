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
