"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/Button";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const FLIP_WORDS = ["move", "roll", "go", "pack"];

/**
 * Ported from /mainpage2 BottomCta — large rounded card with parallax image
 * background, big "Let's [move]" headline with rotating word, subtitle, CTA.
 * Reimplemented on GSAP (replaces framer-motion useScroll/useTransform).
 */
export function CtaBlock() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = ref.current;
    if (!root) return;
    const img = root.querySelector<HTMLElement>(".m3-cta-img");
    const word = root.querySelector<HTMLElement>(".m3-cta-flip");
    const triggers: ScrollTrigger[] = [];

    // Parallax: image moves -12% → 12% across the section's scroll range.
    if (img) {
      const tween = gsap.fromTo(
        img,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.4,
          },
        },
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    // Word rotator — swap text every 3s with a y-translate fade.
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    if (word) {
      interval = setInterval(() => {
        i = (i + 1) % FLIP_WORDS.length;
        gsap.to(word, {
          yPercent: -100,
          opacity: 0,
          duration: 0.3,
          ease: "expo.in",
          onComplete: () => {
            word.textContent = FLIP_WORDS[i];
            gsap.fromTo(
              word,
              { yPercent: 100, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.4, ease: "expo.out" },
            );
          },
        });
      }, 3000);
    }

    return () => {
      triggers.forEach((t) => t.kill());
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <section
      style={{
        padding: "clamp(2rem, 4vw, 4rem) clamp(1rem, 2vw, 2.5rem)",
      }}
      id="bottom-cta"
    >
      <div
        ref={ref}
        style={{
          position: "relative",
          margin: "0 auto",
          width: "100%",
          maxWidth: "90rem",
          overflow: "hidden",
          borderRadius: "clamp(1rem, 2vw, 1.5rem)",
          height: "92svh",
          minHeight: "640px",
          maxHeight: "1100px",
          isolation: "isolate",
        }}
      >
        {/* Parallax image */}
        <div
          className="m3-cta-img"
          style={{
            position: "absolute",
            inset: "-15% 0",
            willChange: "transform",
            zIndex: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mainpage2/images/Helpers-and-Truck.webp"
            alt="SOS Moving team loading a truck"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.25), rgba(0,0,0,0.65))",
            zIndex: 1,
          }}
          aria-hidden
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "1.5rem 2.5rem",
            gap: "1.5rem",
          }}
        >
          <h2
            className="m3-text-display"
            style={{
              color: "#fff",
              display: "inline-flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: "0.4em",
              whiteSpace: "nowrap",
            }}
            aria-label="Let's move — ready when you are"
          >
            <span>Let&rsquo;s</span>
            <span
              style={{
                display: "inline-block",
                background: "var(--m3-accent)",
                color: "var(--m3-accent-text)",
                padding: "0 0.35em",
                borderRadius: "0.18em",
                overflow: "hidden",
                lineHeight: 0.9,
              }}
            >
              <span
                className="m3-cta-flip"
                style={{ display: "inline-block", willChange: "transform" }}
              >
                {FLIP_WORDS[0]}
              </span>
            </span>
          </h2>

          <p className="m3-text-lead" style={{ color: "rgba(255,255,255,0.9)", maxWidth: "36rem" }}>
            From $119/hour with free protective materials. Get your personalized
            quote in under 5 minutes.
          </p>

          <div>
            <Button href="/free-estimate" variant="primary">
              Get your free quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
