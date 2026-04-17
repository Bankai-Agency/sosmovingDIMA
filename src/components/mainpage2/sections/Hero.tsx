"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { Button } from "@/components/mainpage2/ui/Button";
import data from "@/data/mainpage2/homepage.json";

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function Hero() {
  const { hero, company } = data;

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden pb-8 sm:pb-12 md:pb-20">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline poster="/mainpage2/videos/SOS-video-poster-00001.jpg" className="w-full h-full object-cover">
          <source src="/mainpage2/videos/bg-transcode.webm" type="video/webm" />
          <source src="/mainpage2/videos/bg-transcode.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30 z-10" />

      {/* Giant watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none select-none"
      >
        <span className="text-[10rem] sm:text-[15rem] md:text-[25rem] lg:text-[40rem] font-bold text-white leading-none tracking-tighter">
          SOS
        </span>
      </motion.div>

      <Container className="relative z-20">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-end">
          {/* Left — heading */}
          <div className="lg:col-span-7">
            {/* Rating badges — horizontal scroll on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-xs sm:text-sm"
            >
              <a href={company.social.yelp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <StarIcon key={i} />)}</div>
                <span className="font-semibold text-white">{company.rating.yelp.score}</span>
                <span>Yelp</span>
              </a>
              <span className="text-border hidden sm:inline">|</span>
              <a href={company.social.google} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <StarIcon key={i} />)}</div>
                <span className="font-semibold text-white">{company.rating.google.score}</span>
                <span>Google</span>
              </a>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[5rem] font-bold text-white leading-[0.95] tracking-tight mb-6 sm:mb-8"
            >
              {hero.title.split(" ").map((word, i) => (
                <span key={i}>
                  {word === "Los" || word === "Angeles" ? (
                    <span className="text-accent">{word} </span>
                  ) : (
                    <>{word} </>
                  )}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-base sm:text-lg md:text-xl text-text max-w-xl mb-6 sm:mb-8 leading-relaxed"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Button href={hero.cta.href} size="lg" className="w-full sm:w-auto">{hero.cta.text}</Button>
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

          {/* Right — stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="lg:col-span-5 flex gap-6 sm:gap-8 lg:flex-col lg:gap-0 lg:items-end"
          >
            {[
              { value: "10,000+", label: "Moves Completed" },
              { value: "4.9", label: "Average Rating" },
              { value: "20+", label: "Cities Served" },
            ].map((stat) => (
              <div key={stat.label} className="lg:py-5 lg:w-full lg:text-right">
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-accent leading-none">{stat.value}</div>
                <div className="text-xs sm:text-sm text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>

      {/* Scroll line — hidden on mobile */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
        className="absolute bottom-0 left-8 md:left-12 w-px h-20 bg-gradient-to-b from-transparent to-accent z-20 origin-top hidden sm:block"
      />
    </section>
  );
}
