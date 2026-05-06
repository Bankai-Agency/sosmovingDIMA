"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/mainpage2/homepage.json";

/**
 * Osmo Supply "Stacking Cards Parallax" — 1:1 port to React.
 * One full-height card per FAQ item; later card slides over the previous,
 * previous parallaxes down (yPercent: 50). Class names + data-* preserved.
 *
 * NOTE: parent of <div class="stacking-cards__collection"> must NOT be
 * display: flex (per Osmo docs). Our <main> is block — OK.
 */
export function FaqStacking() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const root = ref.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>("[data-stacking-cards-item]");
    if (cards.length < 2) return;

    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, i) => {
      if (i === 0) return;
      const previousCard = cards[i - 1];
      if (!previousCard) return;
      const previousCardImage = previousCard.querySelector<HTMLElement>(
        "[data-stacking-cards-img]",
      );

      const tl = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(previousCard, { yPercent: 0 }, { yPercent: 50 });
      if (previousCardImage) {
        tl.fromTo(
          previousCardImage,
          { rotate: 0, yPercent: 0 },
          { rotate: -5, yPercent: -25 },
          "<",
        );
      }
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section id="faq" ref={ref}>
      <div className="stacking-cards__collection">
        <div className="stacking-cards__list">
          {data.faq.map((item, i) => {
            const shade = `is--shade-${(i % 5) + 1}`;
            return (
              <div
                key={item.question}
                data-stacking-cards-item=""
                className={`stacking-cards__item ${shade}`}
              >
                <div className="stacking-cards__item-top">
                  <span className="stacking-card__top-span">FAQ</span>
                  <span className="stacking-card__top-span">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(data.faq.length).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="stacking-cards__item-h">
                  <span className="stacking-card__heading-faded">
                    Question {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.question}
                </h2>
                <p className="stacking-cards__item-answer">{item.answer}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
