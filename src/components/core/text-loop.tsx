"use client";

import {
  Children,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "framer-motion";

type TextLoopProps = {
  children: ReactNode;
  className?: string;
  /** ms between swaps */
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (i: number) => void;
};

export function TextLoop({
  children,
  className,
  interval = 2000,
  transition,
  variants,
  onIndexChange,
}: TextLoopProps) {
  const items = Children.toArray(children);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [items.length, interval, onIndexChange]);

  return (
    <span className={`relative inline-flex align-baseline ${className ?? ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={transition}
          className="inline-block"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
