"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { Button } from "@/components/mainpage2/ui/Button";
import { FadeUp } from "@/components/mainpage2/ui/Animate";
import data from "@/data/mainpage2/homepage.json";

const highlights = [
  "Transparent pricing — no hidden fees, ever",
  "Free blankets, shrink wrap & wardrobe boxes",
  "Furniture disassembly & reassembly included",
  "TV unmounting at no extra charge",
  "Same-day and next-day availability",
  "Dedicated move coordinator for your project",
];

export function BestMovers() {
  const { company } = data;

  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — content */}
          <div>
            <SectionLabel>Local experts</SectionLabel>
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em] mb-8"
            >
              The Best Moving Company Near You
            </RevealText>

            <FadeUp delay={0.2}>
              <p className="text-text text-lg leading-relaxed mb-8">
                Whether you&apos;re moving across the street or across the state, SOS Moving delivers
                the same level of care and professionalism. Starting at just $119/hour for 2 movers
                and a truck — everything included.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {highlights.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5 text-accent" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-mono font-medium uppercase tracking-[-0.02em] leading-[1.2] text-text text-xs sm:text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.6}>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="/free-estimate">Get My Free Quote</Button>
                <a href={`tel:${company.phoneRaw}`} className="text-text-muted hover:text-accent transition-colors text-sm font-medium">
                  or call {company.phone}
                </a>
              </div>
            </FadeUp>
          </div>

          {/* Right — image stack */}
          <div className="relative">
              {/* Main image */}
              <div className="relative h-[300px] sm:h-[400px] md:h-[600px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
                <Image
                  src="/mainpage2/images/SOS-Movers-Loading.webp"
                  alt="SOS Moving team loading a truck"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
              </div>

              {/* Floating stats card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-4 left-3 sm:-bottom-6 sm:-left-6 md:-left-12 bg-[#1a1a1a] border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-accent mb-1">$119</div>
                <div className="text-sm text-text-muted">per hour starting rate</div>
                <div className="text-xs text-text-muted mt-1">2 movers + truck</div>
              </motion.div>

              {/* Floating rating card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute top-3 right-3 sm:-top-4 sm:-right-4 md:-right-8 bg-[#1a1a1a] border border-border/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 backdrop-blur-sm"
              >
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <div className="text-2xl font-bold text-white">{company.rating.overall}/5</div>
                <div className="text-xs text-text-muted">2,500+ reviews</div>
              </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
