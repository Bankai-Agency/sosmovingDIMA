import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const STATS = [
  { value: "10K+",  label: "Moves completed" },
  { value: "4.9",   label: "Avg rating" },
  { value: "20+",   label: "Cities served" },
  { value: "2022",  label: "Founded" },
];

export function About() {
  return (
    <section
      className="m3-section"
      id="about"
      style={{ borderTop: "1px solid var(--m3-border)" }}
    >
      <div className="m3-container">
        <Reveal>
          <Eyebrow num="01" total="08">About</Eyebrow>
          <h2
            className="m3-text-h2"
            style={{ marginTop: "1rem", maxWidth: "22ch" }}
          >
            {data.about.title.split(" ").slice(0, -2).join(" ")}{" "}
            <span style={{ color: "var(--m3-accent)" }}>
              {data.about.title.split(" ").slice(-2).join(" ")}
            </span>
          </h2>
        </Reveal>

        {/* 2-col body: text left, photo right — same shape as BestMovers / Coverage */}
        <div
          style={{
            marginTop: "3rem",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="m3-about-grid"
        >
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "44ch" }}>
              <p className="m3-text-lead">{data.about.text}</p>
              <p className="m3-text-body" style={{ color: "var(--m3-text-muted)" }}>
                {data.about.text2}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              style={{
                aspectRatio: "4 / 5",
                overflow: "hidden",
                background: "var(--m3-surface)",
                border: "1px solid var(--m3-border)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.about.images[0]}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </Reveal>
        </div>

        {/* Stats row — hairline-separated mono+display, matches the
            numbered hairline patterns used in BestMovers and Coverage. */}
        <Reveal delay={0.2}>
          <div
            style={{
              marginTop: "4rem",
              display: "grid",
              gridTemplateColumns: "1fr",
              borderTop: "1px solid var(--m3-border)",
            }}
            className="m3-about-stats"
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "1.75rem 0",
                  borderBottom: "1px solid var(--m3-border)",
                  display: "grid",
                  gridTemplateColumns: "minmax(50px, 0.1fr) 1fr 1fr",
                  gap: "2rem",
                  alignItems: "baseline",
                }}
              >
                <span className="m3-text-mono-sm" style={{ color: "var(--m3-text-dim)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="m3-text-h3" style={{ fontFeatureSettings: '"tnum" 1' }}>
                  {s.value}
                </span>
                <span className="m3-text-mono-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
