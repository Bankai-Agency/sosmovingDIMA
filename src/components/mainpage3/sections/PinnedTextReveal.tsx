"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "../ui/Eyebrow";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  eyebrowNum?: string;
  eyebrowTotal?: string;
  eyebrowText?: string;
  /** Plain text — words inside `[brackets]` render in accent yellow. */
  text: string;
};

/**
 * Pinned section. As the user scrolls, words light up one by one
 * (color: dim → text). Words wrapped in [...] flip to accent yellow.
 */
export function PinnedTextReveal({
  eyebrowNum,
  eyebrowTotal,
  eyebrowText = "Manifesto",
  text,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // tokenise text into words, flagging accent-marked ones
  const words = text.split(/\s+/).map((raw) => {
    const isAccent = raw.startsWith("[") && raw.endsWith("]");
    return { word: isAccent ? raw.slice(1, -1) : raw, isAccent };
  });

  useGSAP(
    () => {
      const wordEls = ref.current?.querySelectorAll<HTMLElement>(".m3-word");
      const inner = ref.current?.querySelector<HTMLElement>(".m3-pinned-text-inner");
      if (!wordEls || !inner) return;

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom bottom",
        pin: inner,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const total = wordEls.length;
          const upTo = Math.floor(p * total);
          wordEls.forEach((el, i) => {
            el.classList.toggle("is-on", i < upTo);
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <section className="m3-pinned-text" ref={ref}>
      <div className="m3-pinned-text-inner">
        <div className="m3-pinned-text-content">
          <div style={{ marginBottom: "2rem" }}>
            <Eyebrow num={eyebrowNum} total={eyebrowTotal}>
              {eyebrowText}
            </Eyebrow>
          </div>
          <p className="m3-pinned-words">
            {words.map(({ word, isAccent }, i) => (
              <span
                key={i}
                className={`m3-word${isAccent ? " is-accent" : ""}`}
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
