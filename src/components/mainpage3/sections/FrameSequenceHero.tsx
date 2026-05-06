"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Frame-sequence hero — direct port of the Terminal Industries / aimoving.app
 * pattern: 120 webp frames preloaded into Image objects, drawn to a canvas
 * synced to scroll progress. Big headline overlays the canvas and reveals
 * word-by-word along the same scrub. Wrap accent words in [brackets].
 */

const FRAME_COUNT = 120;
const FRAME_PATH = (i: number) =>
  `/frames_webp/frame_${String(i).padStart(4, "0")}.webp`;

/**
 * Headline rotation — each phrase owns one segment of scroll progress
 * (e.g. four phrases = each gets 25% of the scrub). Inside its segment the
 * phrase reveals word-by-word.
 */
const HEADLINES: string[] = [
  "Move home in [Los Angeles] without lifting a finger.",
  "[Background-checked] crews on every truck.",
  "[Transparent hourly pricing] — no fine print.",
  "Just the move, [done right].",
];

function tokenize(text: string) {
  const tokens: { word: string; isStrong: boolean }[] = [];
  text.split(/(\[[^\]]+\])/).forEach((part) => {
    if (!part) return;
    const isStrong = part.startsWith("[") && part.endsWith("]");
    const cleaned = isStrong ? part.slice(1, -1) : part;
    cleaned
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => tokens.push({ word, isStrong }));
  });
  return tokens;
}

export function FrameSequenceHero() {
  const ref = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);

  // Preload all frames once on mount.
  useEffect(() => {
    const arr: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      arr.push(img);
    }
    framesRef.current = arr;
  }, []);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const canvas = root.querySelector<HTMLCanvasElement>(".m3-fseq-canvas");
      const pin = root.querySelector<HTMLElement>(".m3-fseq-pin");
      const words = root.querySelectorAll<HTMLElement>(".m3-fseq-w");
      const progressEl = root.querySelector<HTMLElement>(".m3-fseq-progress > span");
      if (!canvas || !pin) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Sizing — match the canvas internal pixel buffer to the displayed size,
      // recalculated on each ScrollTrigger refresh.
      const sizeCanvas = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      sizeCanvas();

      const drawFrame = (idx: number) => {
        const img = framesRef.current[idx];
        if (!img || !img.complete || img.naturalWidth === 0) return;
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;
        // contain-cover scale so the frame fills the viewport without distortion
        const ir = img.naturalWidth / img.naturalHeight;
        const cr = cw / ch;
        let dw = cw, dh = ch, dx = 0, dy = 0;
        if (ir > cr) {
          dh = ch;
          dw = ch * ir;
          dx = (cw - dw) / 2;
        } else {
          dw = cw;
          dh = cw / ir;
          dy = (ch - dh) / 2;
        }
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
      };

      // Initial frame
      const tryDrawFirst = () => {
        const first = framesRef.current[0];
        if (first && first.complete && first.naturalWidth > 0) drawFrame(0);
        else if (first) first.addEventListener("load", () => drawFrame(0), { once: true });
      };
      tryDrawFirst();

      const lines = root.querySelectorAll<HTMLElement>(".m3-fseq-line");
      const totalLines = lines.length;
      let lastLine = -1;

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        pin,
        pinSpacing: true,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(
            FRAME_COUNT - 1,
            Math.floor(self.progress * FRAME_COUNT),
          );
          drawFrame(idx);

          if (progressEl) {
            progressEl.style.transform = `scaleX(${self.progress})`;
          }

          // Which headline is active? Each owns 1/totalLines of the scrub.
          const lineFloat = self.progress * totalLines;
          const lineIdx = Math.min(totalLines - 1, Math.floor(lineFloat));
          const within = Math.min(1, lineFloat - lineIdx); // 0..1 within this line

          if (lineIdx !== lastLine) {
            lastLine = lineIdx;
            lines.forEach((el, i) =>
              el.classList.toggle("is-active", i === lineIdx),
            );
            // reset words on every line that's not active
            lines.forEach((el, i) => {
              if (i === lineIdx) return;
              el.querySelectorAll(".m3-fseq-w").forEach((w) =>
                w.classList.remove("is-on"),
              );
            });
          }

          // Word reveal of the active line.
          // Reveal in the first 40% of the segment, then HOLD all words
          // visible for the remaining 60% so the user actually reads the line
          // before the next phrase swaps in.
          const activeLine = lines[lineIdx];
          if (activeLine) {
            const ws = activeLine.querySelectorAll<HTMLElement>(".m3-fseq-w");
            const revealProgress = Math.min(1, within / 0.4); // 0..1 over first 40%
            const litCount = Math.floor(revealProgress * ws.length);
            ws.forEach((el, i) => el.classList.toggle("is-on", i < litCount));
          }
        },
        onRefresh: () => {
          sizeCanvas();
          drawFrame(0);
        },
      });

      const onResize = () => {
        sizeCanvas();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        trigger.kill();
      };
    },
    { scope: ref },
  );

  return (
    <section className="m3-fseq" ref={ref}>
      <div className="m3-fseq-pin">
        <canvas className="m3-fseq-canvas" />
        <div className="m3-fseq-overlay">
          <div className="m3-fseq-inner">
            <h1 className="m3-fseq-stack" aria-label={HEADLINES[0].replace(/[\[\]]/g, "")}>
              {HEADLINES.map((line, lineIdx) => {
                const tokens = tokenize(line);
                return (
                  <span
                    key={lineIdx}
                    className={`m3-fseq-line${lineIdx === 0 ? " is-active" : ""}`}
                  >
                    {tokens.map((t, i) => (
                      <span
                        key={i}
                        className={`m3-fseq-w${t.isStrong ? " is-strong" : ""}`}
                      >
                        {t.word}
                      </span>
                    ))}
                  </span>
                );
              })}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
