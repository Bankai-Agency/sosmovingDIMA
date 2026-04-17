"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { Button } from "@/components/mainpage2/ui/Button";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { FadeUp } from "@/components/mainpage2/ui/Animate";
import data from "@/data/mainpage2/homepage.json";

function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <FadeUp delay={delay}>
      <div className="bg-[#1a1a1a] border border-border/30 rounded-2xl p-6 text-center hover:border-accent/20 transition-colors duration-500">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">{value}</div>
        <div className="text-xs sm:text-sm text-text-muted">{label}</div>
      </div>
    </FadeUp>
  );
}

const milestones = [
  { year: "2022", text: "Founded in LA with a 2-man crew" },
  { year: "2023", text: "Expanded to Portland, 1,000+ reviews" },
  { year: "2024", text: "Seattle & Denver, 20+ team members" },
  { year: "2025", text: "10,000+ moves, featured in AP News" },
];

export function About() {
  const { about } = data;

  return (
    <section id="about" className="py-20 md:py-32">
      <Container>
        <SectionLabel>About us</SectionLabel>
        <RevealText
          as="h2"
          className="text-3xl md:text-[3rem] font-bold text-white leading-[1.1] mb-12 max-w-3xl"
        >
          {about.title}
        </RevealText>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

          {/* Stats — row on mobile, column on desktop */}
          <div className="md:col-span-2 grid grid-cols-3 md:grid-cols-1 gap-4">
            <Stat value="10,000+" label="Successful Moves" delay={0} />
            <Stat value="2,500+" label="Five-Star Reviews" delay={0.1} />
            <Stat value="20+" label="Cities Served" delay={0.2} />
          </div>

          {/* Main image */}
          <FadeUp delay={0.15} className="md:col-span-4 md:row-span-2">
            <div className="relative h-full min-h-[280px] sm:min-h-[350px] md:min-h-[500px] rounded-2xl overflow-hidden border border-border/30">
              <Image
                src="/mainpage2/images/team.webp"
                alt="SOS Moving full team photo"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
              {/* Stronger overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">{about.text}</p>
              </div>
            </div>
          </FadeUp>

          {/* Milestones timeline — bottom left */}
          <div className="md:col-span-2">
            <FadeUp delay={0.3}>
              <div className="bg-[#1a1a1a] border border-border/30 rounded-2xl p-6 h-full hover:border-accent/20 transition-colors duration-500">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-widest mb-5">Milestones</h3>
                <div className="relative pl-6 border-l border-border/50">
                  {milestones.map((m, i) => (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                      className="relative mb-4 last:mb-0"
                    >
                      <div className="absolute -left-[1.65rem] top-1.5 w-2 h-2 rounded-full bg-accent" />
                      <span className="text-accent text-xs font-mono font-semibold">{m.year}</span>
                      <p className="text-text text-sm mt-0.5">{m.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* CTA row */}
        <FadeUp delay={0.5}>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/about-us" variant="outline">Learn More</Button>
            <Button href="/free-estimate">Get My Free Quote</Button>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
