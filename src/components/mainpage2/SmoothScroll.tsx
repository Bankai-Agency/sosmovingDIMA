"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth-scroll for the (new-design) route group.
 *
 * The Lenis raf is driven by `gsap.ticker` and every Lenis scroll event
 * pumps `ScrollTrigger.update` so any pinned/scrubbed ScrollTrigger
 * sections (used heavily on /mainpage3) measure against the same scroll
 * position Lenis is rendering. Without this bridge pinned sections drift
 * and visually overlap.
 *
 * /mainpage2 has no ScrollTrigger usage — the bridge is a no-op for it.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // After mount, give pinned sections one frame to settle then refresh.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, []);

  return null;
}
