"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "../ui/Eyebrow";
import { VideoPlaceholder } from "../ui/VideoPlaceholder";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  eyebrowNum?: string;
  eyebrowTotal?: string;
  eyebrowText?: string;
  title?: React.ReactNode;
  caption?: string;
  /** Optional video src — leave undefined to show the placeholder. */
  src?: string;
  /** Time chip text shown over the placeholder. */
  duration?: string;
};

/**
 * Full-bleed scroll-pinned video stage. The frame stays put while the page
 * scrolls; the video / placeholder scales slightly and the title fades in.
 * Mirrors Terminal Industries' header video block.
 */
export function PinnedVideo({
  eyebrowNum,
  eyebrowTotal,
  eyebrowText = "In motion",
  title,
  caption,
  src,
  duration = "00:00 / 00:30",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = ref.current?.querySelector<HTMLElement>(".m3-stage-inner");
      const frame = ref.current?.querySelector<HTMLElement>(".m3-stage-frame");
      const title = ref.current?.querySelector<HTMLElement>(".m3-stage-title");
      if (!stage || !frame) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          pin: stage,
          pinSpacing: true,
        },
      });
      tl.fromTo(
        frame,
        { scale: 0.85, borderRadius: 24 },
        { scale: 1, borderRadius: 4, ease: "none" },
        0,
      );
      if (title) {
        tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0);
      }
    },
    { scope: ref },
  );

  return (
    <section className="m3-stage" ref={ref}>
      <div className="m3-stage-inner">
        <div className="m3-stage-frame">
          <VideoPlaceholder
            aspect="auto"
            duration={duration}
            label={caption ?? "Hero reel · 4K · 30s"}
            src={src}
            className="m3-stage-video"
          />
          <div className="m3-stage-overlay">
            <div className="m3-stage-title">
              <Eyebrow num={eyebrowNum} total={eyebrowTotal}>
                {eyebrowText}
              </Eyebrow>
            </div>
            <div className="m3-stage-title">
              <h2
                className="m3-text-h2"
                style={{ maxWidth: "20ch", color: "#fff" }}
              >
                {title}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
