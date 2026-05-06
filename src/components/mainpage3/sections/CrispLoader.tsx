"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Osmo Supply "Crisp Loading Animation" — adapted to React.
 * Plays once on every mount (no sessionStorage flag).
 *
 * Substitutions vs original:
 *  - GSAP SplitText (paid plugin) → hand-rolled JSX word-mask spans
 *  - GSAP CustomEase (paid plugin) → built-in `expo.inOut`
 *  - Light bg #eaeaea → our dark var(--m3-bg)
 *  - Center scale-up image → our hero raster /frames_webp/frame_0001.webp
 *  - Tile images → 5 SOS Moving photos
 */

const HERO_IMG = "/frames_webp/frame_0001.webp";
const TILES = [
  "/mainpage2/images/Helpers-and-Truck.webp",
  "/mainpage2/images/SOS-Movers-Loading.webp",
  "/mainpage2/images/Movers-Los-Angeles.avif",
  "/mainpage2/images/Team_New.webp",
  "/mainpage2/images/movers_sos.webp",
];

const HEADLINE = "Move home in Los Angeles";

export function CrispLoader() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const heading = container.querySelectorAll<HTMLElement>(".crisp-header__h1 .word > span");
    const revealImages = container.querySelectorAll<HTMLElement>(".crisp-loader__group > *");
    const isScaleUp = container.querySelectorAll<HTMLElement>(".crisp-loader__media");
    const isScaleDown = container.querySelectorAll<HTMLElement>(".crisp-loader__media .is--scale-down");
    const isRadius = container.querySelectorAll<HTMLElement>(".crisp-loader__media.is--scaling.is--radius");
    const smallElements = container.querySelectorAll<HTMLElement>(
      ".crisp-header__top, .crisp-header__p",
    );

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onStart: () => container.classList.remove("is--hidden"),
    });

    if (revealImages.length) {
      tl.fromTo(
        revealImages,
        { xPercent: 500 },
        { xPercent: -500, duration: 2.5, stagger: 0.05 },
      );
    }

    if (isScaleDown.length) {
      tl.to(
        isScaleDown,
        {
          scale: 0.5,
          duration: 2,
          stagger: { each: 0.05, from: "edges", ease: "none" },
          onComplete: () => isRadius.forEach((el) => el.classList.remove("is--radius")),
        },
        "-=0.1",
      );
    }

    if (isScaleUp.length) {
      tl.fromTo(
        isScaleUp,
        { width: "10em", height: "10em" },
        { width: "100vw", height: "100dvh", duration: 2 },
        "< 0.5",
      );
    }

    if (heading.length) {
      tl.to(
        heading,
        { yPercent: 0, stagger: 0.075, ease: "expo.out", duration: 1 },
        "< 0.1",
      );
    }

    if (smallElements.length) {
      tl.from(
        smallElements,
        { opacity: 0, ease: "power1.inOut", duration: 0.2 },
        "< 0.15",
      );
    }

    tl.call(
      () => {
        container.classList.remove("is--loading");
        document.body.style.overflow = "";
      },
      undefined,
      "+=0.45",
    );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  // The relative group has 5 tiles, with the centre tile being the scale-up
  // hero image. is--scale-down on the 4 surrounding tiles, is--scaling.is--radius
  // on the center one.
  const relativeGroup = TILES.map((src, i) => {
    const isCenter = i === 2;
    return { src: isCenter ? HERO_IMG : src, isCenter };
  });

  return (
    <section
      ref={ref}
      data-slideshow="wrap"
      className="crisp-header is--loading is--hidden"
      aria-hidden
    >
      <div className="crisp-loader">
        <div className="crisp-loader__wrap">
          <div className="crisp-loader__groups">
            <div className="crisp-loader__group is--duplicate">
              {TILES.map((src, i) => (
                <div key={`dup-${i}`} className="crisp-loader__single">
                  <div className="crisp-loader__media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="eager" src={src} alt="" className="crisp-loader__cover-img" />
                  </div>
                </div>
              ))}
            </div>
            <div className="crisp-loader__group is--relative">
              {relativeGroup.map(({ src, isCenter }, i) => (
                <div key={`rel-${i}`} className="crisp-loader__single">
                  <div
                    className={
                      isCenter
                        ? "crisp-loader__media is--scaling is--radius"
                        : "crisp-loader__media"
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      loading="eager"
                      src={src}
                      alt=""
                      className={
                        isCenter
                          ? "crisp-loader__cover-img"
                          : "crisp-loader__cover-img is--scale-down"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="crisp-loader__fade" />
          <div className="crisp-loader__fade is--duplicate" />
        </div>
      </div>

      {/* Heading appears as the loader resolves; words are pre-translated 110% */}
      <div className="crisp-header__content">
        <div className="crisp-header__center">
          <h1 className="crisp-header__h1">
            {HEADLINE.split(" ").map((w, i) => (
              <span key={i} className="word">
                <span>{w}</span>
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
}
