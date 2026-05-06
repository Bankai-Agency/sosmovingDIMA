"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "./Footer";

/**
 * Osmo Supply "Footer Parallax Effect" — 1:1 port to React.
 * Wraps our existing <Footer /> in the [data-footer-parallax] container;
 * footer slides up with yPercent: -25 while a dark layer fades in over it
 * as the wrapper enters the viewport.
 */
export function FooterParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];

    document
      .querySelectorAll<HTMLElement>("[data-footer-parallax]")
      .forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "clamp(top bottom)",
            end: "clamp(top top)",
            scrub: true,
          },
        });

        const inner = el.querySelector<HTMLElement>(
          "[data-footer-parallax-inner]",
        );
        const dark = el.querySelector<HTMLElement>("[data-footer-parallax-dark]");

        if (inner) tl.from(inner, { yPercent: -25, ease: "linear" });
        if (dark) tl.from(dark, { opacity: 0.5, ease: "linear" }, "<");

        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div data-footer-parallax="" className="footer-wrap" ref={ref}>
      <div data-footer-parallax-inner="">
        <Footer />
      </div>
      <div data-footer-parallax-dark="" className="footer-wrap__dark"></div>
    </div>
  );
}
