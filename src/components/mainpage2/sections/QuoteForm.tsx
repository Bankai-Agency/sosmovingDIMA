"use client";

import { Container } from "@/components/mainpage2/ui/Container";
import { SectionLabel } from "@/components/mainpage2/ui/SectionLabel";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { QuoteFormFields } from "@/components/mainpage2/ui/QuoteFormFields";
import data from "@/data/mainpage2/homepage.json";

export function QuoteForm() {
  const { company } = data;

  return (
    <section id="quote" className="py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          {/* LEFT — eyebrow + H2 + blurb (sticky on desktop) */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <SectionLabel>Get in touch</SectionLabel>
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold leading-[0.95] tracking-[-0.04em]"
            >
              Leave a request
            </RevealText>
            <p className="text-base md:text-lg leading-[1.55] opacity-70 max-w-[44ch]">
              Tell us a little about your move. A coordinator replies within an
              hour with a personalized estimate — no hidden fees, nothing to sign.
            </p>
            <div className="mt-2 flex flex-col gap-3 text-sm md:text-base">
              <a
                href={`tel:${company.phoneRaw}`}
                className="group inline-flex items-center gap-3 font-medium hover:opacity-60 transition-opacity"
              >
                <span className="grid place-items-center h-9 w-9 rounded-full bg-[#151414] text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="group inline-flex items-center gap-3 font-medium hover:opacity-60 transition-opacity"
              >
                <span className="grid place-items-center h-9 w-9 rounded-full bg-[#151414] text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                {company.email}
              </a>
            </div>
          </div>

          {/* RIGHT — form card (dark surface) */}
          <div className="rounded-[2rem] bg-surface border border-white/5 p-6 sm:p-8 md:p-10 text-white">
            <QuoteFormFields />
          </div>
        </div>
      </Container>
    </section>
  );
}
