"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { Button } from "@/components/mainpage2/ui/Button";
import data from "@/data/mainpage2/homepage.json";

export function Faq() {
  const { faq, company } = data;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealText
          as="h2"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 md:mb-10"
        >
          Frequently Asked Questions
        </RevealText>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,380px)] gap-6 lg:gap-8 items-start">
          {/* LEFT — accordion */}
          <div>
            <div className="rounded-3xl bg-surface py-2">
              {faq.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className={`px-5 md:px-8 py-4 md:py-5 ${
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-5 text-left"
                    >
                      <h3 className="flex-1 text-lg md:text-xl lg:text-[1.375rem] font-semibold text-white leading-[1.2] tracking-[-0.02em]">
                        {item.question}
                      </h3>
                      <span
                        className={`shrink-0 grid place-items-center h-9 w-9 md:h-10 md:w-10 rounded-full transition-colors duration-300 ${
                          isOpen
                            ? "bg-accent text-accent-text"
                            : "bg-surface-hover text-white"
                        }`}
                      >
                        <motion.svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          aria-hidden="true"
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
                          <p className="pt-3 pr-10 text-sm md:text-base font-normal text-text-muted leading-[1.5] tracking-[-0.01em]">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — "Any questions left?" sidebar */}
          <aside className="rounded-3xl bg-surface p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-2xl md:text-3xl font-medium text-white leading-[1.1] tracking-[-0.04em]">
                Any questions left?
              </h3>
              <p className="text-base md:text-lg font-normal text-text-muted leading-[1.2] tracking-[-0.02em]">
                We are ready to answer them!
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href={`tel:${company.phoneRaw}`}>Call us</Button>
              <Button
                href={`mailto:${company.email ?? "info@sosmovingla.net"}`}
                variant="outline"
              >
                Write us
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
