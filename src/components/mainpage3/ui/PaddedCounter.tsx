"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  /** Final integer value to count to. */
  to: number;
  /** Pad final number with leading zeros to N digits (e.g. 5 → "00128"). */
  padTo?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Suffix appended after the number (e.g. "+", "%"). */
  suffix?: string;
  /** Delay before counting starts. */
  delay?: number;
};

/**
 * Terminal-style padded digit counter — each digit slides through 0-9
 * vertically (`translateY` ratchet) until it lands on the target digit.
 * Reusable for hero stats, large display numbers, etc.
 */
export function PaddedCounter({
  to,
  padTo,
  duration = 1.6,
  suffix = "",
  delay = 0,
}: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const target = String(to).padStart(padTo ?? 0, "0");

  useGSAP(
    () => {
      const tracks = rootRef.current?.querySelectorAll<HTMLElement>(
        ".m3-padded-counter-track",
      );
      if (!tracks) return;
      tracks.forEach((track, i) => {
        const targetDigit = Number(target[i]);
        // start at 0, animate to -targetDigit em (each step is 1em high)
        gsap.fromTo(
          track,
          { y: 0 },
          {
            y: `-${targetDigit}em`,
            duration,
            delay: delay + i * 0.06,
            ease: "expo.out",
          },
        );
      });
    },
    { scope: rootRef, dependencies: [target, duration, delay] },
  );

  return (
    <span ref={rootRef} className="m3-padded-counter-wrap">
      {target.split("").map((_, i) => (
        <span key={i} className="m3-padded-counter">
          <span className="m3-padded-counter-track">
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
