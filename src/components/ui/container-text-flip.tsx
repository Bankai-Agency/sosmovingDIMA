"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

type ContainerTextFlipProps = {
  words: string[];
  /** ms between swaps */
  interval?: number;
  /** transition duration in ms for width + letter morph */
  animationDuration?: number;
  className?: string;
  textClassName?: string;
};

/**
 * Container that cycles through `words`. The container box morphs its width
 * to fit the current word; letters animate in with a staggered blur/opacity.
 * Solid accent color box (no gradient).
 */
export function ContainerTextFlip({
  words,
  interval = 3000,
  animationDuration = 700,
  className = "",
  textClassName = "",
}: ContainerTextFlipProps) {
  const id = useId();
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const measureRef = useRef<HTMLSpanElement | null>(null);

  // Measure the current word and update container width
  useEffect(() => {
    if (measureRef.current) {
      // +30px for horizontal padding (matches px-4 on inner span)
      setWidth(measureRef.current.scrollWidth + 30);
    }
  }, [index]);

  // Cycle
  useEffect(() => {
    if (words.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  const word = words[index];

  return (
    <motion.span
      layout
      layoutId={`container-text-flip-${id}`}
      className={`relative inline-block rounded-lg bg-accent text-accent-text px-4 py-1 align-middle ${className}`}
      animate={{ width }}
      transition={{
        duration: animationDuration / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* measure + animate current word */}
      <motion.span
        key={word}
        ref={measureRef}
        className={`inline-block whitespace-nowrap ${textClassName}`}
        transition={{
          duration: animationDuration / 1000,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {word.split("").map((letter, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: i * 0.02,
              duration: 0.25,
              ease: "easeOut",
            }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
    </motion.span>
  );
}
