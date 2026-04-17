"use client";

import { motion } from "framer-motion";

export function SectionLabel({ children, center = false }: { children: string; center?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-2 mb-4 ${center ? "justify-center" : ""}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
      <span className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">
        {children}
      </span>
    </motion.div>
  );
}
