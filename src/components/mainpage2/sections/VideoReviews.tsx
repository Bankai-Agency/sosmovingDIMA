"use client";

import { useRef } from "react";
import { Container } from "@/components/mainpage2/ui/Container";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { VideoReviewPlayer } from "@/components/mainpage2/ui/VideoReviewPlayer";
import { WatchCursor } from "@/components/mainpage2/ui/WatchCursor";
import { Button } from "@/components/mainpage2/ui/Button";

// Real client video-reviews — sourced from /about-us/video-reviews legacy page (vidzflow CDN)
const videoReviews = [
  {
    title: "Client testimonial — Los Angeles move",
    src: "https://r2.vidzflow.com/source/1d54ff12-48e2-4072-aa05-c726392edc56.mp4",
  },
  {
    title: "Client testimonial — with Vivi Castrillon",
    src: "https://r2.vidzflow.com/source/59f14463-fdbd-4bea-bc97-64c5db6dd6f5.mp4",
  },
  {
    title: "Client testimonial — SOS Moving",
    src: "https://r2.vidzflow.com/source/933d532c-499a-4c54-91f3-aa95c70fb88d.mp4",
  },
  {
    title: "Client testimonial — with Tawny Jordan",
    src: "https://r2.vidzflow.com/source/ecb91c5f-e300-4bed-80a4-25722e5d46d7.mp4",
  },
  {
    title: "Client testimonial — long-distance move",
    src: "https://r2.vidzflow.com/source/45c71a7f-50f5-4adf-8512-ace2d73a4de9.mp4",
  },
  {
    title: "Client testimonial — apartment relocation",
    src: "https://r2.vidzflow.com/source/5b5cbf96-db19-4732-8bba-7dceab2d83fc.mp4",
  },
  {
    title: "Client testimonial — packing & storage",
    src: "https://r2.vidzflow.com/source/6c523574-289a-4884-af47-36bde27848b8.mp4",
  },
  {
    title: "Client testimonial — commercial move",
    src: "https://r2.vidzflow.com/source/8a7e833b-a345-4120-9885-b88ecc29d9e2.mp4",
  },
  {
    title: "Client testimonial — same-day service",
    src: "https://r2.vidzflow.com/source/c484fd3d-da44-44bb-97e9-a032cf2d3813.mp4",
  },
  {
    title: "Client testimonial — interstate move",
    src: "https://r2.vidzflow.com/source/e521d544-6e8c-4872-8973-f76abf9753db.mp4",
  },
];

export function VideoReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Drag state — tracks pointer start + scroll offset + whether movement crossed
  // the "this is a drag, not a click" threshold (so card-click → play is suppressed).
  const dragRef = useRef<{
    startX: number;
    startScroll: number;
    moved: boolean;
    pointerId: number;
    captured: boolean;
  } | null>(null);
  // Point history for post-release inertia (velocity computed from last ~80ms)
  const historyRef = useRef<{ x: number; t: number }[]>([]);
  const inertiaRef = useRef<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -460 : 460,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    // Ignore touch — native inertial scroll handles those well.
    if (e.pointerType === "touch") return;
    // Cancel any running inertia so new drag starts from current position.
    if (inertiaRef.current !== null) {
      cancelAnimationFrame(inertiaRef.current);
      inertiaRef.current = null;
    }
    // Record state, but DON'T capture the pointer yet — capturing now would
    // redirect the click target and break the card's onClick (= video play)
    // for simple taps. We capture mid-move once a real drag starts.
    dragRef.current = {
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      pointerId: e.pointerId,
      captured: false,
    };
    historyRef.current = [{ x: e.clientX, t: performance.now() }];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragRef.current;
    const el = scrollRef.current;
    if (!s || !el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 5 && !s.moved) {
      // Crossed drag threshold — NOW take pointer capture and switch cursor.
      s.moved = true;
      s.captured = true;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* capture may fail on some edge cases — still ok, we just pan */
      }
      el.style.cursor = "grabbing";
    }
    if (s.moved) {
      el.scrollLeft = s.startScroll - dx;
      // Keep a rolling window of the last ~80ms for velocity math on release.
      const now = performance.now();
      const hist = historyRef.current;
      hist.push({ x: e.clientX, t: now });
      while (hist.length > 1 && now - hist[0].t > 80) hist.shift();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragRef.current;
    const el = scrollRef.current;
    if (!s || !el) return;
    if (s.captured) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer was already released */
      }
    }
    el.style.cursor = "";
    if (s.moved) {
      // Swallow the click that fires after a drag, so we don't auto-play the
      // card the user happened to release over.
      const onceClick = (ev: MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      el.addEventListener("click", onceClick, { capture: true, once: true });

      // Momentum: compute velocity (px/ms) from the last ~80ms, then decay.
      const hist = historyRef.current;
      if (hist.length >= 2) {
        const first = hist[0];
        const last = hist[hist.length - 1];
        const dt = last.t - first.t;
        if (dt > 0) {
          // Negative because scrollLeft moves opposite to pointer delta.
          let velocity = -((last.x - first.x) / dt) * 16; // px per ~frame (16ms)
          const step = () => {
            if (!scrollRef.current) return;
            if (Math.abs(velocity) < 0.4) {
              inertiaRef.current = null;
              return;
            }
            scrollRef.current.scrollLeft += velocity;
            velocity *= 0.93; // friction
            inertiaRef.current = requestAnimationFrame(step);
          };
          inertiaRef.current = requestAnimationFrame(step);
        }
      }
    }
    dragRef.current = null;
    historyRef.current = [];
  };

  return (
    <section id="video-reviews" ref={sectionRef} className="py-20 md:py-28 overflow-hidden">
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
            <Button href="/about-us/video-reviews">Watch All Video-Reviews</Button>
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

      {/* Horizontal scroller — with left/right edge fade + drag-to-pan */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex gap-4 overflow-x-auto select-none cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-8 pb-2"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 94%, transparent 100%)",
        }}
      >
        {videoReviews.map((v) => (
          <div
            key={v.src}
            className="flex-shrink-0 w-[70vw] xs:w-[60vw] sm:w-[320px] md:w-[340px] lg:w-[360px] rounded-2xl overflow-hidden bg-surface"
          >
            <div className="relative aspect-[3/4]">
              <VideoReviewPlayer src={v.src} title={v.title} />
            </div>
          </div>
        ))}
      </div>

      <WatchCursor
        cardSelector='[data-video-card="idle"]'
        containerRef={sectionRef}
      />
    </section>
  );
}
