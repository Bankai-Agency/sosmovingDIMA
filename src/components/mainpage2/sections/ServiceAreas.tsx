"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  const activeArea = serviceAreas.find((a) => a.region === activeRegion);

  return (
    <section id="service-areas" className="py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Interactive map */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-[1.5rem] sm:rounded-[2rem] bg-[#0a0a0a] border border-border/20 overflow-hidden p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-2 relative z-10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
                  Based in Los Angeles, CA
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-text-muted font-medium uppercase tracking-wider">
                    Available West Coast & Beyond
                  </span>
                </div>
              </div>

              {/* Region map */}
              <RegionMap
                activeRegion={activeRegion}
                onRegionClick={setActiveRegion}
                className="max-w-[400px] mx-auto"
              />
            </div>
          </div>

          {/* Right — regions + cities */}
          <div className="order-1 lg:order-2">
            <SectionLabel>Coverage</SectionLabel>
            <RevealText
              as="h2"
              className="text-3xl md:text-[3rem] font-bold text-white leading-[1.1] mb-8"
            >
              Areas We Serve
            </RevealText>

            {/* Region tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {serviceAreas.map((area) => (
                <button
                  key={area.region}
                  type="button"
                  onClick={() => setActiveRegion(area.region)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    area.region === activeRegion
                      ? "bg-accent text-accent-text"
                      : "bg-[#1a1a1a] text-text-muted hover:text-white border border-border/50 hover:border-accent/30"
                  }`}
                >
                  {area.region}
                </button>
              ))}
            </div>

            {/* Cities */}
            <AnimatePresence mode="wait">
              {activeArea && (
                <motion.div
                  key={activeArea.region}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-text-muted text-sm mb-4">
                    {activeArea.cities.length} cities in {activeArea.region}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeArea.cities.map((city) => (
                      <Link
                        key={city}
                        href={`/${slugify(city)}-movers`}
                        className="px-3 py-1.5 bg-[#1a1a1a] border border-border/30 rounded-lg text-sm text-text hover:text-accent hover:border-accent/30 transition-all duration-200"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
