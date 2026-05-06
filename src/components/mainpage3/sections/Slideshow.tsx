"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Standalone slideshow — adapted from Osmo Supply's Parallax Image Gallery.
 * 5 SOS Moving photos with thumbnail nav at bottom; clicking a thumb
 * cross-pans the active slide horizontally with parallax (inner image moves
 * at half speed in the opposite direction).
 *
 * Sits between Benefits and BestMovers as a media-breather between two
 * text-heavy sections.
 */

type Slide = { src: string; caption: string };

const SLIDES: Slide[] = [
  { src: "/mainpage2/images/Helpers-and-Truck.webp",                caption: "Trucks & crew" },
  { src: "/mainpage2/images/SOS-Movers-Loading.webp",               caption: "Load-in" },
  { src: "/mainpage2/images/Movers-Los-Angeles.avif",               caption: "On the road" },
  { src: "/mainpage2/images/Team_New.webp",                         caption: "Our team" },
  { src: "/mainpage2/images/Long-Distance-Movers-Los-Angeles.avif", caption: "Long-distance moves" },
];

export function Slideshow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const animatingRef = useRef(false);

  const navigate = (target: number) => {
    if (animatingRef.current || target === current) return;
    const root = sectionRef.current;
    if (!root) return;
    animatingRef.current = true;
    const direction = target > current ? 1 : -1;

    const slides = root.querySelectorAll<HTMLElement>(".m3-slideshow__slide");
    const inners = root.querySelectorAll<HTMLImageElement>(".m3-slideshow__slide img");
    const previous = current;

    const currentSlide = slides[previous];
    const upcomingSlide = slides[target];
    const currentInner = inners[previous];
    const upcomingInner = inners[target];

    upcomingSlide.classList.add("is--current");

    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "expo.inOut" },
      onComplete: () => {
        currentSlide.classList.remove("is--current");
        animatingRef.current = false;
        setCurrent(target);
      },
    });
    tl.to(currentSlide, { xPercent: -direction * 100 }, 0)
      .to(currentInner, { xPercent: direction * 50 }, 0)
      .fromTo(upcomingSlide, { xPercent: direction * 100 }, { xPercent: 0 }, 0)
      .fromTo(upcomingInner, { xPercent: -direction * 50 }, { xPercent: 0 }, 0);
  };

  return (
    <section className="m3-slideshow" ref={sectionRef}>
      <div className="m3-slideshow__list">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className={`m3-slideshow__slide${i === current ? " is--current" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.caption} loading={i < 2 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>
      <div className="m3-slideshow__overlay" aria-hidden />
      <div className="m3-slideshow__caption">
        <h3>{SLIDES[current].caption}</h3>
      </div>
      <div className="m3-slideshow__nav">
        {SLIDES.map((s, i) => (
          <button
            key={s.src + i}
            type="button"
            className={`m3-slideshow__nav-btn${i === current ? " is--current" : ""}`}
            onClick={() => navigate(i)}
            aria-label={`View ${s.caption}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </section>
  );
}
