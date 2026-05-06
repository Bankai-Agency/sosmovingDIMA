"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { PaddedCounter } from "../ui/PaddedCounter";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = rootRef.current?.querySelectorAll<HTMLElement>(
        ".m3-hero-h1 .m3-hero-line",
      );
      const subtitle = rootRef.current?.querySelectorAll<HTMLElement>(
        ".m3-hero-sub, .m3-hero-cta, .m3-hero-eyebrow",
      );
      const stats = rootRef.current?.querySelectorAll<HTMLElement>(
        ".m3-hero-stat",
      );

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      if (lines) {
        tl.from(lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.08,
        });
      }
      if (subtitle) {
        tl.from(
          subtitle,
          { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.5",
        );
      }
      if (stats) {
        tl.from(
          stats,
          { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.4",
        );
      }
    },
    { scope: rootRef },
  );

  return (
    <section className="m3-hero" ref={rootRef}>
      <div className="m3-hero-bg" aria-hidden />
      <div className="m3-hero-grid" aria-hidden />

      <div className="m3-hero-inner">
        <div className="m3-hero-eyebrow">
          <Eyebrow withDot>Los Angeles · Since {data.company.founded}</Eyebrow>
        </div>

        <h1 className="m3-hero-h1">
          <span style={{ display: "block", overflow: "hidden" }}>
            <span className="m3-hero-line" style={{ display: "inline-block" }}>
              We have reinvented
            </span>
          </span>
          <span style={{ display: "block", overflow: "hidden" }}>
            <span className="m3-hero-line" style={{ display: "inline-block" }}>
              the way <span className="accent">Los Angeles</span>
            </span>
          </span>
          <span style={{ display: "block", overflow: "hidden" }}>
            <span className="m3-hero-line" style={{ display: "inline-block" }}>
              moves home.
            </span>
          </span>
        </h1>

        <p
          className="m3-hero-sub m3-body-lg"
          style={{ maxWidth: "44ch" }}
        >
          {data.hero.subtitle}. Licensed, insured, rated 4.9 across 2,500+
          reviews — flat hourly pricing, no hidden fees.
        </p>

        <div
          className="m3-hero-cta"
          style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
        >
          <Button href={data.hero.cta.href} variant="primary">
            {data.hero.cta.text}
          </Button>
          <Button href="#process" variant="ghost">
            Take a closer look
          </Button>
        </div>

        <div className="m3-hero-meta">
          <div className="m3-hero-stat">
            <span className="m3-hero-stat-label">Index</span>
            <span className="m3-hero-stat-num m3-mono">
              <PaddedCounter to={4} padTo={2} duration={1.4} delay={0.6} /> /{" "}
              <PaddedCounter to={9} padTo={2} duration={1.4} delay={0.7} />
            </span>
          </div>
          <div className="m3-hero-stat">
            <span className="m3-hero-stat-label">Moves completed</span>
            <span className="m3-hero-stat-num">
              <PaddedCounter to={10000} padTo={5} duration={2} delay={0.4} />
              <span style={{ color: "var(--m3-accent)" }}>+</span>
            </span>
          </div>
          <div className="m3-hero-stat">
            <span className="m3-hero-stat-label">Avg rating</span>
            <span className="m3-hero-stat-num">
              <PaddedCounter to={49} padTo={2} duration={1.6} delay={0.5} />
              <span style={{ opacity: 0.4 }}>/50</span>
            </span>
          </div>
          <div className="m3-hero-stat">
            <span className="m3-hero-stat-label">Cities served</span>
            <span className="m3-hero-stat-num">
              <PaddedCounter to={20} padTo={2} duration={1.4} delay={0.6} />
              <span style={{ color: "var(--m3-accent)" }}>+</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
