"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Aceternity-style sticky-scroll, dressed in Terminal aesthetic.
 *  - LEFT  : normal scroll flow — list of items (numbered title + description),
 *            each item ~80vh tall. Active item = the one closest to viewport
 *            center. Active title gets per-word color reveal driven by scroll
 *            progress within that item (dim → text → accent for [strong] words).
 *  - RIGHT : sticky media panel (image/video placeholder), cross-fades on
 *            active change.
 *  - Replace each `image` with a `video` later — same component, just swap the
 *    <img> tag for <video src=… autoplay muted loop>.
 */

type Step = {
  /** Sentence title — wrap key words in [brackets] to mark them strong/accent. */
  title: string;
  image: string;
};

const STEPS: Step[] = [
  { title: "Request a [quote] in under two minutes",        image: "/mainpage2/images/Helpers-and-Truck.webp" },
  { title: "Walkthrough with a [dedicated coordinator]",    image: "/mainpage2/images/Team_New.webp" },
  { title: "A custom plan, [sized to your move]",           image: "/mainpage2/images/Movers-Los-Angeles.avif" },
  { title: "Free [packing & prep] on every move",           image: "/mainpage2/images/SOS-Movers-Loading.webp" },
  { title: "Background-checked crews, [on time]",           image: "/mainpage2/images/movers_sos.webp" },
  { title: "Unloaded room-by-room, [exactly in place]",     image: "/mainpage2/images/Burbank-Movers-1.jpg" },
  { title: "Fully [insured], start to finish",              image: "/mainpage2/images/Long-Distance-Movers-Los-Angeles.avif" },
];

/**
 * Tokenise a sentence, splitting it into words and marking those inside
 * `[brackets]` as strong/accent. Handles trailing punctuation (e.g.
 * `[insured],` → strong word `insured` + punctuation `,` glued to next token).
 */
function tokenize(text: string) {
  const tokens: { word: string; isStrong: boolean }[] = [];
  // Split by bracket-regions: each part is either a [bracketed] chunk or plain.
  text.split(/(\[[^\]]+\])/).forEach((part) => {
    if (!part) return;
    const isStrong = part.startsWith("[") && part.endsWith("]");
    const cleaned = isStrong ? part.slice(1, -1) : part;
    cleaned
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => tokens.push({ word, isStrong }));
  });
  return tokens;
}

export function ImagineMove() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(".m3-fs-item"));
      if (!items.length) return;

      const triggers = items.map((item, idx) =>
        ScrollTrigger.create({
          trigger: item,
          // Tight 45vh window — title finishes lighting before next item triggers.
          start: "top 85%",
          end: "top 40%",
          scrub: 0.4,
          onUpdate: (self) => {
            const words = item.querySelectorAll<HTMLElement>(".m3-fs-title .m3-w");
            const litCount = Math.floor(self.progress * words.length);
            words.forEach((el, i) => {
              el.classList.toggle("is-on", i < litCount);
              el.classList.toggle("is-now", i === litCount && self.progress < 0.99);
            });
            // Mark this item active any time scroll is anywhere within its range
            // (and stay active after fill completes — until the next item triggers).
            if (self.progress > 0) setActive(idx);
          },
        }),
      );

      // Pinned siblings above us (PinnedVideo / PinnedTextReveal) shift the
      // doc height after their pins commit. Refresh once layout settles so our
      // triggers are measured against the final positions.
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(raf);
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: ref },
  );

  return (
    <>
      <header className="m3-imagine-intro">
        <div className="m3-imagine-intro-inner">
          <h2>
            Imagine the move as <strong>one seamless system</strong>{" "}
            from your old door to your new one.
          </h2>
        </div>
      </header>

      <section className="m3-fs" ref={ref} id="process">
        <div className="m3-fs-grid">
          <div className="m3-fs-list">
            {STEPS.map((s, i) => {
              const words = tokenize(s.title);
              return (
                <div
                  key={i}
                  className={`m3-fs-item${i === active ? " is-active" : ""}`}
                >
                  <span className="m3-fs-item-num">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span> / {String(STEPS.length).padStart(2, "0")}</span>
                  </span>
                  <h3 className="m3-fs-title">
                    {words.map((w, j) => (
                      <span
                        key={j}
                        className={`m3-w${w.isStrong ? " is-strong" : ""}`}
                      >
                        {w.word}
                      </span>
                    ))}
                  </h3>
                </div>
              );
            })}
          </div>

          <div className="m3-fs-stage-wrap">
            <div className="m3-fs-stage">
              {STEPS.map((s, i) => (
                <div
                  key={s.image}
                  className={`m3-fs-slide${i === active ? " is-active" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt=""
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
