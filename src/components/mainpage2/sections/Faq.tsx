"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { Button } from "@/components/mainpage2/ui/Button";
import data from "@/data/mainpage2/homepage.json";

export function Faq() {
  const { faq, company } = data;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left — sticky heading */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <SectionLabel>FAQ</SectionLabel>
            <RevealText
              as="h2"
              className="text-3xl md:text-[3rem] font-bold text-white leading-[1.1] mb-6"
            >
              Got questions?
            </RevealText>
            <p className="text-text-muted leading-relaxed mb-6 lg:mb-8 hidden sm:block">
              Everything you need to know about our moving services. Can&apos;t find what you&apos;re looking for?
            </p>
            <div className="hidden sm:block">
              <Button href={`tel:${company.phoneRaw}`} variant="outline">
                Call {company.phone}
              </Button>
            </div>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {faq.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-[#1a1a1a] border-accent/20"
                        : "bg-transparent border-border/30 hover:border-border"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                      aria-expanded={isOpen || undefined}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-text-muted w-6">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className={`text-base md:text-lg font-semibold transition-colors duration-300 ${
                          isOpen ? "text-accent" : "text-white"
                        }`}>
                          {item.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 text-text-muted"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pl-16">
                            <p className="text-text leading-relaxed">{item.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
