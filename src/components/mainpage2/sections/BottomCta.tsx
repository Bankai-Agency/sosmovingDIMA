"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { Button } from "@/components/mainpage2/ui/Button";
import { TechFrame } from "@/components/mainpage2/ui/TechFrame";
import { DotGrid } from "@/components/mainpage2/ui/DotGrid";
import data from "@/data/mainpage2/homepage.json";

export function BottomCta() {
  const { company } = data;

  return (
    <section id="bottom-cta" className="relative py-20 sm:py-32 md:py-40 overflow-hidden">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <span className="text-[5rem] sm:text-[8rem] md:text-[16rem] lg:text-[22rem] font-bold text-white/[0.02] leading-none tracking-tighter whitespace-nowrap">
          MOVE
        </span>
      </div>

      <DotGrid className="z-0" />
      <TechFrame className="hidden md:block z-[1]" dotColor="rgba(255,229,51,0.5)" duration={14} />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-accent text-sm font-semibold uppercase tracking-widest mb-6"
          >
            Get started today
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-[3.5rem] lg:text-[4.5rem] font-bold text-white leading-[1.05] mb-6 sm:mb-8"
          >
            Ready to make your
            <br />
            <span className="text-accent">move stress-free?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-text text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            From $119/hour with free protective materials included. Get your personalized quote in under 5 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/free-estimate" size="lg">
              Get My Free Quote
            </Button>
            <a
              href={`tel:${company.phoneRaw}`}
              className="group flex items-center gap-3 text-white hover:text-accent transition-colors"
            >
              <span className="w-12 h-12 rounded-full border border-border group-hover:border-accent flex items-center justify-center transition-all duration-300 group-hover:bg-accent/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </span>
              <span className="text-lg font-semibold">{company.phone}</span>
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
