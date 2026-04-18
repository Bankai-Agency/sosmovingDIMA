"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/mainpage2/ui/Button";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import ImageTrail from "@/components/core/image-trail";

const trailImages = [
  "/mainpage2/images/gallery-1.webp",
  "/mainpage2/images/gallery-2.webp",
  "/mainpage2/images/gallery-3.webp",
  "/mainpage2/images/Movers-and-truck.avif",
  "/mainpage2/images/Helpers-and-Truck.webp",
  "/mainpage2/images/SOS-Movers-Loading.webp",
  "/mainpage2/images/video-4.webp",
  "/mainpage2/images/Local-Moving-Hero-Img.avif",
];

export function BottomCta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Image moves slower than page for parallax feel
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      id="bottom-cta"
      className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-10"
    >
      <div
        ref={ref}
        className="relative mx-auto w-full max-w-[90rem] overflow-hidden rounded-2xl sm:rounded-3xl h-[92svh] min-h-[640px] max-h-[1100px]"
      >
        {/* Parallax image */}
        <motion.div
          style={{ y, willChange: "transform" }}
          className="absolute inset-x-0 top-[-15%] bottom-[-15%]"
        >
          <Image
            src="/mainpage2/images/Helpers-and-Truck.webp"
            alt="SOS Moving team loading a truck"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60" />

        {/* Mouse-trail images — behind content, only interactive inside card */}
        <div className="absolute inset-0 z-[1] pointer-events-auto">
          <ImageTrail items={trailImages} />
        </div>

        {/* Centered content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 sm:px-10">
          <h2
            className="text-white font-bold leading-[0.9] tracking-[-0.04em] text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8rem] mb-6 sm:mb-8 md:mb-10 inline-flex items-baseline justify-center gap-x-4 sm:gap-x-6 whitespace-nowrap"
            aria-label="Let's move — ready when you are"
          >
            <span>Let&rsquo;s</span>
            <ContainerTextFlip
              words={["move", "roll", "go", "pack"]}
              interval={3000}
              animationDuration={600}
            />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/90 text-base sm:text-lg max-w-xl mx-auto leading-[1.4] tracking-[-0.01em] mb-6 sm:mb-8"
          >
            From $119/hour with free protective materials. Get your personalized
            quote in under 5 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button href="/free-estimate">Get your free quote</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
