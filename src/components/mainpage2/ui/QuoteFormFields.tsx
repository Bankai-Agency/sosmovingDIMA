"use client";

import { useState } from "react";
import { Button } from "@/components/mainpage2/ui/Button";
import data from "@/data/mainpage2/homepage.json";

const moveTypes = [
  { value: "local", label: "Local" },
  { value: "long-distance", label: "Long-distance" },
  { value: "apartment", label: "Apartment" },
  { value: "commercial", label: "Commercial" },
  { value: "packing", label: "Packing" },
] as const;

const INPUT_CLASS =
  "w-full h-[3.5rem] px-5 rounded-2xl bg-white/5 border-0 text-white text-[0.9375rem] placeholder:text-white/40 outline-none focus:bg-white/10 focus:ring-2 focus:ring-accent/60 transition-[background-color,box-shadow]";

/** Form body only — the caller owns the surrounding surface/card. */
export function QuoteFormFields({ submitLabel = "Get Free Quote" }: { submitLabel?: string }) {
  const [moveType, setMoveType] = useState<string>(moveTypes[0].value);
  const { company } = data;

  return (
    <form method="post" action="/api/quote" className="flex flex-col gap-6">
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
          placeholder="Phone"
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <div className="text-white text-sm md:text-base">
          What kind of move?
          <span className="text-accent ml-1">*</span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
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

      <div className="flex flex-col gap-3 mt-1">
        <label htmlFor="notes" className="text-white text-sm md:text-base">
          Any special items or requirements?
        </label>
        <textarea
          id="notes"
          name="notes"
          maxLength={5000}
          placeholder="Just leave a few notes about what you're looking for..."
          className="w-full min-h-32 px-5 pt-4 pb-2 rounded-2xl bg-white/5 border-0 text-white text-[0.9375rem] placeholder:text-white/40 outline-none focus:bg-white/10 focus:ring-2 focus:ring-accent/60 resize-none transition-[background-color,box-shadow]"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-2">
        <Button type="submit">{submitLabel}</Button>
        <p className="text-[0.8125rem] text-text-muted leading-relaxed max-w-md">
          By clicking «{submitLabel}», you agree to our{" "}
          <a
            href="/privacy-policy"
            className="text-white underline underline-offset-2 hover:text-accent"
          >
            privacy policy
          </a>
          . We&apos;ll contact you about your move with {company.name}.
        </p>
      </div>
    </form>
  );
}
