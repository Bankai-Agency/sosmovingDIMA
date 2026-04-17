/**
 * SVG dot-grid background pattern (Terminal Industries style).
 * Dots at grid intersections with subtle accent-colored highlights.
 */
export function DotGrid({
  className = "",
  dotColor = "rgba(255,255,255,0.12)",
  accentColor = "rgba(255,229,51,0.35)",
  lineColor = "rgba(255,255,255,0.04)",
  spacing = 80,
}: {
  className?: string;
  dotColor?: string;
  accentColor?: string;
  lineColor?: string;
  spacing?: number;
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${spacing}`} width={spacing} height={spacing} patternUnits="userSpaceOnUse">
            {/* Grid lines */}
            <line x1={spacing} y1="0" x2={spacing} y2={spacing} stroke={lineColor} strokeWidth="1" />
            <line x1="0" y1={spacing} x2={spacing} y2={spacing} stroke={lineColor} strokeWidth="1" />
            {/* Regular dot at intersection */}
            <circle cx={spacing} cy={spacing} r="1.5" fill={dotColor} />
          </pattern>
          {/* Accent dots — larger, spaced wider */}
          <pattern id={`grid-accent-${spacing}`} width={spacing * 3} height={spacing * 3} patternUnits="userSpaceOnUse">
            <circle cx={spacing * 3} cy={spacing * 3} r="2.5" fill={accentColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${spacing})`} />
        <rect width="100%" height="100%" fill={`url(#grid-accent-${spacing})`} />
      </svg>
    </div>
  );
}
