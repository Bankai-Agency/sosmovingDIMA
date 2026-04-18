"use client";

import { motion } from "framer-motion";

/**
 * Eyebrow label above section headings — mono, uppercase, muted grey.
 * Matches LatestBlogs / VideoReviews style across mainpage2.
 */
export function SectionLabel({
  children,
  center = false,
}: {
  children: string;
  center?: boolean;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`font-mono text-sm text-text-muted uppercase tracking-[0.1em] mb-3 ${
        center ? "text-center" : ""
      }`}
    >
      {children}
    </motion.p>
  );
}
