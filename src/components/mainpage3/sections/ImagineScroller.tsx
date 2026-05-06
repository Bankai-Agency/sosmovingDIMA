"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable Aceternity-style sticky scroll with Terminal-style word-by-word
 * color fill. Renders an intro <h2> above a 2-column block: a stacked list
 * of items on the left (per-word color reveal driven by scroll progress) and
 * a sticky media panel on the right that swaps when the active item changes.
 *
 * Wrap key words in [brackets] inside the title to mark them as accent.
 */

export type ImagineItem = {
  /** Sentence — wrap accent words in [brackets]. */
  title: string;
  image: string;
};

type Props = {
  /** Optional anchor id for nav. */
  id?: string;
  /** Intro headline above the pinned column. JSX so caller can use <strong>. */
  intro: React.ReactNode;
  items: ImagineItem[];
};

function tokenize(text: string) {
  const tokens: { word: string; isStrong: boolean }[] = [];
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

export function ImagineScroller({ id, intro, items }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Use ref for active so scroll-driven updates don't fire React re-renders
  // (which would tear down + rebuild ScrollTrigger via useGSAP).
  const activeRef = useRef<number>(0);
  const [, setRender] = useState(0);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const itemEls = Array.from(
        root.querySelectorAll<HTMLElement>(".m3-fs-item"),
      );
      const slideEls = Array.from(
        root.querySelectorAll<HTMLElement>(".m3-fs-slide"),
      );
      if (!itemEls.length) return;

      const setActive = (idx: number) => {
        if (activeRef.current === idx) return;
        activeRef.current = idx;
        itemEls.forEach((el, i) => el.classList.toggle("is-active", i === idx));
        slideEls.forEach((el, i) => el.classList.toggle("is-active", i === idx));
        setRender((n) => n + 1);
      };

      const triggers = itemEls.map((item, idx) =>
        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const words = item.querySelectorAll<HTMLElement>(
              ".m3-fs-title .m3-w",
            );
            const litCount = Math.floor(self.progress * words.length);
            words.forEach((el, i) => {
              el.classList.toggle("is-on", i < litCount);
              el.classList.toggle(
                "is-now",
                i === litCount && self.progress < 0.99,
              );
            });
            if (self.progress > 0) setActive(idx);
          },
        }),
      );

      // doc layout shifts after upstream pinned sections settle — refresh once.
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
          <h2>{intro}</h2>
        </div>
      </header>

      <section className="m3-fs" ref={ref} id={id}>
        <div className="m3-fs-grid">
          <div className="m3-fs-list">
            {items.map((s, i) => {
              const words = tokenize(s.title);
              const isActive = activeRef.current === i;
              return (
                <div
                  key={i}
                  className={`m3-fs-item${isActive ? " is-active" : ""}`}
                >
                  <span className="m3-fs-item-num">
                    <span className="num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span> / {String(items.length).padStart(2, "0")}</span>
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
              {items.map((s, i) => (
                <div
                  key={s.image + i}
                  className={`m3-fs-slide${activeRef.current === i ? " is-active" : ""}`}
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
