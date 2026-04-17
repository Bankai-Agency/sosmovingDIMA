"use client";

import { motion } from "framer-motion";

/**
 * Interactive West Coast map with service region markers.
 * Coordinates are percentages within the SVG viewBox.
 */

interface Region {
  id: string;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
}

const regions: Region[] = [
  { id: "Los Angeles County", label: "Los Angeles", shortLabel: "LA", x: 38, y: 72 },
  { id: "San Fernando Valley", label: "SFV", shortLabel: "SFV", x: 33, y: 66 },
  { id: "Orange County", label: "Orange Co.", shortLabel: "OC", x: 43, y: 78 },
  { id: "Inland Empire", label: "Inland Empire", shortLabel: "IE", x: 52, y: 70 },
  { id: "Oregon", label: "Portland", shortLabel: "PDX", x: 30, y: 18 },
  { id: "Washington & Colorado", label: "Seattle / Denver", shortLabel: "SEA/DEN", x: 32, y: 6 },
];

/* Connections between nearby regions */
const connections: [number, number][] = [
  [0, 1], // LA — SFV
  [0, 2], // LA — OC
  [0, 3], // LA — IE
  [1, 3], // SFV — IE
  [4, 5], // Portland — Seattle
  [0, 4], // LA — Portland (long distance)
];

export function RegionMap({
  activeRegion,
  onRegionClick,
  className = "",
}: {
  activeRegion: string;
  onRegionClick: (region: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative w-full aspect-square ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified West Coast coastline */}
        <path
          d="M28 2 C26 8, 24 14, 26 20 C28 26, 25 32, 24 38 C23 44, 26 50, 28 56 C30 60, 32 64, 30 68 C28 72, 32 76, 35 80 C38 84, 42 86, 45 88 C48 90, 52 88, 55 85"
          fill="none"
          stroke="rgba(255,229,51,0.08)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Subtle grid */}
        {[20, 40, 60, 80].map((v) => (
          <g key={v}>
            <line
              x1="10" y1={v} x2="90" y2={v}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.3"
            />
            <line
              x1={v} y1="0" x2={v} y2="100"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.3"
            />
          </g>
        ))}

        {/* Connections */}
        {connections.map(([a, b]) => {
          const ra = regions[a];
          const rb = regions[b];
          const isActive =
            ra.id === activeRegion || rb.id === activeRegion;
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={ra.x}
              y1={ra.y}
              x2={rb.x}
              y2={rb.y}
              stroke={isActive ? "rgba(255,229,51,0.3)" : "rgba(255,255,255,0.06)"}
              strokeWidth={isActive ? "0.5" : "0.3"}
              strokeDasharray="2 2"
              animate={{
                stroke: isActive
                  ? "rgba(255,229,51,0.3)"
                  : "rgba(255,255,255,0.06)",
              }}
              transition={{ duration: 0.4 }}
            />
          );
        })}

        {/* Region markers */}
        {regions.map((region) => {
          const isActive = region.id === activeRegion;
          return (
            <g
              key={region.id}
              className="cursor-pointer"
              onClick={() => onRegionClick(region.id)}
            >
              {/* Outer glow ring */}
              {isActive && (
                <motion.circle
                  cx={region.x}
                  cy={region.y}
                  r="5"
                  fill="none"
                  stroke="rgba(255,229,51,0.2)"
                  strokeWidth="0.4"
                  initial={{ r: 3, opacity: 0 }}
                  animate={{ r: 6, opacity: [0, 0.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}

              {/* Glow */}
              <motion.circle
                cx={region.x}
                cy={region.y}
                animate={{
                  r: isActive ? 4 : 2,
                  fill: isActive
                    ? "rgba(255,229,51,0.12)"
                    : "rgba(255,255,255,0.03)",
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Dot */}
              <motion.circle
                cx={region.x}
                cy={region.y}
                animate={{
                  r: isActive ? 2 : 1.2,
                  fill: isActive ? "#ffe533" : "rgba(255,255,255,0.4)",
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Label */}
              <motion.text
                x={region.x}
                y={region.y - (isActive ? 5 : 3.5)}
                textAnchor="middle"
                className="select-none pointer-events-none"
                animate={{
                  fill: isActive ? "#ffe533" : "rgba(255,255,255,0.35)",
                  fontSize: isActive ? "3.2px" : "2.5px",
                }}
                transition={{ duration: 0.3 }}
                style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
              >
                {isActive ? region.label : region.shortLabel}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
