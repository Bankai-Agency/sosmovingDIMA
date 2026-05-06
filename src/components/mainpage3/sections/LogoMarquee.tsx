import { Eyebrow } from "../ui/Eyebrow";

const TRUST = [
  "USDOT 3398018",
  "CAL-T 0192140",
  "MC 1153871",
  "Yelp · 4.9 / 5",
  "Google · 4.98 / 5",
  "BBB Accredited",
  "AMSA Member",
  "Cal PUC Approved",
];

export function LogoMarquee() {
  return (
    <section style={{ paddingTop: "3rem" }}>
      <div className="m3-container" style={{ padding: "0 var(--m3-pad-x)" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <Eyebrow withDot>Licensed, insured & accredited</Eyebrow>
        </div>
      </div>
      <div className="m3-logo-row">
        <div className="m3-logo-row-track animate-marquee-left">
          {[...TRUST, ...TRUST, ...TRUST].map((label, i) => (
            <span key={i} className="m3-text-mono-sm">
              {label}
              <span style={{ marginLeft: "4rem", color: "var(--m3-text-dim)" }}>
                ◇
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
