"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Mounted once near the bottom of the page tree. Forces a global
 * ScrollTrigger.refresh() after every section's GSAP useEffect has run +
 * after window load + once more on font-loaded — guarantees that pinned
 * sections (FrameSequenceHero / ZoomVideo / ServicesSticky / ImagineMove /
 * PinnedTextReveal / HorizontalScroll) all measure against the final layout
 * and stop overlapping each other.
 */
export function ScrollTriggerSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    let raf1: number;
    let raf2: number;
    const onLoad = () => ScrollTrigger.refresh();

    // 2 frames after mount so every other useEffect has registered its triggers.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    // After all assets (images / videos) finish loading layout often shifts
    // a final time — refresh again.
    if (document.readyState === "complete") {
      ScrollTrigger.refresh();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    // Fonts arriving after Switzer/Geist load can change line-heights and
    // shift section heights, so resync once fonts settle too.
    if ("fonts" in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
