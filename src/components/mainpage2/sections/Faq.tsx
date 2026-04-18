"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import data from "@/data/mainpage2/homepage.json";

export function Faq() {
  const { faq, company } = data;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealText
          as="h2"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em] mb-10 md:mb-14"
        >
          Frequently Asked Questions
        </RevealText>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,460px)] gap-8 lg:gap-12 items-start">
          {/* LEFT — accordion */}
          <div>
            <div className="rounded-3xl bg-surface py-6">
              {faq.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className={`px-6 md:px-12 py-8 ${
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 text-left"
                    >
                      <h3 className="flex-1 text-xl md:text-2xl lg:text-[2rem] font-medium text-white leading-[1.14] tracking-[-0.02em]">
                        {item.question}
                      </h3>
                      <span
                        className={`shrink-0 grid place-items-center h-12 w-12 md:h-14 md:w-14 rounded-full transition-colors duration-300 ${
                          isOpen
                            ? "bg-accent text-accent-text"
                            : "bg-surface-hover text-white"
                        }`}
                      >
                        <motion.svg
                          width="20"
                          height="20"
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
                          <p className="pt-6 pr-12 text-base md:text-lg lg:text-xl font-medium text-text leading-[1.2] tracking-[-0.04em]">
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
          <aside className="rounded-3xl bg-surface p-8 md:p-12 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-3xl md:text-[2.5rem] font-medium text-white leading-[1.1] tracking-[-0.04em]">
                Any questions left?
              </h3>
              <p className="text-lg md:text-2xl font-medium text-text-muted leading-[1.1] tracking-[-0.02em]">
                We are ready to answer them!
              </p>
            </div>

            {/* Contact methods row — 4 circles */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${company.phoneRaw}`}
                aria-label="Call us"
                className="grid place-items-center h-16 w-16 md:h-[5.5rem] md:w-[5.5rem] rounded-full bg-accent text-accent-text shrink-0 hover:bg-accent-hover transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
              <a
                href={`sms:${company.phoneRaw}`}
                aria-label="Text us"
                className="grid place-items-center h-16 w-16 md:h-[5.5rem] md:w-[5.5rem] rounded-full bg-surface-hover text-white shrink-0 hover:bg-border transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </a>
              <a
                href={`mailto:${company.email ?? "info@sosmovingla.net"}`}
                aria-label="Email us"
                className="grid place-items-center h-16 w-16 md:h-[5.5rem] md:w-[5.5rem] rounded-full bg-surface-hover text-white shrink-0 hover:bg-border transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
              <a
                href="/free-estimate"
                aria-label="Get a quote"
                className="grid place-items-center h-16 w-16 md:h-[5.5rem] md:w-[5.5rem] rounded-full bg-surface-hover text-white shrink-0 hover:bg-border transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </a>
            </div>

          </aside>
        </div>
      </div>
    </section>
  );
}
