"use client";

import Image from "next/image";
import { Container } from "@/components/mainpage2/ui/Container";
import { Button } from "@/components/mainpage2/ui/Button";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { FadeUp } from "@/components/mainpage2/ui/Animate";
import data from "@/data/mainpage2/homepage.json";

const avatars = [
  "/mainpage2/images/avatar1_1avatar1.avif",
  "/mainpage2/images/avatar2_1avatar2.avif",
  "/mainpage2/images/avatar3_1avatar3.avif",
];

export function About() {
  const { about, company } = data;

  return (
    <section id="about" className="py-20 md:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-stretch">
          {/* LEFT — photo on top, stats pinned to bottom */}
          <div className="flex flex-col min-h-full">
            {/* Photo — fills the vertical slack so stats sit at the bottom */}
            <FadeUp delay={0.1} className="flex-1 min-h-[240px]">
              <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="/mainpage2/images/Team_New.webp"
                  alt="SOS Moving team"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                {/* Top card — wide, with avatars */}
                <div className="p-6 md:p-8 border-b border-white/10">
                  <div className="flex -space-x-2 mb-5">
                    {avatars.map((src, i) => (
                      <div
                        key={src}
                        className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-bg"
                        style={{ zIndex: avatars.length - i }}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-white leading-none tracking-[-0.03em]">
                    {company.stats.moves}
                  </div>
                  <div className="mt-2 text-sm font-mono uppercase tracking-[0.08em] text-text-muted">
                    successful moves
                  </div>
                </div>

                {/* Bottom row — 2 cards side by side, split by vertical divider */}
                <div className="grid grid-cols-2">
                  <div className="p-6 md:p-8 border-r border-white/10">
                    <div className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-white leading-none tracking-[-0.03em]">
                      {company.stats.cities}
                    </div>
                    <div className="mt-2 text-sm font-mono uppercase tracking-[0.08em] text-text-muted">
                      cities served
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-white leading-none tracking-[-0.03em]">
                      {company.rating.overall}
                      <span className="text-accent">★</span>
                    </div>
                    <div className="mt-2 text-sm font-mono uppercase tracking-[0.08em] text-text-muted">
                      2,500+ reviews
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* RIGHT — headline + body + CTA (CTA pinned to bottom) */}
          <div className="flex flex-col">
            <SectionLabel>About</SectionLabel>
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em]"
            >
              {about.title}
            </RevealText>

            <FadeUp delay={0.25}>
              <div className="mt-8 max-w-xl text-text-muted text-base leading-relaxed">
                <p>{about.text}</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.4} className="mt-auto pt-10">
              <div className="flex flex-wrap gap-4">
                <Button href="/free-estimate">Get My Free Quote</Button>
                <Button href="/about-us" variant="outline">
                  Learn More
                </Button>
              </div>
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
}
