"use client";

import { useRef } from "react";
import { Container } from "@/components/mainpage2/ui/Container";
import { FadeUp } from "@/components/mainpage2/ui/Animate";
import { YouTubePlayer } from "@/components/mainpage2/ui/YouTubePlayer";

const galleryVideos = [
  {
    title: "SOS Moving TOP-10 Moving Company in Los Angeles",
    videoId: "K8ipQ81G8lg",
    thumbnail: "/mainpage2/images/gallery-2.webp",
  },
  {
    title: "SOS Commercial with Vivi Castrillon",
    videoId: "dQriI7gJR2Y",
    thumbnail: "/mainpage2/images/gallery-1.webp",
  },
  {
    title: "SOS Commercial",
    videoId: "QG0FZXbvAUg",
    thumbnail: "/mainpage2/images/gallery-3.webp",
  },
  {
    title: "SOS Commercial with Tawny Jordan",
    videoId: "ghzS1cCBruY",
    thumbnail: "/mainpage2/images/video-4.webp",
  },
];

export function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      {/* Header stays inside Container */}
      <Container>
        <FadeUp>
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-3xl md:text-[3rem] font-bold text-white leading-tight">
              Gallery
            </h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300"
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-text-muted text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
            SOS Moving and Storage photos and videos, including our employees,
            fleet of powerful trucks, and commercials.
          </p>
        </FadeUp>
      </Container>

      {/* Slider goes full width — starts from Container padding, overflows right */}
      <FadeUp delay={0.1}>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-8 pb-2 scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {galleryVideos.map((video) => (
            <div
              key={video.videoId}
              className="flex-shrink-0 w-[85vw] sm:w-[44rem] snap-start"
            >
              <YouTubePlayer
                videoId={video.videoId}
                title={video.title}
                thumbnail={video.thumbnail}
              />
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
