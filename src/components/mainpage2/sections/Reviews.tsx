"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import data from "@/data/mainpage2/homepage.json";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {[...Array(count)].map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  const { reviews, company } = data;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1); // 1 = right, -1 = left

  const next = () => { setDir(1); setActive((a) => (a + 1) % reviews.length); };
  const prev = () => { setDir(-1); setActive((a) => (a - 1 + reviews.length) % reviews.length); };
  const goTo = (i: number) => { setDir(i > active ? 1 : -1); setActive(i); };

  const review = reviews[active];

  return (
    <section id="reviews" className="py-20 md:py-32 overflow-hidden">
      <Container>
        <div className="text-center mb-8">
          <SectionLabel center>Testimonials</SectionLabel>
          <RevealText as="h2" className="text-3xl md:text-[3rem] font-bold text-white leading-[1.1]">
            What our clients say
          </RevealText>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Big quote display */}
          <div className="relative min-h-[240px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: dir * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -80 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                {/* Giant quote mark */}
                <div className="text-accent text-4xl sm:text-5xl md:text-6xl font-serif leading-none mb-3 select-none" aria-hidden="true">
                  &ldquo;
                </div>

                <blockquote className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white font-medium leading-snug mb-6 max-w-3xl mx-auto">
                  {review.text}
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <Image
                    src={review.image}
                    alt={review.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="text-white font-semibold">{review.name}</div>
                    <div className="flex items-center gap-2">
                      <StarRating count={review.rating} />
                      <span className="text-text-muted text-sm capitalize">on {review.source}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              type="button"
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300"
              aria-label="Previous review"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === active
                      ? "w-8 h-2 bg-accent"
                      : "w-2 h-2 bg-border hover:bg-text-muted"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300"
              aria-label="Next review"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>

          {/* Rating summary */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-[#1a1a1a] border border-border/30 rounded-full px-6 py-3">
              <StarRating count={5} />
              <span className="text-white font-semibold">{company.rating.overall}/5</span>
              <span className="text-text-muted text-sm">from 2,500+ reviews</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
