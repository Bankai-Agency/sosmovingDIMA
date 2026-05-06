"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/mainpage2/homepage.json";

/**
 * Osmo Supply "Sticky Features" — 1:1 port to React.
 *
 * Source: https://osmo.supply/  (Sticky Features)
 * Adapted to mainpage3: dark palette + accent yellow, fed from
 * homepage.json.services. Class names + data-* attributes preserved
 * exactly so Osmo's published GSAP/ScrollTrigger logic works unmodified.
 */
export function ServicesSticky() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const root = wrapRef.current;
    if (!root) return;

    const wraps = Array.from(
      root.querySelectorAll<HTMLElement>("[data-sticky-feature-wrap]"),
    );
    if (!wraps.length) return;

    const triggers: ScrollTrigger[] = [];

    wraps.forEach((w) => {
      const visualWraps = Array.from(
        w.querySelectorAll<HTMLElement>("[data-sticky-feature-visual-wrap]"),
      );
      const items = Array.from(
        w.querySelectorAll<HTMLElement>("[data-sticky-feature-item]"),
      );
      const progressBar = w.querySelector<HTMLElement>(
        "[data-sticky-feature-progress]",
      );

      const count = Math.min(visualWraps.length, items.length);
      if (count < 1) return;

      const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const DURATION = rm ? 0.01 : 0.75;
      const EASE = "power4.inOut";
      const SCROLL_AMOUNT = 0.9;

      const getTexts = (el: HTMLElement) =>
        Array.from(el.querySelectorAll<HTMLElement>("[data-sticky-feature-text]"));

      if (visualWraps[0])
        gsap.set(visualWraps[0], { clipPath: "inset(0% round 0.75em)" });
      gsap.set(items[0], { autoAlpha: 1 });

      let currentIndex = 0;

      function transition(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex) return;
        const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

        if (fromIndex < toIndex) {
          tl.to(
            visualWraps[toIndex],
            {
              clipPath: "inset(0% round 0.75em)",
              duration: DURATION,
              ease: EASE,
            },
            0,
          );
        } else {
          tl.to(
            visualWraps[fromIndex],
            {
              clipPath: "inset(50% round 0.75em)",
              duration: DURATION,
              ease: EASE,
            },
            0,
          );
        }
        animateOut(items[fromIndex]);
        animateIn(items[toIndex]);
      }

      function animateOut(itemEl: HTMLElement) {
        const texts = getTexts(itemEl);
        gsap.to(texts, {
          autoAlpha: 0,
          y: -30,
          ease: "power4.out",
          duration: 0.4,
          onComplete: () => gsap.set(itemEl, { autoAlpha: 0 }),
        });
      }

      function animateIn(itemEl: HTMLElement) {
        const texts = getTexts(itemEl);
        gsap.set(itemEl, { autoAlpha: 1 });
        gsap.fromTo(
          texts,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power4.out",
            duration: DURATION,
            stagger: 0.1,
          },
        );
      }

      const steps = Math.max(1, count - 1);

      const trigger = ScrollTrigger.create({
        trigger: w,
        start: "center center",
        end: () => `+=${steps * 100}%`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = Math.min(self.progress, SCROLL_AMOUNT) / SCROLL_AMOUNT;
          let idx = Math.floor(p * steps + 1e-6);
          idx = Math.max(0, Math.min(steps, idx));

          if (progressBar) {
            gsap.to(progressBar, { scaleX: p, ease: "none" });
          }

          if (idx !== currentIndex) {
            transition(currentIndex, idx);
            currentIndex = idx;
          }
        },
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div ref={wrapRef}>
      <div data-sticky-feature-wrap="" className="sticky-features__wrap">
        <div className="sticky-features__scroll">
          <div className="sticky-features__container">
            <div className="sticky-feaures__col is--img">
              <div className="sticky-features__img-collection">
                <div className="sticky-features__img-list">
                  {data.services.map((s) => (
                    <div
                      key={s.slug}
                      data-sticky-feature-visual-wrap=""
                      className="sticky-features__img-item"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt={s.title}
                        className="sticky-features__img"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="sticky-features__progress-w">
                <div
                  className="sticky-features__progress-bar"
                  data-sticky-feature-progress
                />
              </div>
            </div>
            <div className="sticky-feaures__col">
              <div className="sticky-features__text-collection">
                <div className="sticky-features__text-list">
                  {data.services.map((s, i) => (
                    <div
                      key={s.slug}
                      data-sticky-feature-item=""
                      className="sticky-features__text-item"
                    >
                      <span
                        data-sticky-feature-text=""
                        className="sticky-features__tag"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2
                        data-sticky-feature-text=""
                        className="sticky-features__heading"
                      >
                        {s.title}
                      </h2>
                      <p
                        data-sticky-feature-text=""
                        className="sticky-features__p"
                      >
                        {s.description}
                      </p>
                      <a
                        href={`/services/${s.slug}`}
                        data-sticky-feature-text=""
                        className="sticky-features__p is--link"
                      >
                        Learn more
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
