"use client";

import Image from "next/image";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { Button } from "@/components/mainpage2/ui/Button";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/mainpage2/ui/Animate";
import data from "@/data/mainpage2/homepage.json";

const highlights = [
  {
    title: "Transparent pricing",
    text: "Flat hourly rate, no surprise fees. What we quote is what you pay.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Everything included",
    text: "Blankets, shrink-wrap, wardrobe boxes, tape, TV un-mounting — all on us.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    title: "Dedicated coordinator",
    text: "One person owns your move from the first call to the last box delivered.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Same-day & next-day",
    text: "Emergency or last-minute moves? We keep slots open for short notice.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export function BestMovers() {
  const { company } = data;

  return (
    <section id="local-experts" className="py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
          {/* LEFT — heading, description, CTA, numbered highlights */}
          <div className="flex flex-col">
            <SectionLabel>Local experts</SectionLabel>
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em] mb-6 md:mb-8"
            >
              The best movers near you
            </RevealText>

            <FadeUp delay={0.2}>
              <p className="text-text-muted text-base md:text-lg leading-[1.55] max-w-[48ch] mb-8 md:mb-10">
                Whether you&rsquo;re moving across the street or across the state,
                SOS Moving shows up with the same crew, the same kit and the same
                flat rate. Starting at <span className="text-white">$119/hr</span> for
                two movers and a truck — everything included.
              </p>
            </FadeUp>

            {/* Numbered highlights — Steps-style hairline dividers */}
            <StaggerContainer className="flex flex-col border-t border-white/10" staggerDelay={0.06}>
              {highlights.map((item, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-start gap-5 md:gap-6 py-5 md:py-6 border-b border-white/10">
                    <div className="shrink-0 grid place-items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/[0.06] text-accent">
                      {item.icon}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs tracking-[0.08em] tabular-nums text-white/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-lg md:text-xl font-semibold text-white leading-[1.2] tracking-[-0.02em]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm md:text-[0.9375rem] text-text-muted leading-[1.5] max-w-[48ch]">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* RIGHT — sticky photo, clean (no overlays) */}
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-surface">
              <Image
                src="/mainpage2/images/SOS-Movers-Loading.webp"
                alt="SOS Moving crew loading a truck in Los Angeles"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
