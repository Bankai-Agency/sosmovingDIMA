"use client";

import { useState } from "react";
import { Container } from "@/components/mainpage2/ui/Container";
import data from "@/data/mainpage2/homepage.json";

const moveTypes = [
  { value: "local", label: "Local" },
  { value: "long-distance", label: "Long-distance" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
  { value: "packing", label: "Packing" },
] as const;

const INPUT_CLASS =
  "w-full h-[3.75rem] px-6 rounded-2xl bg-white/5 border-0 text-white text-[0.9375rem] placeholder:text-white/40 outline-none focus:bg-white/10 focus:ring-2 focus:ring-accent/60 transition-[background-color,box-shadow]";

export function QuoteForm() {
  const [moveType, setMoveType] = useState<string>(moveTypes[0].value);

  return (
    <section id="quote" className="py-20 md:py-32 relative">
      <Container>
        <div className="relative max-w-5xl mx-auto">
          {/* Decorative sticker — "$119/hr starting" */}
          <div className="absolute -top-6 right-2 sm:-top-8 sm:right-8 lg:-top-10 lg:-right-10 z-10 pointer-events-none select-none">
            <div className="grid place-items-center w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-accent text-accent-text rotate-[12deg] shadow-[0_10px_30px_rgba(255,229,51,0.2)]">
              <div className="flex flex-col items-center leading-none">
                <span className="font-mono font-bold text-[0.625rem] sm:text-xs tracking-[0.1em] uppercase opacity-70 mb-1">
                  starts at
                </span>
                <span className="font-bold text-2xl sm:text-4xl lg:text-5xl tracking-[-0.04em]">
                  $119
                </span>
                <span className="font-mono font-bold text-[0.625rem] sm:text-xs tracking-[0.1em] uppercase opacity-70 mt-1">
                  per hour
                </span>
              </div>
            </div>
          </div>

          {/* Form card — dark surface, rounded, 40px padding like .form */}
          <div className="rounded-[2rem] bg-surface border border-white/5 p-6 sm:p-10">
            <h2 className="text-[2rem] sm:text-5xl font-bold text-white leading-[1] tracking-[-0.03em] mb-8 sm:mb-10">
              Leave a request
            </h2>

            <form
              method="post"
              action="/api/quote"
              className="flex flex-col gap-6"
            >
              {/* 2×2 grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="First and last name"
                  className={INPUT_CLASS}
                />
                <input
                  type="text"
                  name="origin"
                  autoComplete="address-level1"
                  placeholder="Pickup address or ZIP"
                  className={INPUT_CLASS}
                />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className={INPUT_CLASS}
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  placeholder="Phone with messenger"
                  className={INPUT_CLASS}
                />
              </div>

              {/* Radio group — label + 5 options */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="text-white text-base">
                  What kind of move?
                  <span className="text-accent ml-1">*</span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {moveTypes.map((t) => {
                    const selected = moveType === t.value;
                    return (
                      <label
                        key={t.value}
                        className="group inline-flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="moveType"
                          value={t.value}
                          checked={selected}
                          onChange={() => setMoveType(t.value)}
                          className="sr-only"
                        />
                        {/* 20×20 radio: default 2px light-grey border, checked = 6px accent border, no inner dot */}
                        <span
                          className={`w-5 h-5 rounded-full transition-all ${
                            selected
                              ? "border-[6px] border-accent"
                              : "border-2 border-white/25 group-hover:border-white/60"
                          }`}
                          aria-hidden="true"
                        />
                        <span
                          className={`text-[0.9375rem] transition-colors ${
                            selected ? "text-white" : "text-text-muted group-hover:text-white"
                          }`}
                        >
                          {t.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Textarea */}
              <div className="flex flex-col gap-3 mt-2">
                <label htmlFor="notes" className="text-white text-base">
                  Any special items or requirements?
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  maxLength={5000}
                  placeholder="Just leave a few notes about what you're looking for..."
                  className="w-full min-h-40 px-6 pt-6 pb-2 rounded-2xl bg-white/5 border-0 text-white text-[0.9375rem] placeholder:text-white/40 outline-none focus:bg-white/10 focus:ring-2 focus:ring-accent/60 resize-none transition-[background-color,box-shadow]"
                />
              </div>

              {/* Submit + privacy */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 mt-4">
                <button
                  type="submit"
                  className="group inline-flex items-center justify-between gap-6 rounded-full bg-accent hover:bg-accent-hover text-accent-text pl-8 pr-6 h-14 font-semibold text-[0.9375rem] transition-colors whitespace-nowrap"
                >
                  Get Free Quote
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-accent-text text-accent transition-transform group-hover:translate-x-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
                <p className="text-[0.875rem] text-text-muted max-w-md leading-relaxed">
                  By clicking on the «Get Free Quote» button, you agree to our{" "}
                  <a href="/privacy-policy" className="text-white underline underline-offset-2 hover:text-accent">
                    privacy policy
                  </a>
                  . We&apos;ll contact you about your move with{" "}
                  {data.company.name}.
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
