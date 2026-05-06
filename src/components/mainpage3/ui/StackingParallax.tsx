"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Wrapper that runs Osmo Supply's "Stacking Cards Parallax" logic on its
 * direct children (each marked with [data-stacking-cards-item]).
 *
 * As the viewer scrolls into the next card, the previous one parallaxes
 * down (yPercent: 50) and any [data-stacking-cards-img] inside it tilts +
 * shifts up — giving the effect of the new card "stacking" over the old.
 *
 * Use to bridge two adjacent sections (Gallery → LatestBlogs in our case)
 * with a cinematic parallax overlap.
 */
export function StackingParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const root = ref.current;
    if (!root) return;

    const cards = root.querySelectorAll<HTMLElement>("[data-stacking-cards-item]");
    if (cards.length < 2) return;

    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, i) => {
      if (i === 0) return;
      const previousCard = cards[i - 1];
      if (!previousCard) return;
      const previousCardImage = previousCard.querySelector<HTMLElement>(
        "[data-stacking-cards-img]",
      );

      const tl = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(previousCard, { yPercent: 0 }, { yPercent: 50 });
      if (previousCardImage) {
        tl.fromTo(
          previousCardImage,
          { rotate: 0, yPercent: 0 },
          { rotate: -3, yPercent: -15 },
          "<",
        );
      }
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return <div ref={ref}>{children}</div>;
}
