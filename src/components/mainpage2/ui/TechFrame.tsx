"use client";

/**
 * Decorative tech-frame overlay with rounded rectangle paths
 * and glowing dots that travel along them (Terminal Industries style).
 * Place inside a section with `position: relative; overflow: hidden`.
 */
export function TechFrame({
  className = "",
  dotColor = "var(--color-accent)",
  lineColor = "rgba(255,255,255,0.06)",
  dotCount = 2,
  duration = 12,
}: {
  className?: string;
  dotColor?: string;
  lineColor?: string;
  dotCount?: number;
  duration?: number;
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Outer rounded rectangle path */}
          <path
            id="frame-outer"
            d="M 40,40
               L 1400,40
               Q 1420,40 1420,60
               L 1420,840
               Q 1420,860 1400,860
               L 40,860
               Q 20,860 20,840
               L 20,60
               Q 20,40 40,40 Z"
          />
          {/* Inner rounded rectangle path (offset) */}
          <path
            id="frame-inner"
            d="M 100,120
               L 900,120
               Q 920,120 920,140
               L 920,780
               Q 920,800 900,800
               L 100,800
               Q 80,800 80,780
               L 80,140
               Q 80,120 100,120 Z"
          />
          {/* Vertical connector */}
          <path
            id="frame-vert"
            d="M 720,40 L 720,120"
          />
          {/* Horizontal connector */}
          <path
            id="frame-horiz"
            d="M 920,450 L 1420,450"
          />
        </defs>

        {/* Render frame lines */}
        <use href="#frame-outer" stroke={lineColor} strokeWidth="1" fill="none" />
        <use href="#frame-inner" stroke={lineColor} strokeWidth="1" fill="none" />
        <use href="#frame-vert" stroke={lineColor} strokeWidth="1" fill="none" />
        <use href="#frame-horiz" stroke={lineColor} strokeWidth="1" fill="none" />

        {/* Animated dots on outer frame */}
        {Array.from({ length: dotCount }).map((_, i) => (
          <circle key={`outer-${i}`} r="3" fill={dotColor} opacity="0.8">
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${(i * duration) / dotCount}s`}
            >
              <mpath href="#frame-outer" />
            </animateMotion>
          </circle>
        ))}

        {/* Animated dot on inner frame */}
        <circle r="2.5" fill={dotColor} opacity="0.6">
          <animateMotion dur={`${duration * 0.8}s`} repeatCount="indefinite" begin="2s">
            <mpath href="#frame-inner" />
          </animateMotion>
        </circle>

        {/* Dot on vertical connector */}
        <circle r="2" fill={dotColor} opacity="0.5">
          <animateMotion dur="3s" repeatCount="indefinite" begin="0s">
            <mpath href="#frame-vert" />
          </animateMotion>
        </circle>

        {/* Dot on horizontal connector */}
        <circle r="2" fill={dotColor} opacity="0.5">
          <animateMotion dur="4s" repeatCount="indefinite" begin="1s">
            <mpath href="#frame-horiz" />
          </animateMotion>
        </circle>

        {/* Glow filter for dots */}
        <defs>
          <filter id="dot-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
