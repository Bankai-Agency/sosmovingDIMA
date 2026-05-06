"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { VideoPlaceholder } from "../ui/VideoPlaceholder";
import { Eyebrow } from "../ui/Eyebrow";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  caption?: string;
  src?: string;
};

/** A 70vh parallax band — placeholder video drifts at half scroll speed. */
export function ParallaxBand({ caption = "Crew · Truck · Day in the field", src }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = ref.current?.querySelector<HTMLElement>(".m3-band-media");
      if (!media) return;
      gsap.fromTo(
        media,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section className="m3-band" ref={ref}>
      <div className="m3-band-media">
        <VideoPlaceholder aspect="auto" label={caption} src={src} />
      </div>
      <div className="m3-band-overlay">
        <div
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            border: "1px solid var(--m3-border-strong)",
            padding: "1rem 1.25rem",
            borderRadius: 6,
            maxWidth: 360,
          }}
        >
          <Eyebrow withDot>Behind the move</Eyebrow>
          <p
            className="m3-mono"
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--m3-text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            Real footage drops here once the crew video edits land.
          </p>
        </div>
      </div>
    </section>
  );
}
