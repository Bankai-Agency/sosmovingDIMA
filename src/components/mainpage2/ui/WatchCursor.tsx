"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type Props = {
  /** Selector used to detect which cards should show the cursor (e.g. '[data-video-card="idle"]'). */
  cardSelector: string;
  /** Root to attach the pointer listener on (defaults to window). Must be stable. */
  containerRef: React.RefObject<HTMLElement | null>;
};

/**
 * Shared "Watch" cursor for the video-review scroller. A single cursor instance follows the mouse
 * across all cards, so moving between cards doesn't create a fly-in/fly-out flicker.
 */
export function WatchCursor({ cardSelector, containerRef }: Props) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overCardRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 600, damping: 45, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 600, damping: 45, mass: 0.4 });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as Element | null;
      const isOver = !!target?.closest?.(cardSelector);
      if (isOver) {
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
        if (!overCardRef.current) {
          overCardRef.current = true;
          setVisible(true);
        }
      } else if (overCardRef.current) {
        overCardRef.current = false;
        // Delay hide so the cursor doesn't pop out on brief gaps between adjacent cards.
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => setVisible(false), 180);
      }
    };

    const handleLeave = () => {
      overCardRef.current = false;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setVisible(false), 180);
    };

    root.addEventListener("mousemove", handleMove);
    root.addEventListener("mouseleave", handleLeave);
    return () => {
      root.removeEventListener("mousemove", handleMove);
      root.removeEventListener("mouseleave", handleLeave);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [cardSelector, containerRef, mouseX, mouseY]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="fixed top-0 left-0 z-[9999] pointer-events-none grid place-items-center w-[92px] h-[92px] rounded-full bg-accent text-accent-text font-mono text-xs font-bold uppercase tracking-[0.15em] shadow-lg"
        >
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Watch
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
