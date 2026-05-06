import { Navbar } from "@/components/mainpage3/layout/Navbar";
import { FooterParallax } from "@/components/mainpage3/layout/FooterParallax";
import { FrameSequenceHero } from "@/components/mainpage3/sections/FrameSequenceHero";
// LogoMarquee — disabled per request (was right under hero with "Licensed, insured & accredited")
// import { LogoMarquee } from "@/components/mainpage3/sections/LogoMarquee";
import { ZoomVideo } from "@/components/mainpage3/sections/ZoomVideo";
// About — disabled per request
// import { About } from "@/components/mainpage3/sections/About";
import { Benefits } from "@/components/mainpage3/sections/Benefits";
// ServicesSticky — disabled: was a 2nd pinned section right after Benefits,
// stacking with ImagineMove + HorizontalScroll caused pin-overlap.
// import { ServicesSticky } from "@/components/mainpage3/sections/ServicesSticky";
import { BestMovers } from "@/components/mainpage3/sections/BestMovers";
import { ImagineMoveA } from "@/components/mainpage3/sections/ImagineMoveVariants";
// PinnedTextReveal — disabled: 3 pinned sections back-to-back (this + ImagineMove + HorizontalScroll) broke ScrollTrigger pin layout.
// import { PinnedTextReveal } from "@/components/mainpage3/sections/PinnedTextReveal";
import { HorizontalScroll } from "@/components/mainpage3/sections/HorizontalScroll";
// Quote (full-bleed photo + pull-quote) removed — Reviews + VideoReviews cover it.
import { Reviews } from "@/components/mainpage3/sections/Reviews";
import { VideoReviews } from "@/components/mainpage3/sections/VideoReviews";
import { Coverage } from "@/components/mainpage3/sections/Coverage";
import { Gallery } from "@/components/mainpage3/sections/Gallery";
import { LatestBlogs } from "@/components/mainpage3/sections/LatestBlogs";
import { Faq } from "@/components/mainpage3/sections/Faq";
import { ContactForm } from "@/components/mainpage3/sections/ContactForm";
import { CtaBlock } from "@/components/mainpage3/sections/CtaBlock";
// Slideshow ("Trucks & crew" caption rotator) disabled per request — file preserved at src/components/mainpage3/sections/Slideshow.tsx
// import { Slideshow } from "@/components/mainpage3/sections/Slideshow";
// TextStrip (manifesto breather) disabled per request — file preserved at src/components/mainpage3/sections/TextStrip.tsx
// import { TextStrip } from "@/components/mainpage3/sections/TextStrip";
import { StackingParallax } from "@/components/mainpage3/ui/StackingParallax";
import { ScrollTriggerSync } from "@/components/mainpage3/ui/ScrollTriggerSync";
import { QuoteModal } from "@/components/mainpage2/ui/QuoteModal";

/**
 * Section ordering principle: alternate "heavy media" with "text breathers"
 * so the page never stacks two visual blocks back-to-back.
 *
 *   Hero (text)         → LogoMarquee (strip)
 *   PinnedVideo (media) → About (text)
 *   Benefits (text)     → BestMovers (text)
 *   ImagineMove A/B/C   ← three variants, side-by-side. Pick one and delete the rest.
 *   PinnedTextReveal    → HorizontalScroll (process steps, "Six steps, zero surprises")
 *   Quote (media)       → Reviews (text marquee)
 *   VideoReviews        → Coverage (text)
 *   Gallery             → LatestBlogs (text)
 *   Faq → ContactForm → CtaBlock → Footer
 */

export default function Mainpage3() {
  return (
    <>
      <Navbar />
      <main>
        <FrameSequenceHero />
{/* <LogoMarquee /> — disabled per request */}

        <ZoomVideo />

{/* <About /> — disabled per request */}
{/* <ServicesSticky /> — disabled */}
        <Benefits />

        <BestMovers />

        <ImagineMoveA />

        <Reviews />
        <VideoReviews />

        <HorizontalScroll />

        <Coverage />

        {/* STACKING PARALLAX bridge: Gallery -> LatestBlogs slides over it */}
        <StackingParallax>
          <div data-stacking-cards-item style={{ background: "var(--m3-bg)" }}>
            <Gallery />
          </div>
          <div
            data-stacking-cards-item
            style={{
              background: "var(--m3-bg)",
              borderTopLeftRadius: "1.5rem",
              borderTopRightRadius: "1.5rem",
              marginTop: "-1.5rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <LatestBlogs />
          </div>
        </StackingParallax>

        <Faq />
        <ContactForm />
        <CtaBlock />
      </main>
      <FooterParallax />
      <ScrollTriggerSync />
      <QuoteModal />
    </>
  );
}
