import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const HEADS = [
  "A single solution.",
  "Easy, scalable operation.",
  "Rapid, repeatable ROI.",
];

export function Highlights() {
  // pick first 3 whySos entries — Terminal uses exactly 3 cells
  const cells = data.whySos.slice(0, 3);
  return (
    <section className="m3-section" id="process" style={{ paddingTop: 0 }}>
      <div className="m3-container">
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
            <Eyebrow num="02" total="06">
              Why SOS
            </Eyebrow>
            <h2 className="m3-text-h2" style={{ maxWidth: "22ch" }}>
              Every move handled by a team that
              <span style={{ color: "var(--m3-accent)" }}> shows up.</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="m3-three-col">
            {cells.map((cell, i) => (
              <div key={cell.title} className="m3-three-col-cell">
                <span className="m3-eyebrow">
                  <span className="m3-eyebrow-num">
                    0{i + 1}
                  </span>
                  <span>{HEADS[i]}</span>
                </span>
                <h3 className="m3-text-h3">{cell.title}</h3>
                <p className="m3-text-body" style={{ color: "var(--m3-text-muted)" }}>
                  {cell.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
