"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: React.ReactNode;
  as?: "div" | "section";
  className?: string;
  delay?: number;
  y?: number;
};

/** Scroll-triggered fade-up — wraps a block, plays once when it enters viewport. */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  y = 24,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement & HTMLElement>} className={className}>
      {children}
    </Tag>
  );
}
