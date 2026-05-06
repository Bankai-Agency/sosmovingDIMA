import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const HIGHLIGHTS = [
  {
    title: "5,000+ five-star reviews",
    text: "4.9 average rating across Google, Yelp, BBB and Thumbtack.",
  },
  {
    title: "Background-checked crews",
    text: "Every mover is uniformed, trained and vetted — no day-laborers.",
  },
  {
    title: "Owned trucks, owned gear",
    text: "Padded blankets, dollies, e-track straps — never a U-Haul rental.",
  },
  {
    title: "Same-day estimates",
    text: "Reply within an hour, lock the rate, no surprise add-ons later.",
  },
];

export function BestMovers() {
  return (
    <section
      className="m3-section"
      id="local-experts"
      style={{ borderTop: "1px solid var(--m3-border)" }}
    >
      <div className="m3-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
          }}
        >
          <Reveal>
            <Eyebrow num="02" total="08">
              Local experts
            </Eyebrow>
            <h2
              className="m3-text-h2"
              style={{ marginTop: "1rem", maxWidth: "22ch" }}
            >
              We&apos;ve been moving Los Angeles{" "}
              <span style={{ color: "var(--m3-accent)" }}>since 2022</span>.
            </h2>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1px",
              background: "var(--m3-border)",
              borderTop: "1px solid var(--m3-border)",
              borderBottom: "1px solid var(--m3-border)",
            }}
          >
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.05}>
                <div
                  style={{
                    background: "var(--m3-bg)",
                    padding: "2rem 0",
                    display: "grid",
                    gridTemplateColumns: "minmax(60px, 0.2fr) 1fr 1fr",
                    gap: "2rem",
                    alignItems: "start",
                  }}
                >
                  <span className="m3-text-mono-sm" style={{ color: "var(--m3-text-dim)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m3-text-h3" style={{ maxWidth: "18ch" }}>
                    {h.title}
                  </h3>
                  <p className="m3-text-body" style={{ color: "var(--m3-text-muted)", maxWidth: "44ch" }}>
                    {h.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
