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
  const ROTATE_MS = 5000;

  // Auto-rotate every ROTATE_MS — resets whenever `active` changes (including manual click)
  useEffect(() => {
    const id = setTimeout(() => {
      setActive((i) => (i + 1) % benefits.length);
    }, ROTATE_MS);
    return () => clearTimeout(id);
  }, [active]);

  const current = benefits[active];

  return (
    <section id="why-sos" className="py-20 md:py-28">
      {/* Full-bleed image — viewport width AND height */}
      <div
        className="relative overflow-hidden bg-black w-screen h-screen left-1/2 -translate-x-1/2"
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
            {/* Top + bottom gradients for text legibility (title on top, tabs on bottom) */}
            <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Heading overlay — top */}
        <div className="absolute inset-x-0 top-0 z-10 p-6 sm:p-10 md:p-14">
          <div className="mx-auto w-full max-w-7xl flex flex-col gap-6">
            <SectionLabel>Why choose us</SectionLabel>
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em] max-w-3xl"
            >
              Not your average movers
            </RevealText>
          </div>
        </div>

        {/* Tabs overlay — bottom, pinned inside image */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {benefits.map((b, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`group relative overflow-hidden text-left rounded-xl p-4 sm:p-5 transition-colors duration-300 backdrop-blur-md ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-black/30 text-white hover:bg-black/40 border border-white/10"
                    }`}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <motion.span
                        key={`progress-${active}`}
                        aria-hidden="true"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: ROTATE_MS / 1000,
                          ease: "linear",
                        }}
                        style={{ originX: 0 }}
                        className="absolute inset-0 bg-accent z-0"
                      />
                    )}
                    <span
                      className={`relative z-10 block font-mono text-xs tracking-[0.08em] mb-6 sm:mb-10 ${
                        isActive ? "text-accent-text/60" : "text-white/60"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`relative z-10 block font-mono font-bold uppercase text-sm sm:text-base leading-[1.15] tracking-[-0.02em] ${
                        isActive ? "text-accent-text" : ""
                      }`}
                    >
                      {b.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
