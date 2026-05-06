"use client";

import { useEffect, useRef } from "react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

/**
 * Gallery — uses Osmo Supply "Masonry Grid" 1:1.
 * Class names + data-* preserved. Adapted to dark palette + our 10 SOS photos
 * with a sprinkle of `is--square / is--wide / is--tall` aspect variants for
 * a balanced layout. Osmo JS layout engine runs in a useEffect.
 */

type Photo = { src: string; aspect?: "square" | "wide" | "tall" };
const PHOTOS: Photo[] = [
  { src: "/mainpage2/images/Helpers-and-Truck.webp" },
  { src: "/mainpage2/images/Movers-Los-Angeles.avif", aspect: "wide" },
  { src: "/mainpage2/images/Burbank-Movers-1.jpg" },
  { src: "/mainpage2/images/SOS-Movers-Loading.webp", aspect: "square" },
  { src: "/mainpage2/images/Team_New.webp", aspect: "square" },
  { src: "/mainpage2/images/movers_sos.webp", aspect: "tall" },
  { src: "/mainpage2/images/Apartment-Movers.avif" },
  { src: "/mainpage2/images/Commercial-Movers.avif" },
  { src: "/mainpage2/images/Long-Distance-Movers-Los-Angeles.avif" },
  { src: "/mainpage2/images/Packers-and-movers.avif", aspect: "square" },
];

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = ref.current;
    if (!container) return;

    const shuffle = container.dataset.masonryShuffle !== "false";
    let cols = 4;
    let gapPx = 16;
    let colHeights: number[] = [];

    const getVars = () => {
      const cs = getComputedStyle(container);
      cols = parseInt(cs.getPropertyValue("--masonry-col")) || 4;
      const rawGap = cs.getPropertyValue("--masonry-gap").trim();
      if (rawGap.endsWith("px")) gapPx = parseFloat(rawGap);
      else if (rawGap.endsWith("em"))
        gapPx = parseFloat(rawGap) * parseFloat(cs.fontSize);
      else if (rawGap.endsWith("rem"))
        gapPx =
          parseFloat(rawGap) *
          parseFloat(getComputedStyle(document.documentElement).fontSize);
      else gapPx = parseFloat(rawGap) || 16;
    };

    const layout = () => {
      getVars();
      const wCalc = `(100% - ${cols - 1}*var(--masonry-gap)) / ${cols}`;
      colHeights = Array(cols).fill(0);
      container.style.position = "relative";
      const items = Array.from(container.children) as HTMLElement[];
      items.forEach((el) => {
        el.style.position = "absolute";
        el.style.width = `calc(${wCalc})`;
      });
      items.forEach((el, i) => {
        const h = el.offsetHeight;
        const idx = shuffle
          ? colHeights.indexOf(Math.min(...colHeights))
          : i % cols;
        el.style.top = `${colHeights[idx]}px`;
        el.style.left = `calc(${wCalc}*${idx} + var(--masonry-gap)*${idx})`;
        colHeights[idx] += h + gapPx;
      });
      container.style.height = `${Math.max(...colHeights)}px`;
    };

    const debounce = (fn: () => void, delay: number) => {
      let t: ReturnType<typeof setTimeout> | undefined;
      return () => {
        if (t) clearTimeout(t);
        t = setTimeout(fn, delay);
      };
    };

    const onResize = debounce(layout, 100);
    window.addEventListener("resize", onResize);

    const debouncedLayout = debounce(layout, 50);
    const imgLoad = () => {
      container.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", debouncedLayout, { once: true });
          img.addEventListener("error", debouncedLayout, { once: true });
        }
      });
    };

    layout();
    imgLoad();

    return () => {
      window.removeEventListener("resize", onResize);
      const items = Array.from(container.children) as HTMLElement[];
      items.forEach((el) => {
        el.style.position = "";
        el.style.width = "";
        el.style.top = "";
        el.style.left = "";
      });
      container.style.position = "";
      container.style.height = "";
    };
  }, []);

  return (
    <section
      className="m3-section"
      id="gallery"
      style={{ borderTop: "1px solid var(--m3-border)" }}
    >
      <div className="m3-container">
        <Reveal>
          <Eyebrow num="08" total="08">From the field</Eyebrow>
          <h2 className="m3-text-h2" style={{ marginTop: "1rem", maxWidth: "22ch" }}>
            Real crews,{" "}
            <span style={{ color: "var(--m3-accent)" }}>real moves</span>,
            shot on the job.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="masonry-wrap" style={{ marginTop: "3rem" }}>
            <div className="masonry-collection">
              <div data-masonry-list="" className="masonry-list" ref={ref}>
                {PHOTOS.map((p, i) => (
                  <div key={p.src + i} className="masonry-item">
                    <div
                      className={`masonry-item__visual${p.aspect ? ` is--${p.aspect}` : ""}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.src}
                        alt=""
                        loading="lazy"
                        className="masonry-item__visual-img"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
