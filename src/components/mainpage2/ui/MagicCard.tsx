"use client";

import { useRef, useEffect, useCallback } from "react";

const GLOW_COLOR = "255, 229, 51"; // accent
const PARTICLE_COUNT = 12;
const SPOTLIGHT_RADIUS = 400;

/* ── Spotlight that follows the cursor across the whole section ── */

export function MagicSpotlight({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const spotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const spot = document.createElement("div");
    spot.style.cssText = `
      position:fixed;width:800px;height:800px;border-radius:50%;
      pointer-events:none;z-index:200;opacity:0;
      transform:translate(-50%,-50%);mix-blend-mode:screen;
      background:radial-gradient(circle,
        rgba(${GLOW_COLOR},.12) 0%,rgba(${GLOW_COLOR},.06) 20%,
        rgba(${GLOW_COLOR},.02) 40%,transparent 65%);
      transition:opacity .3s ease;
    `;
    document.body.appendChild(spot);
    spotRef.current = spot;

    const proximity = SPOTLIGHT_RADIUS * 0.5;
    const fade = SPOTLIGHT_RADIUS * 0.75;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      spot.style.left = `${e.clientX}px`;
      spot.style.top = `${e.clientY}px`;

      if (!inside) {
        spot.style.opacity = "0";
        section.querySelectorAll<HTMLElement>(".mc-card").forEach((c) => {
          c.style.setProperty("--glow-i", "0");
        });
        return;
      }

      let minDist = Infinity;
      section.querySelectorAll<HTMLElement>(".mc-card").forEach((card) => {
        const cr = card.getBoundingClientRect();
        const cx = cr.left + cr.width / 2;
        const cy = cr.top + cr.height / 2;
        const dist = Math.max(
          0,
          Math.hypot(e.clientX - cx, e.clientY - cy) -
            Math.max(cr.width, cr.height) / 2,
        );
        minDist = Math.min(minDist, dist);

        const glow =
          dist <= proximity
            ? 1
            : dist <= fade
              ? (fade - dist) / (fade - proximity)
              : 0;
        const rx = ((e.clientX - cr.left) / cr.width) * 100;
        const ry = ((e.clientY - cr.top) / cr.height) * 100;
        card.style.setProperty("--glow-x", `${rx}%`);
        card.style.setProperty("--glow-y", `${ry}%`);
        card.style.setProperty("--glow-i", glow.toString());
      });

      const op =
        minDist <= proximity
          ? 0.7
          : minDist <= fade
            ? ((fade - minDist) / (fade - proximity)) * 0.7
            : 0;
      spot.style.opacity = op.toString();
    };

    document.addEventListener("mousemove", onMove);
    return () => {
      document.removeEventListener("mousemove", onMove);
      spot.remove();
    };
  }, [containerRef]);

  return null;
}

/* ── Card wrapper: particles + border glow + click ripple ── */

export function MagicCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const particles = useRef<HTMLDivElement[]>([]);
  const isHovered = useRef(false);

  const clearParticles = useCallback(() => {
    particles.current.forEach((p) => {
      p.style.transition = "opacity .3s, transform .3s";
      p.style.opacity = "0";
      p.style.transform += " scale(0)";
      setTimeout(() => p.remove(), 300);
    });
    particles.current = [];
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Mobile check */
    if (window.innerWidth <= 768) return;

    const enter = () => {
      isHovered.current = true;
      const { width, height } = el.getBoundingClientRect();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        setTimeout(() => {
          if (!isHovered.current || !ref.current) return;

          const p = document.createElement("div");
          p.style.cssText = `
            position:absolute;width:4px;height:4px;border-radius:50%;
            background:rgba(${GLOW_COLOR},1);
            box-shadow:0 0 6px rgba(${GLOW_COLOR},.6);
            pointer-events:none;z-index:100;
            left:${Math.random() * width}px;top:${Math.random() * height}px;
            opacity:0;transform:scale(0);
            transition:opacity .3s ease, transform .3s ease;
          `;
          el.appendChild(p);
          particles.current.push(p);

          // Animate in
          requestAnimationFrame(() => {
            p.style.opacity = "1";
            p.style.transform = "scale(1)";
          });

          // Float
          const dx = (Math.random() - 0.5) * 80;
          const dy = (Math.random() - 0.5) * 80;
          const dur = 2 + Math.random() * 2;
          p.animate(
            [
              { transform: "scale(1) translate(0,0)", opacity: 1 },
              {
                transform: `scale(1) translate(${dx}px,${dy}px)`,
                opacity: 0.3,
              },
              { transform: "scale(1) translate(0,0)", opacity: 1 },
            ],
            { duration: dur * 1000, iterations: Infinity },
          );
        }, i * 80);
      }
    };

    const leave = () => {
      isHovered.current = false;
      clearParticles();
    };

    const click = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxD = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;z-index:1000;
        width:${maxD * 2}px;height:${maxD * 2}px;
        left:${x - maxD}px;top:${y - maxD}px;
        background:radial-gradient(circle,rgba(${GLOW_COLOR},.35) 0%,rgba(${GLOW_COLOR},.15) 30%,transparent 70%);
        transform:scale(0);opacity:1;
      `;
      el.appendChild(ripple);

      ripple.animate(
        [
          { transform: "scale(0)", opacity: 1 },
          { transform: "scale(1)", opacity: 0 },
        ],
        { duration: 700, easing: "ease-out" },
      ).onfinish = () => ripple.remove();
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("click", click);

    return () => {
      isHovered.current = false;
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("click", click);
      clearParticles();
    };
  }, [clearParticles]);

  return (
    <div ref={ref} className={`mc-card ${className}`}>
      {children}
    </div>
  );
}
