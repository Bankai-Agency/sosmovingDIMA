"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";

const benefits = [
  {
    label: "Licensed & Insured",
    title: "Licensed & Insured",
    text: "USDOT 3398018, CAL-T0192140. Full liability coverage on every single move.",
    image: "/mainpage2/images/Burbank-Movers-1.jpg",
  },
  {
    label: "5-Star Reviews",
    title: "2,500+ Five-Star Reviews",
    text: "4.9 average rating across Google, Yelp, and Trustpilot. Reputation speaks for itself.",
    image: "/mainpage2/images/Team_New.webp",
  },
  {
    label: "Everything Included",
    title: "Everything Included",
    text: "Blankets, shrink wrap, tape, wardrobe boxes, TV unmounting, furniture disassembly — at no extra cost.",
    image: "/mainpage2/images/SOS-Movers-Loading.webp",
  },
  {
    label: "Dedicated Coordinator",
    title: "Dedicated Coordinator",
    text: "One person manages your entire move from the first call to the last box delivered.",
    image: "/mainpage2/images/movers_sos.webp",
  },
];

export function WhySos() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Auto-rotate every 5s unless user interacts
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % benefits.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const current = benefits[active];

  return (
    <section id="why-sos" className="py-20 md:py-28">
      <Container>
        <SectionLabel>Why choose us</SectionLabel>
        <RevealText
          as="h2"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em] mb-10 md:mb-14"
        >
          Not your average movers
        </RevealText>

        {/* Big image with title overlay */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
            </motion.div>
          </AnimatePresence>

          {/* Title/text overlay */}
          <div className="absolute inset-x-0 top-0 z-10 p-6 sm:p-10 md:p-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${active}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl"
              >
                <h3 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-[-0.03em] mb-4">
                  {current.title}
                </h3>
                <p className="text-white/85 text-base sm:text-lg md:text-xl leading-[1.4] tracking-[-0.01em]">
                  {current.text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Numbered tab-pills */}
        <div className="mt-4 sm:mt-5 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {benefits.map((b, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                className={`group text-left rounded-xl p-4 sm:p-5 transition-colors duration-300 ${
                  isActive
                    ? "bg-accent text-accent-text"
                    : "bg-surface text-white hover:bg-surface-hover border border-white/5"
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`block font-mono text-xs tracking-[0.08em] mb-6 sm:mb-10 ${
                    isActive ? "text-accent-text/60" : "text-text-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block font-mono font-bold uppercase text-sm sm:text-base leading-[1.15] tracking-[-0.02em]">
                  {b.label}
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
