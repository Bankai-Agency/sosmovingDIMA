"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Lenis + GSAP/ScrollTrigger bridge.
 *
 * Required when Lenis (smooth-scroll) is mounted higher in the tree alongside
 * ScrollTrigger-driven pinned sections. Without this sync, Lenis transforms
 * the scroll position on its own raf while ScrollTrigger keeps reading
 * `window.scrollY` from native scroll events → trigger positions drift,
 * pinned sections start overlapping, scrub feels janky.
 *
 * The bridge:
 *   1. Replaces the existing Lenis instance (mainpage2/SmoothScroll.tsx) with
 *      a fresh one that we drive ourselves.
 *   2. Routes every Lenis scroll event into `ScrollTrigger.update()`.
 *   3. Drives Lenis from `gsap.ticker` so both share one frame loop.
 *   4. Calls `ScrollTrigger.refresh()` after mount so trigger positions are
 *      measured against the post-Lenis layout.
 */
export function LenisGsapBridge() {
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

    // Refresh once after layout settles so Lenis-shifted positions are picked up.
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
