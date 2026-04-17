"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/mainpage2/ui/Container";
import { FadeUp, SlideIn } from "@/components/mainpage2/ui/Animate";
import data from "@/data/mainpage2/homepage.json";

export function Locations() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row gap-10">
          <SlideIn direction="left" className="lg:w-[35%] flex flex-col justify-center">
            <h2 className="text-2xl md:text-[2.4rem] font-bold text-white leading-tight mb-4">
              Our Locations
            </h2>
            <p className="text-text-muted leading-relaxed mb-8">
              From Los Angeles to Portland and Seattle — we move you wherever you need to go.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={() => scroll("left")} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300" aria-label="Previous location">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button type="button" onClick={() => scroll("right")} className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300" aria-label="Next location">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg>
              </button>
            </div>
          </SlideIn>

          <FadeUp className="lg:w-[65%]">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {data.locations.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/${loc.slug}`}
                  className="group flex-shrink-0 w-[17.5rem] h-[20rem] relative rounded-[1rem] overflow-hidden flex items-end p-5 snap-start"
                >
                  <Image src={loc.image} alt={`${loc.name} — SOS Moving service area`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="280px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                  <h3 className="relative z-10 text-[1.2rem] font-bold text-white group-hover:text-accent transition-colors duration-300">
                    {loc.name}
                  </h3>
                </Link>
              ))}
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
