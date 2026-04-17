"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";

const cards = [
  {
    title: "Licensed & Insured",
    text: "USDOT 3398018, CAL-T0192140. Full liability coverage on every single move we do.",
    image: "/mainpage2/images/Burbank-Movers-1.jpg",
  },
  {
    title: "2,500+ Five-Star Reviews",
    text: "4.9 average rating across Google, Yelp, and Trustpilot. Our reputation speaks for itself.",
    image: "/mainpage2/images/Team_New.webp",
  },
  {
    title: "Everything Included",
    text: "Blankets, shrink wrap, tape, wardrobe boxes, TV unmounting, furniture disassembly — all at no extra cost.",
    image: "/mainpage2/images/SOS-Movers-Loading.webp",
  },
  {
    title: "Dedicated Coordinator",
    text: "One person manages your entire move from the first call to the last box delivered.",
    image: "/mainpage2/images/movers_sos.webp",
  },
];

export function WhySos() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Smooth transition: debounce hover changes
  const handleHover = (i: number) => {
    clearTimeout(timeoutRef.current);
    setActive(i);
    setHovering(true);
  };

  useEffect(() => {
    if (hovering) return;

    const interval = setInterval(() => {
      setActive((p) => (p + 1) % cards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [hovering]);

  return (
    <section id="why-sos" className="py-20 md:py-32">
      <Container>
        <SectionLabel>Why choose us</SectionLabel>
        <RevealText
          as="h2"
          className="text-3xl md:text-[3rem] font-bold text-white leading-[1.1] mb-10 md:mb-14"
        >
          Not your average movers
        </RevealText>

        {/* Expandable gallery */}
        <div className="flex h-[28rem] sm:h-[32rem] md:h-[36rem] w-full gap-2">
          {cards.map((card, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={card.title}
                className="relative cursor-pointer overflow-hidden rounded-2xl"
                animate={{
                  flex: isActive ? 4 : 0.35,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 22,
                  mass: 0.8,
                }}
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={() => setHovering(false)}
              >
                {/* Image — always present, blur/brightness animate */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    filter: isActive
                      ? "blur(0px) brightness(1)"
                      : "blur(3px) brightness(0.4)",
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>

                {/* Bottom shadow for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                {/* Number badge */}
                <motion.span
                  className="absolute top-4 left-4 text-xs font-mono z-10"
                  animate={{ color: isActive ? "#ffe533" : "rgba(255,255,255,0.35)" }}
                  transition={{ duration: 0.4 }}
                >
                  0{i + 1}
                </motion.span>

                {/* Collapsed: vertical title */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <span
                        className="text-white/70 text-xs sm:text-sm font-semibold tracking-wider uppercase whitespace-nowrap"
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                        }}
                      >
                        {card.title}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded: title + description */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 z-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    >
                      <WaveText
                        key={`wave-${i}`}
                        text={card.title}
                        className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3"
                      />
                      <motion.p
                        className="text-white/80 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                      >
                        {card.text}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ── Wave text reveal (letter-by-letter pop-up) ── */

function WaveText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: "0.6em" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.03,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}
