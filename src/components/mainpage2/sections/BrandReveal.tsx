"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { DotGrid } from "@/components/mainpage2/ui/DotGrid";

const words = ["Safe", "Organized", "Sound"];

/* Golden-angle spread for fly-away directions */
function flyDir(wi: number, li: number) {
  const seed = wi * 10 + li;
  const a = ((seed * 137.5) % 360) * (Math.PI / 180);
  const d = 350 + (seed % 5) * 100;
  return { x: Math.cos(a) * d, y: Math.sin(a) * d };
}

/* Linear interpolation clamped to [0, 1] */
function lerp(v: number, start: number, end: number) {
  if (v <= start) return 0;
  if (v >= end) return 1;
  return (v - start) / (end - start);
}

/* ─── TIMINGS ─── */
const PHASE1_START = 0.05;     // letters begin flying
const PHASE1_END = 0.38;       // ALL letters fully gone
const PHASE2_START = 0.40;     // S,O,S start sliding to centre
const PHASE2_END = 0.56;       // S,O,S centred, scaled, coloured
const PHASE3_START = 0.60;     // "Moving Company" appears
const PHASE3_END = 0.72;

export function BrandReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const initRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
  const [offsets, setOffsets] = useState([0, 0, 0]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ── measure how far each S/O/S must translate to centre ── */
  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row || initRefs.current.some((r) => !r)) return;

    const rowRect = row.getBoundingClientRect();
    const cx = rowRect.width / 2;

    const rects = initRefs.current.map((el) => {
      const r = el!.getBoundingClientRect();
      return { cx: r.left - rowRect.left + r.width / 2, w: r.width };
    });

    const gap = rects[0].w * 0.6;
    const totalW = rects.reduce((s, r) => s + r.w, 0) + gap * 2;
    let cursor = cx - totalW / 2;

    const next = rects.map((r) => {
      const target = cursor + r.w / 2;
      cursor += r.w + gap;
      return Math.round(target - r.cx);
    });
    setOffsets(next);
  }, []);

  useEffect(() => {
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    else measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* Subtitle */
  const subOp = useTransform(scrollYProgress, (v) => lerp(v, PHASE3_START, PHASE3_END));
  const subY = useTransform(scrollYProgress, (v) => 14 * (1 - lerp(v, PHASE3_START, PHASE3_END)));

  let initIdx = 0;

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <DotGrid className="z-0" />

      <div className="sticky top-0 h-screen flex items-center justify-center z-10 px-4 overflow-hidden">
        <div className="relative flex flex-col items-center w-full">
          {/* Letters row */}
          <div
            ref={rowRef}
            className="relative flex items-baseline justify-center gap-[0.4em] sm:gap-[0.55em] flex-wrap"
          >
            {words.map((word, wi) => {
              const myInitIdx = initIdx++;
              return (
                <span key={word} className="inline-flex items-baseline">
                  {word.split("").map((ch, li) => (
                    <Letter
                      key={li}
                      ch={ch}
                      isInitial={li === 0}
                      wi={wi}
                      li={li}
                      scrollYProgress={scrollYProgress}
                      centerX={li === 0 ? offsets[myInitIdx] : 0}
                      elRef={
                        li === 0
                          ? (el: HTMLSpanElement | null) => {
                              initRefs.current[myInitIdx] = el;
                            }
                          : undefined
                      }
                    />
                  ))}
                </span>
              );
            })}
          </div>

          {/* Subtitle — absolutely positioned so it doesn't depend on row height */}
          <motion.p
            style={{ opacity: subOp, y: subY }}
            className="absolute top-full mt-6 sm:mt-8 text-text-muted text-sm sm:text-base md:text-lg uppercase tracking-[0.25em]"
          >
            Moving Company
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ── Letter ── */

function Letter({
  ch,
  isInitial,
  wi,
  li,
  scrollYProgress,
  centerX,
  elRef,
}: {
  ch: string;
  isInitial: boolean;
  wi: number;
  li: number;
  scrollYProgress: MotionValue<number>;
  centerX: number;
  elRef?: (el: HTMLSpanElement | null) => void;
}) {
  const dir = useMemo(() => flyDir(wi, li), [wi, li]);
  const gIdx = wi * 10 + li;

  // Each non-initial letter gets a slightly different start time
  const stagger = gIdx * 0.005;
  const myStart = PHASE1_START + stagger;
  const myEnd = PHASE1_END; // hard deadline — fully gone before phase 2

  const rotEnd = (gIdx % 2 === 0 ? 1 : -1) * (15 + gIdx * 2);

  /* ── Explicit functional transforms — guaranteed clamping ── */

  const opacity = useTransform(scrollYProgress, (v) => {
    if (isInitial) return 1;
    return 1 - lerp(v, myStart, myEnd);
  });

  const x = useTransform(scrollYProgress, (v) => {
    let fx = 0;
    if (!isInitial) fx = lerp(v, myStart, myEnd) * dir.x;
    let sx = 0;
    if (isInitial) sx = lerp(v, PHASE2_START, PHASE2_END) * centerX;
    return fx + sx;
  });

  const y = useTransform(scrollYProgress, (v) => {
    if (isInitial) return 0;
    return lerp(v, myStart, myEnd) * dir.y;
  });

  const rotate = useTransform(scrollYProgress, (v) => {
    if (isInitial) return 0;
    return lerp(v, myStart, myEnd) * rotEnd;
  });

  const scale = useTransform(scrollYProgress, (v) => {
    if (!isInitial) return 1;
    return 1 + 0.5 * lerp(v, PHASE2_START, PHASE2_END);
  });

  const color = useTransform(scrollYProgress, (v) => {
    if (!isInitial) return "rgb(255,255,255)";
    const t = lerp(v, PHASE2_START, PHASE2_END);
    const r = Math.round(255);
    const g = Math.round(255 - 26 * t);   // 255 → 229
    const b = Math.round(255 - 204 * t);   // 255 → 51
    return `rgb(${r},${g},${b})`;
  });

  return (
    <motion.span
      ref={elRef}
      style={{ opacity, x, y, rotate, color, scale }}
      className="text-[2rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[6rem] font-bold leading-none inline-block"
    >
      {ch}
    </motion.span>
  );
}
