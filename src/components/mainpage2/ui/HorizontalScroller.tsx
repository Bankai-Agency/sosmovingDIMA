"use client";

import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Tailwind classes applied to the scroller track. */
  trackClassName?: string;
  /** Style applied to the scroller track (mask image, etc.). */
  trackStyle?: React.CSSProperties;
  /** How far scrollBy moves per prev/next click. */
  step?: number;
  /** Aria label prefix for the prev/next buttons. */
  label?: string;
  /** Absolute positioning target for prev/next. Default: above-right, beside heading. */
  controlsClassName?: string;
};

/**
 * Horizontal scroller with floating prev/next buttons. Server-friendly: owns only
 * the interactive scrolling; children are rendered as-is so the parent can be a
 * server component and fetch data.
 */
export function HorizontalScroller({
  children,
  trackClassName = "",
  trackStyle,
  step = 520,
  label = "Slide",
  controlsClassName = "hidden md:flex absolute right-4 sm:right-6 lg:right-8 -top-16 gap-2",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const go = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Floating controls */}
      <div className={controlsClassName}>
        <button
          type="button"
          onClick={() => go("left")}
          aria-label={`${label} previous`}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go("right")}
          aria-label={`${label} next`}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      <div ref={ref} className={trackClassName} style={trackStyle}>
        {children}
      </div>
    </div>
  );
}
