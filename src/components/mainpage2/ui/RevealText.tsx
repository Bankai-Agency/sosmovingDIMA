"use client";

import { motion } from "framer-motion";

export function RevealText({
  children,
  className = "",
  as: Tag = "h2",
  delay = 0,
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
}) {
  const words = children.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
