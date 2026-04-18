"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { Button } from "@/components/mainpage2/ui/Button";

const steps = [
  {
    title: "Request a free quote",
    text: "Fill out a 2-minute form or call us — we reply within an hour with a personalized estimate, no hidden fees.",
    image: "/mainpage2/images/Helpers-and-Truck.webp",
  },
  {
    title: "Personal walkthrough",
    text: "A dedicated coordinator reviews your inventory, timeline and special items so nothing slips through the cracks.",
    image: "/mainpage2/images/Team_New.webp",
  },
  {
    title: "Custom move plan",
    text: "We size the crew, truck and timeline to your move — local or long-distance, studio or five-bedroom.",
    image: "/mainpage2/images/Movers-Los-Angeles.avif",
  },
  {
    title: "Packing & prep",
    text: "Blankets, shrink-wrap, tape, wardrobe boxes, TV un-mounting and furniture disassembly are all included.",
    image: "/mainpage2/images/SOS-Movers-Loading.webp",
  },
  {
    title: "Moving day",
    text: "Uniformed, background-checked crew arrives on time, loads carefully and transports to your new place.",
    image: "/mainpage2/images/movers_sos.webp",
  },
  {
    title: "Unload & place",
    text: "Every box and piece of furniture goes exactly where you want it. Beds and shelves reassembled.",
    image: "/mainpage2/images/Burbank-Movers-1.jpg",
  },
  {
    title: "Peace of mind",
    text: "Follow-up call from your coordinator. Full insurance coverage on every move — you're covered start to finish.",
    image: "/mainpage2/images/Long-Distance-Movers-Los-Angeles.avif",
  },
];

export function Steps() {
  const [active, setActive] = useState(0);
  const current = steps[active] ?? steps[0];

  return (
    <section id="steps" className="py-20 md:py-28">
      <Container>
        <SectionLabel>How it works</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          {/* LEFT — sticky: heading, photo (swaps with active step), CTA */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-6 lg:max-h-[calc(100vh-7rem)]">
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em]"
            >
              The path to a simple, stress-free move
            </RevealText>

            <div className="relative aspect-square w-full max-w-[460px] rounded-3xl overflow-hidden bg-surface">
              <AnimatePresence mode="sync">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Active step caption pinned to image bottom */}
              <div className="absolute left-5 right-5 bottom-5 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`cap-${active}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.12em] text-white"
                  >
                    <span className="grid place-items-center h-7 w-7 rounded-full bg-accent text-accent-text text-[0.65rem] font-bold">
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/90">{current.title}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="tel:+19094430004" variant="outline">
                Let&rsquo;s talk
              </Button>
            </div>
          </div>

          {/* RIGHT — accordion list with L-shaped borders (top + left) per Figma 44:2389 */}
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => {
              const isOpen = i === active;
              return (
                <div
                  key={i}
                  className="border-t border-l border-white/10"
                >
                  <button
                    type="button"
                    onClick={() => setActive(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-6 px-5 md:px-6 py-5 md:py-6 text-left"
                  >
                    <span
                      className={`font-mono text-lg md:text-xl tracking-[-0.02em] shrink-0 tabular-nums transition-colors ${
                        isOpen ? "text-white" : "text-white/40"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="flex-1 text-xl md:text-2xl lg:text-[1.625rem] font-semibold text-white leading-[1.2] tracking-[-0.02em]">
                      {step.title}
                    </h3>
                    <span
                      className={`shrink-0 grid place-items-center h-9 w-9 md:h-10 md:w-10 rounded-full transition-colors duration-300 ${
                        isOpen
                          ? "bg-accent text-accent-text"
                          : "bg-white/[0.06] text-white group-hover:bg-white/15"
                      }`}
                      aria-hidden="true"
                    >
                      <motion.svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <motion.line
                          x1="12"
                          y1="5"
                          x2="12"
                          y2="19"
                          animate={{ scaleY: isOpen ? 0 : 1 }}
                          style={{ originX: 0.5, originY: 0.5 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 md:px-6 pb-5 md:pb-6 pl-[calc(1.25rem+2.25rem)] md:pl-[calc(1.5rem+2.5rem)] text-base md:text-lg leading-[1.5] text-text-muted max-w-[48ch]">
                          {step.text}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
