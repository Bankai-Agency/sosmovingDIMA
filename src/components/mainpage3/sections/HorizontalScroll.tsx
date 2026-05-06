"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "../ui/Eyebrow";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { title: "Pickup",   meta: "Crew arrives, walks the home, builds a load plan.",     image: "/mainpage2/images/Helpers-and-Truck.webp" },
  { title: "Wrap",     meta: "Free blankets, shrink, tape — every piece protected.",  image: "/mainpage2/images/Packers-and-movers.avif" },
  { title: "Load",     meta: "Heaviest first, fragile last, weight balanced rear-axle.", image: "/mainpage2/images/SOS-Movers-Loading.webp" },
  { title: "Transit",  meta: "GPS-tracked truck, live ETA, padded cargo deck.",       image: "/mainpage2/images/Long-Distance-Movers-Los-Angeles.avif" },
  { title: "Unload",   meta: "Reverse choreography, room-by-room placement.",         image: "/mainpage2/images/Burbank-Movers-1.jpg" },
  { title: "Setup",    meta: "Reassembly, TV remount, walk-through, sign-off.",       image: "/mainpage2/images/movers_sos.webp" },
];

/**
 * "Six steps, zero surprises" — vertical scroll → horizontal pan.
 * Pinned section + ScrollTrigger scrub on `gsap.to(track, x: -distance)`.
 * Re-enabled now that Lenis ↔ ScrollTrigger bridge keeps everything synced.
 */
export function HorizontalScroll() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const track = root.querySelector<HTMLElement>(".m3-hscroll-track");
      const pin = root.querySelector<HTMLElement>(".m3-hscroll-pin");
      if (!track || !pin) return;

      const distance = () => track.scrollWidth - window.innerWidth + 96;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.5,
          pin,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref },
  );

  return (
    <section className="m3-hscroll" ref={ref}>
      <div className="m3-hscroll-pin">
        <div className="m3-hscroll-track">
          {/* Intro card with eyebrow + heading + body */}
          <div
            style={{
              flex: "0 0 auto",
              width: "clamp(260px, 32vw, 480px)",
              padding: "0 1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1.25rem",
            }}
          >
            <Eyebrow num="03" total="06">Process</Eyebrow>
            <h2 className="m3-text-h2" style={{ maxWidth: "18ch" }}>
              Six steps,
              <br />
              <span style={{ color: "var(--m3-accent)" }}>zero surprises.</span>
            </h2>
            <p className="m3-text-body" style={{ color: "var(--m3-text-muted)" }}>
              Scroll down — every step in the move, on tape.
            </p>
          </div>

          {CARDS.map((card, i) => (
            <div className="m3-hscroll-card" key={card.title}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt=""
                loading="lazy"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.15) 100%)",
                  zIndex: 1,
                }}
              />
              <span className="m3-hscroll-num" style={{ zIndex: 2 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="m3-hscroll-title">{card.title}</h3>
              <p className="m3-hscroll-meta">{card.meta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
