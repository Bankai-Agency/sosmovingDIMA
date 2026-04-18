"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { InView } from "@/components/core/in-view";

const galleryImages = [
  "/mainpage2/images/gallery-1.webp",
  "/mainpage2/images/Movers-and-truck.avif",
  "/mainpage2/images/gallery-2.webp",
  "/mainpage2/images/Helpers-and-Truck.webp",
  "/mainpage2/images/gallery-3.webp",
  "/mainpage2/images/SOS-Movers-Loading.webp",
  "/mainpage2/images/video-4.webp",
  "/mainpage2/images/Local-Moving-Hero-Img.avif",
  "/mainpage2/images/Commercial-Moving.avif",
  "/mainpage2/images/Packing-and-moving-service.avif",
];

export function Gallery() {
  return (
    <section id="gallery" className="py-20 md:py-32">
      <Container>
        <div className="text-center mb-10 sm:mb-14">
          <RevealText
            as="h2"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em]"
          >
            Gallery
          </RevealText>
          <p className="text-text-muted text-sm sm:text-base mt-4 max-w-xl mx-auto">
            SOS Moving and Storage photos — our employees, fleet of trucks, and jobs in progress.
          </p>
        </div>

        <InView
          viewOptions={{ once: true, margin: "0px 0px -250px 0px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.09 },
            },
          }}
        >
          <div className="columns-2 gap-4 sm:columns-3">
            {galleryImages.map((src, index) => (
              <motion.div
                key={src}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
                  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-4 break-inside-avoid"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`SOS Moving gallery ${index + 1}`}
                  loading="lazy"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </motion.div>
            ))}
          </div>
        </InView>
      </Container>
    </section>
  );
}
