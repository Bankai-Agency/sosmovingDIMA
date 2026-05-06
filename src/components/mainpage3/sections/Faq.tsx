"use client";

import { useEffect, useRef } from "react";
import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

/**
 * FAQ section — uses Osmo Supply "Accordion CSS Animation" 1:1.
 * data-* attributes and class names preserved exactly so Osmo's published
 * JS click-toggle logic ports straight into a useEffect.
 */
export function Faq() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const handler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const toggle = target.closest("[data-accordion-toggle]");
      if (!toggle) return;
      const single = toggle.closest("[data-accordion-status]") as HTMLElement | null;
      if (!single) return;
      const isActive = single.getAttribute("data-accordion-status") === "active";
      single.setAttribute("data-accordion-status", isActive ? "not-active" : "active");

      const closeSiblings =
        root.getAttribute("data-accordion-close-siblings") === "true";
      if (closeSiblings && !isActive) {
        root
          .querySelectorAll('[data-accordion-status="active"]')
          .forEach((sib) => {
            if (sib !== single) sib.setAttribute("data-accordion-status", "not-active");
          });
      }
    };
    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, []);

  return (
    <section className="m3-section" id="faq">
      <div className="m3-container">
        {/* Header — kept from previous Faq layout */}
        <Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
              marginBottom: "3rem",
              alignItems: "end",
            }}
            className="m3-faq-grid-head"
          >
            <div>
              <Eyebrow num="05" total="06">FAQ</Eyebrow>
              <h2 className="m3-text-h2" style={{ marginTop: "1rem", maxWidth: "22ch" }}>
                Common questions,
                <br />
                <span style={{ color: "var(--m3-accent)" }}>straightforward</span> answers.
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              <Button href={`tel:${data.company.phoneRaw}`} variant="primary">
                Call us
              </Button>
              <Button href="/free-estimate" variant="ghost">
                Write us
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            data-accordion-close-siblings="true"
            data-accordion-css-init=""
            className="accordion-css"
            ref={ref}
          >
            <ul className="accordion-css__list">
              {data.faq.map((item) => (
                <li
                  key={item.question}
                  data-accordion-status="not-active"
                  className="accordion-css__item"
                >
                  <div
                    data-hover=""
                    data-accordion-toggle=""
                    className="accordion-css__item-top"
                  >
                    <h3 className="accordion-css__item-h3">{item.question}</h3>
                    <div className="accordion-css__item-icon">
                      <svg
                        className="accordion-css__item-icon-svg"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        viewBox="0 0 36 36"
                        fill="none"
                      >
                        <path
                          d="M28.5 22.5L18 12L7.5 22.5"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeMiterlimit="10"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="accordion-css__item-bottom">
                    <div className="accordion-css__item-bottom-wrap">
                      <div className="accordion-css__item-bottom-content">
                        <p className="accordion-css__item-p">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
