import { Navbar } from "@/components/mainpage2/layout/Navbar";
import { Footer } from "@/components/mainpage2/layout/Footer";
import { Hero } from "@/components/mainpage2/sections/Hero";
import { MarqueeBand } from "@/components/mainpage2/sections/MarqueeBand";
// BrandReveal disabled per request — file preserved at src/components/mainpage2/sections/BrandReveal.tsx
// import { BrandReveal } from "@/components/mainpage2/sections/BrandReveal";
import { About } from "@/components/mainpage2/sections/About";
import { Services } from "@/components/mainpage2/sections/Services";
import { BestMovers } from "@/components/mainpage2/sections/BestMovers";
import { Steps } from "@/components/mainpage2/sections/Steps";
import { WhySos } from "@/components/mainpage2/sections/WhySos";
import { Reviews } from "@/components/mainpage2/sections/Reviews";
import { VideoReviews } from "@/components/mainpage2/sections/VideoReviews";
import { ServiceAreas } from "@/components/mainpage2/sections/ServiceAreas";
import { Gallery } from "@/components/mainpage2/sections/Gallery";
import { LatestBlogs } from "@/components/mainpage2/sections/LatestBlogs";
import { Faq } from "@/components/mainpage2/sections/Faq";
import { BottomCta } from "@/components/mainpage2/sections/BottomCta";
import { QuoteModal } from "@/components/mainpage2/ui/QuoteModal";
import { SchemaOrg } from "@/components/mainpage2/SchemaOrg";

export default function Home() {
  return (
    <>
      <SchemaOrg />
      <Navbar />
      <main id="main-content">
        <Hero />
        <MarqueeBand />
        <About />
        <Services />
        <BestMovers />
        <Steps />
        <WhySos />
        <Reviews />
        <VideoReviews />
        <ServiceAreas />
        <Gallery />
        <LatestBlogs />
        <Faq />
        <BottomCta />
      </main>
      <Footer />
      <QuoteModal />
    </>
  );
}
