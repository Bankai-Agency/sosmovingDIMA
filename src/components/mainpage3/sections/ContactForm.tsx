"use client";

import { useState } from "react";
import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

const SERVICES = [
  "Local Move",
  "Long Distance",
  "Apartment Move",
  "Commercial Move",
  "Packing",
  "Storage",
];

export function ContactForm() {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (s: string) =>
    setPicked((p) =>
      p.includes(s) ? p.filter((x) => x !== s) : [...p, s],
    );

  return (
    <section className="m3-section" id="contact" style={{ borderTop: "1px solid var(--m3-border)" }}>
      <div className="m3-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
          }}
        >
          <Reveal>
            <Eyebrow num="06" total="06">
              Get a quote
            </Eyebrow>
            <h2
              className="m3-text-h2"
              style={{ marginTop: "1rem", maxWidth: "20ch" }}
            >
              Take charge of your{" "}
              <span style={{ color: "var(--m3-accent)" }}>move.</span>
            </h2>
            <p
              className="m3-text-lead"
              style={{ marginTop: "1.5rem", maxWidth: "44ch" }}
            >
              Tell us a few details — we&rsquo;ll come back with a transparent
              hourly quote. No upsells, no callbacks at midnight.
            </p>
            <p
              className="m3-text-mono-sm"
              style={{
                marginTop: "1.5rem",
              }}
            >
              Or call directly:{" "}
              <a
                href={`tel:${data.company.phoneRaw}`}
                style={{ color: "var(--m3-text)" }}
              >
                {data.company.phone}
              </a>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              className="m3-form"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "/free-estimate";
              }}
            >
              <div className="m3-form-row">
                <div className="m3-form-field">
                  <label className="m3-form-field-label" htmlFor="m3-first">
                    First name
                  </label>
                  <input id="m3-first" type="text" placeholder="Jane" required />
                </div>
                <div className="m3-form-field">
                  <label className="m3-form-field-label" htmlFor="m3-last">
                    Last name
                  </label>
                  <input id="m3-last" type="text" placeholder="Doe" required />
                </div>
              </div>
              <div className="m3-form-row">
                <div className="m3-form-field">
                  <label className="m3-form-field-label" htmlFor="m3-email">
                    Email
                  </label>
                  <input
                    id="m3-email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
                <div className="m3-form-field">
                  <label className="m3-form-field-label" htmlFor="m3-phone">
                    Phone
                  </label>
                  <input
                    id="m3-phone"
                    type="tel"
                    placeholder="(909) 000-0000"
                    required
                  />
                </div>
              </div>

              <div className="m3-form-field">
                <label className="m3-form-field-label">
                  How can we help?
                </label>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {SERVICES.map((s) => {
                    const on = picked.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggle(s)}
                        style={{
                          height: "2.25rem",
                          padding: "0 1rem",
                          borderRadius: "999px",
                          background: on ? "var(--m3-accent)" : "transparent",
                          color: on
                            ? "var(--m3-accent-text)"
                            : "var(--m3-text-muted)",
                          border: `1px solid ${on ? "var(--m3-accent)" : "var(--m3-border-strong)"}`,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        className="m3-text-body"
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="m3-form-field">
                <label className="m3-form-field-label" htmlFor="m3-msg">
                  Tell us about the move
                </label>
                <textarea
                  id="m3-msg"
                  placeholder="From / to, approx size, target date…"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "1.75rem",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <span className="m3-text-mono-sm" style={{ color: "var(--m3-text-dim)", maxWidth: "32ch" }}>
                  By submitting you agree to be contacted about your request.
                </span>
                <Button onClick={() => {}} variant="primary">
                  Send request
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
