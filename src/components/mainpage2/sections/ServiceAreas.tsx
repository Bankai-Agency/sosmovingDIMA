"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { RegionMap } from "@/components/mainpage2/ui/RegionMap";
import data from "@/data/mainpage2/homepage.json";

function slugify(city: string) {
  return city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function ServiceAreas() {
  const { serviceAreas } = data;
  const [activeRegion, setActiveRegion] = useState(serviceAreas[0].region);
  const [openRegion, setOpenRegion] = useState<string | null>(serviceAreas[0].region);

  return (
    <section id="service-areas" className="py-20 md:py-28">
      <Container>
        <SectionLabel>Coverage</SectionLabel>
        <RevealText
          as="h2"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em] mb-10 md:mb-14"
        >
          Areas We Serve
        </RevealText>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* LEFT — map + CTA */}
          <div className="relative rounded-3xl bg-surface border border-white/5 p-6 sm:p-8 lg:sticky lg:top-28">
            <div className="text-center mb-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 tracking-[-0.02em]">
                Based in Los Angeles, CA
              </h3>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-xs text-text-muted uppercase tracking-[0.1em]">
                  Available West Coast & Beyond
                </span>
              </div>
            </div>
            <RegionMap
              activeRegion={activeRegion}
              onRegionClick={(r) => {
                setActiveRegion(r);
                setOpenRegion(r);
              }}
              className="max-w-[420px] mx-auto"
            />
            <Link
              href="/free-estimate"
              className="mt-8 inline-flex items-center justify-center gap-3 w-full rounded-full bg-accent hover:bg-accent-hover text-accent-text px-6 py-4 font-medium text-base tracking-[-0.02em] transition-colors"
            >
              Get your free quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* RIGHT — accordion list of regions → neighborhoods */}
          <div className="rounded-3xl bg-surface border border-white/5 py-3 overflow-hidden">
            {serviceAreas.map((area, i) => {
              const isOpen = openRegion === area.region;
              return (
                <div
                  key={area.region}
                  className={i > 0 ? "border-t border-white/5" : ""}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpenRegion(isOpen ? null : area.region);
                      setActiveRegion(area.region);
                    }}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 px-6 md:px-8 py-6 text-left"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-text-muted uppercase tracking-[0.1em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white leading-[1.1] tracking-[-0.03em]">
                        {area.region}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 grid place-items-center h-12 w-12 md:h-14 md:w-14 rounded-full transition-colors duration-300 ${
                        isOpen
                          ? "bg-accent text-accent-text"
                          : "bg-surface-hover text-white group-hover:bg-white/15"
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
                        <div className="px-6 md:px-8 pb-6 flex flex-wrap gap-2">
                          {area.cities.map((city) => (
                            <Link
                              key={city}
                              href={`/${slugify(city)}-movers`}
                              className="px-3 py-1.5 bg-black/30 border border-white/5 rounded-lg text-sm text-text hover:text-accent hover:border-accent/40 transition-colors"
                            >
                              {city}
                            </Link>
                          ))}
                        </div>
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
