"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants, type UseInViewOptions } from "framer-motion";

type InViewProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  viewOptions?: UseInViewOptions;
  as?: "div" | "section" | "article" | "ul";
};

export function InView({
  children,
  className,
  variants,
  viewOptions,
  as = "div",
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewOptions);
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </Tag>
  );
}
