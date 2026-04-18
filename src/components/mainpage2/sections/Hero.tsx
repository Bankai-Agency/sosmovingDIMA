"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { Button } from "@/components/mainpage2/ui/Button";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import data from "@/data/mainpage2/homepage.json";

function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function YelpLogo() {
  return (
    <svg width="16" height="20" viewBox="0 0 24 24" fill="#FF1A1A" aria-hidden="true">
      <path d="M3.70463 11.591C3.33131 12.1645 3.17481 13.9682 3.30491 15.164C3.35016 15.5584 3.42558 15.8877 3.53305 16.0849C3.68201 16.3562 3.93278 16.519 4.21749 16.5281C4.40038 16.5371 4.51539 16.5064 7.95641 15.4444C7.95641 15.4444 9.48554 14.9759 9.49309 14.9722C9.87396 14.8782 10.1323 14.5417 10.1568 14.1129C10.1813 13.6715 9.9456 13.2825 9.55342 13.1432L8.47304 12.7217C4.77371 11.2581 4.60778 11.2002 4.42112 11.1984C4.13453 11.1894 3.88187 11.3269 3.70463 11.591ZM11.9782 22.4982C12.0385 22.3317 12.046 22.2178 12.0555 18.7479C12.0555 18.7479 12.063 17.2155 12.0649 17.1993C12.0894 16.823 11.8367 16.481 11.4219 16.3273C10.9939 16.1699 10.5339 16.2676 10.2756 16.5751C10.2756 16.5751 9.52137 17.4345 9.5176 17.4345C6.92694 20.3544 6.81758 20.4901 6.75536 20.6619C6.71576 20.7632 6.70256 20.8718 6.71388 20.9803C6.72896 21.1359 6.80249 21.2879 6.92316 21.4308C7.52464 22.1164 10.4057 23.1332 11.3258 22.9812C11.6482 22.9287 11.8801 22.7569 11.9782 22.4982ZM17.8251 21.2915C18.6943 20.9586 20.5892 18.6466 20.7231 17.7547C20.7702 17.4453 20.6684 17.1776 20.4459 17.0075C20.3007 16.9026 20.1895 16.861 16.7484 15.7773C16.7484 15.7773 15.2401 15.2997 15.2193 15.2906C14.8535 15.155 14.4368 15.2816 14.1578 15.6127C13.8655 15.9528 13.8222 16.4033 14.056 16.7416L14.6631 17.6895C16.7051 20.8718 16.8616 21.0961 17.0086 21.2065C17.2349 21.3783 17.5234 21.4073 17.8251 21.2915ZM16.047 13.0998C19.9557 12.1916 20.1084 12.1428 20.2611 12.0451C20.4987 11.8913 20.6175 11.6362 20.5967 11.3251C20.5967 11.316 20.5986 11.3052 20.5967 11.2943C20.4968 10.3717 18.8149 7.97639 17.9853 7.58743C17.6912 7.45174 17.3971 7.46079 17.1538 7.61818C17.003 7.71226 16.8917 7.85518 14.7989 10.6032C14.7989 10.6032 13.8542 11.8389 13.8429 11.8515C13.594 12.1428 13.5903 12.5589 13.8335 12.9171C14.0861 13.288 14.5123 13.4671 14.9026 13.3639C14.9026 13.3639 14.8875 13.3911 14.8837 13.3947C15.076 13.3241 15.4192 13.2427 16.047 13.0998ZM12.1233 10.0026C12.0555 8.5155 11.5898 1.89595 11.5351 1.5902C11.4559 1.3116 11.2296 1.11441 10.9053 1.03481C9.90601 0.797811 6.09166 1.82358 5.38461 2.5219C5.15646 2.74985 5.0735 3.02845 5.14138 3.2763C5.25262 3.4952 9.97954 10.6304 9.97954 10.6304C10.6772 11.7176 11.2485 11.5476 11.4351 11.4915C11.6199 11.439 12.1875 11.269 12.1233 10.0026Z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function Hero() {
  const { hero, company } = data;

  return (
    <section className="hero-switzer relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline poster="/mainpage2/videos/SOS-video-poster-00001.jpg" className="w-full h-full object-cover">
          <source src="/mainpage2/videos/bg-transcode.webm" type="video/webm" />
          <source src="/mainpage2/videos/bg-transcode.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/50 to-bg/90 z-10" />

      <Container className="relative z-20 flex-1 flex flex-col pt-28 sm:pt-32 md:pt-36 pb-10 md:pb-14">
        {/* TOP — title + taglines + CTA (left-aligned) */}
        <div className="flex flex-col items-start text-left gap-5 sm:gap-7 mt-auto mb-auto py-10 md:py-14">
          <h1 className="text-white" aria-label={hero.title}>
            <RevealText as="span" className="block" delay={0.6}>
              SOS Moving Company
            </RevealText>
            <RevealText
              as="span"
              className="block"
              delay={0.9}
              accentWords={["Los", "Angeles"]}
            >
              in Los Angeles
            </RevealText>
          </h1>

          {/* Animated tagline with cycling word */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-xl sm:text-2xl md:text-3xl font-medium text-white leading-[1.15] tracking-[-0.02em] text-left"
          >
            <span aria-hidden="true" className="inline-flex flex-wrap items-center justify-start gap-x-[0.3em]">
              Your move, made{" "}
              <ContainerTextFlip
                words={["easy", "fast", "stress-free", "affordable", "trusted"]}
                interval={3000}
                animationDuration={600}
              />
            </span>
            <span className="sr-only">
              Your move, made easy, fast, stress-free, affordable and trusted with SOS Moving.
            </span>
          </motion.p>

          {/* Subtitle — balanced wrapping */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="hero-subtitle text-text max-w-[38ch] text-balance"
          >
            {hero.subtitle}
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-2"
          >
            <Button href={hero.cta.href} className="w-full sm:w-auto">{hero.cta.text}</Button>
            <a href={`tel:${company.phoneRaw}`} className="group flex items-center gap-3 text-white hover:text-accent transition-colors">
              <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-border group-hover:border-accent flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </span>
              <span className="text-base sm:text-lg font-semibold">{company.phone}</span>
            </a>
          </motion.div>
        </div>

        {/* BOTTOM — stats row (left) + rating pills (right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-auto flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 pt-8"
        >
          {/* Stats — left */}
          <div className="flex flex-wrap items-center gap-x-8 sm:gap-x-12 gap-y-6">
            {[
              { value: "10,000+", label: "Successful Moves" },
              { value: "4.9", label: "Average Rating" },
              { value: "20+", label: "Serving Cities" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-6 sm:gap-10">
                <div className="text-left">
                  <div className="hero-stat-value text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-medium">
                    {stat.value}
                  </div>
                  <div className="hero-stat-label text-[0.6875rem] sm:text-xs text-text-muted mt-1.5">
                    {stat.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-10 sm:h-14 w-px bg-white/15 hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          {/* Rating pills — right of stats */}
          <div className="flex flex-wrap gap-3 lg:shrink-0 lg:pb-1">
            <a
              href={company.social.yelp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/25 hover:bg-black/55 transition-colors px-5 py-3 sm:px-6 sm:py-3.5"
            >
              <span className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <StarIcon key={i} size={16} />)}
              </span>
              <span className="text-white font-semibold text-base sm:text-lg">
                {company.rating.yelp.score}
                <span className="text-white/50 text-sm">/5</span>
              </span>
              <YelpLogo />
            </a>

            <a
              href={company.social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/25 hover:bg-black/55 transition-colors px-5 py-3 sm:px-6 sm:py-3.5"
            >
              <span className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <StarIcon key={i} size={16} />)}
              </span>
              <span className="text-white font-semibold text-base sm:text-lg">
                {company.rating.google.score}
                <span className="text-white/50 text-sm">/5</span>
              </span>
              <GoogleLogo />
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
