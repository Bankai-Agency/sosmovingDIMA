"use client";

import { useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/mainpage2/ui/Container";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { YouTubePlayer } from "@/components/mainpage2/ui/YouTubePlayer";

// Video-review items — reuse our existing thumbs + YouTube ids from the gallery set
const videoReviews = [
  {
    title: "Client testimonial — Los Angeles move",
    videoId: "K8ipQ81G8lg",
    thumbnail: "/mainpage2/images/gallery-2.webp",
  },
  {
    title: "Client testimonial — with Vivi Castrillon",
    videoId: "dQriI7gJR2Y",
    thumbnail: "/mainpage2/images/gallery-1.webp",
  },
  {
    title: "Client testimonial — SOS Moving",
    videoId: "QG0FZXbvAUg",
    thumbnail: "/mainpage2/images/gallery-3.webp",
  },
  {
    title: "Client testimonial — with Tawny Jordan",
    videoId: "ghzS1cCBruY",
    thumbnail: "/mainpage2/images/video-4.webp",
  },
];

export function VideoReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -460 : 460,
      behavior: "smooth",
    });
  };

  return (
    <section id="video-reviews" className="py-20 md:py-28 overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <p className="font-mono text-sm text-text-muted uppercase tracking-[0.1em] mb-3">
              Client stories
            </p>
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em] mb-5"
            >
              Real Moves, Real Stories
            </RevealText>
            <p className="text-text-muted text-base sm:text-lg leading-[1.5] max-w-xl text-balance">
              Hear directly from the clients we&rsquo;ve helped move. Their stories
              are the best proof of our promise for a simple, stress-free experience.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/about-us/video-reviews"
              className="inline-flex items-center gap-3 rounded-full bg-accent hover:bg-accent-hover text-accent-text px-6 py-4 font-medium text-base tracking-[-0.02em] transition-colors"
            >
              Watch All Video-Reviews
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <div className="hidden md:flex gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous review"
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next review"
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Horizontal scroller — portrait cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-8 pb-2 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {videoReviews.map((v) => (
          <div
            key={v.videoId}
            className="flex-shrink-0 w-[70vw] xs:w-[60vw] sm:w-[320px] md:w-[340px] lg:w-[360px] snap-start rounded-2xl overflow-hidden bg-surface"
          >
            <div className="aspect-[3/4]">
              <YouTubePlayer
                videoId={v.videoId}
                title={v.title}
                thumbnail={v.thumbnail}
                className="h-full w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
