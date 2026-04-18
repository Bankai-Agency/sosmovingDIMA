"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};

const charVariant = {
  hidden: { opacity: 0, y: "0.15em", color: "var(--color-accent)" },
  visible: {
    opacity: 1,
    y: 0,
    color: "var(--color-white)",
    transition: {
      opacity: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      y: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      color: { duration: 0.25, delay: 0.2, ease: "linear" },
    },
  },
};

const accentCharVariant = {
  hidden: { opacity: 0, y: "0.15em", color: "var(--color-accent)" },
  visible: {
    opacity: 1,
    y: 0,
    color: "var(--color-accent)",
    transition: {
      opacity: { duration: 0.2 },
      y: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

type Tag = "h1" | "h2" | "h3" | "p" | "span";

export function RevealText({
  children,
  className = "",
  as: TagName = "h2",
  delay = 0,
  accentWords = [],
}: {
  children: string;
  className?: string;
  as?: Tag;
  delay?: number;
  accentWords?: string[];
}) {
  const words = children.split(" ");
  const accentSet = new Set(accentWords);

  return (
    <TagName className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        transition={{ delayChildren: delay }}
        style={{ display: "inline" }}
        aria-label={children}
      >
        {words.map((word, wi) => {
          const isAccent = accentSet.has(word);
          return (
            <span
              key={wi}
              className="inline-block whitespace-nowrap"
              aria-hidden="true"
            >
              {Array.from(word).map((c, ci) => (
                <motion.span
                  key={`${wi}-${ci}`}
                  variants={isAccent ? accentCharVariant : charVariant}
                  style={{ display: "inline-block" }}
                >
                  {c}
                </motion.span>
              ))}
              {wi < words.length - 1 ? "\u00A0" : null}
            </span>
          );
        })}
      </motion.span>
    </TagName>
  );
}
