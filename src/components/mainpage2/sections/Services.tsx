"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/mainpage2/ui/Container";
import { Button } from "@/components/mainpage2/ui/Button";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/mainpage2/ui/Animate";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { MagicSpotlight } from "@/components/mainpage2/ui/MagicCard";
import { BorderGlow } from "@/components/mainpage2/ui/BorderGlow";
import data from "@/data/mainpage2/homepage.json";

const serviceIcons: Record<string, React.ReactNode> = {
  "local-moving": (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  "long-distance-movers": (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  "apartment-movers": (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22V12h6v10" /><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01" />
    </svg>
  ),
  "commercial-movers": (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  ),
  "packing-services": (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  "storage": (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 8.35V20a2 2 0 01-2 2H4a2 2 0 01-2-2V8.35A2 2 0 013.26 6.5l8-3.2a2 2 0 011.48 0l8 3.2A2 2 0 0122 8.35z" /><path d="M6 18h12M6 14h12" />
    </svg>
  ),
};

export function Services() {
  const { services } = data;
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="py-20 md:py-32" ref={sectionRef}>
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <SectionLabel>What we do</SectionLabel>
            <RevealText as="h2" className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em]">
              Our Services
            </RevealText>
          </div>
          <FadeUp delay={0.3}>
            <Button href="/services">View all services</Button>
          </FadeUp>
        </div>

        <MagicSpotlight containerRef={sectionRef} />

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" staggerDelay={0.08}>
          {services.map((service) => (
            <StaggerItem key={service.slug}>
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <BorderGlow
                  className="min-h-[360px] sm:min-h-[420px] md:min-h-[460px] h-full transition-transform duration-500"
                  backgroundColor="#1a1a1a"
                  glowColor="52 100 60"
                  borderRadius={24}
                  glowRadius={40}
                  glowIntensity={1.2}
                  coneSpread={25}
                  colors={["#ffe533", "#ffec6a", "#ffffff"]}
                >
                  <div className="relative flex flex-col h-full min-h-[360px] sm:min-h-[420px] md:min-h-[460px]">
                    {/* Image — always visible, covers top portion of card */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-[24px]">
                      <Image
                        src={service.image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {/* Icon overlay — pinned to top-right of image */}
                      <div className="absolute top-4 right-4 grid place-items-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:bg-accent group-hover:text-accent-text transition-colors duration-300">
                        <div className="scale-[0.55] md:scale-[0.7]">
                          {serviceIcons[service.slug] || serviceIcons["local-moving"]}
                        </div>
                      </div>
                    </div>

                    {/* Content below image — padded */}
                    <div className="flex-1 flex flex-col gap-3 p-6 md:p-7">
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-[1.15] tracking-[-0.02em] group-hover:text-accent transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm md:text-[0.9375rem] text-text-muted leading-[1.5] line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </BorderGlow>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
