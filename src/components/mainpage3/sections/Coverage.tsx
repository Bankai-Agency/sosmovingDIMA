import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

export function Coverage() {
  return (
    <section className="m3-section" id="coverage">
      <div className="m3-container">
        <Reveal>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "3rem",
            }}
          >
            <Eyebrow num="04" total="06">
              Service Areas
            </Eyebrow>
            <h2 className="m3-text-h2" style={{ maxWidth: "22ch" }}>
              Coverage across SoCal,
              <br />
              <span style={{ color: "var(--m3-accent)" }}>
                {data.serviceAreas.length} regions
              </span>{" "}
              and growing.
            </h2>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            borderTop: "1px solid var(--m3-border)",
          }}
        >
          {data.serviceAreas.map((region, i) => (
            <Reveal key={region.region} delay={i * 0.04}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 0.4fr) 1fr",
                  gap: "2rem",
                  padding: "2rem 0",
                  borderBottom: "1px solid var(--m3-border)",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <span className="m3-text-mono-sm" style={{ color: "var(--m3-text-dim)" }}>
                    Region {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="m3-text-h3">{region.region}</h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {region.cities.slice(0, 12).map((city) => (
                    <span
                      key={city}
                      className="m3-text-body"
                      style={{
                        display: "inline-flex",
                        height: "2rem",
                        padding: "0 0.875rem",
                        alignItems: "center",
                        borderRadius: "999px",
                        background: "var(--m3-surface)",
                        color: "var(--m3-text-muted)",
                      }}
                    >
                      {city}
                    </span>
                  ))}
                  {region.cities.length > 12 && (
                    <span
                      className="m3-text-body"
                      style={{
                        display: "inline-flex",
                        height: "2rem",
                        padding: "0 0.875rem",
                        alignItems: "center",
                        color: "var(--m3-text-dim)",
                      }}
                    >
                      +{region.cities.length - 12} more
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
