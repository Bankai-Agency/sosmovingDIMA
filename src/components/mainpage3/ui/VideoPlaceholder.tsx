"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Aspect ratio, eg "16/9" | "21/9" | "4/5" */
  aspect?: string;
  /** Optional caption shown over the placeholder. */
  label?: string;
  /** Optional duration shown in the bottom-right time chip ("00:00 / 00:30"). */
  duration?: string;
  /** Tailwind/css className passthrough for the wrapper. */
  className?: string;
  /** When true, fakes a "playhead" running across the bottom (pure UI hint). */
  playhead?: boolean;
  /** When provided, renders an actual video element with this src. */
  src?: string;
};

/**
 * Standin for an upcoming video asset. Looks intentional in dark UI:
 *  - 1px hairline frame
 *  - dotted-grid background (mimics film grain)
 *  - corner registration marks (Terminal-style)
 *  - mono caption + duration chip
 *  - centered play glyph
 *
 * When `src` is provided it renders the actual <video> instead.
 */
export function VideoPlaceholder({
  aspect = "16/9",
  label = "Video placeholder",
  duration = "00:00 / 00:30",
  className = "",
  playhead = true,
  src,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    if (!playhead) return;
    let frame = 0;
    let id: number;
    const tick = () => {
      frame = (frame + 1) % 1800; // ~30s @ 60fps
      const s = Math.floor(frame / 60);
      setTime(`00:${String(s).padStart(2, "0")}`);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playhead]);

  return (
    <div
      ref={ref}
      className={`m3-video-placeholder ${className}`.trim()}
      style={{ aspectRatio: aspect }}
    >
      {src ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <>
          <div className="m3-video-placeholder-grid" aria-hidden />
          <div className="m3-video-placeholder-corners" aria-hidden>
            <span /><span /><span /><span />
          </div>
          <div className="m3-video-placeholder-center" aria-hidden>
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="28"
                cy="28"
                r="27"
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <path d="M22 18 L40 28 L22 38 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="m3-video-placeholder-meta">
            <span>{label}</span>
            <span className="m3-mono">
              {playhead ? `${time} / 00:30` : duration}
            </span>
          </div>
          {playhead && (
            <div className="m3-video-placeholder-bar" aria-hidden>
              <div className="m3-video-placeholder-bar-fill" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
