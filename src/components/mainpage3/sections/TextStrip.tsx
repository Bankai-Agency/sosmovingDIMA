import { Eyebrow } from "../ui/Eyebrow";

/**
 * Short text-only manifesto strip — sits between two media-heavy sections
 * (ImagineMove and HorizontalScroll) as a reading breather.
 */
export function TextStrip() {
  return (
    <section
      style={{
        padding: "clamp(4rem, 8vw, 7rem) var(--m3-pad-x)",
        borderTop: "1px solid var(--m3-border)",
        borderBottom: "1px solid var(--m3-border)",
      }}
    >
      <div className="m3-container m3-container--narrow" style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex" }}>
          <Eyebrow withDot>Manifesto</Eyebrow>
        </div>
        <p
          className="m3-text-h3"
          style={{
            marginTop: "1.5rem",
            maxWidth: "44ch",
            marginLeft: "auto",
            marginRight: "auto",
            color: "var(--m3-text)",
          }}
        >
          We rebuilt local moving from the ground up — transparent hourly
          pricing, background-checked crews, trucks that actually arrive on time.
          Just{" "}
          <span style={{ color: "var(--m3-accent)" }}>one seamless system</span>{" "}
          from your old door to your new one.
        </p>
      </div>
    </section>
  );
}
