import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";

export function Benefits() {
  return (
    <section className="m3-section" id="services">
      <div className="m3-container">
        <Reveal className="m3-section-head">
          <Eyebrow num="01" total="06">
            Our Services
          </Eyebrow>
          <h2
            className="m3-text-h2"
            style={{ marginTop: "1rem", maxWidth: "20ch" }}
          >
            A full-stack moving operation,
            <br />
            built for {" "}
            <span style={{ color: "var(--m3-accent)" }}>any scale.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="m3-benefits-grid" style={{ marginTop: "3rem" }}>
            {data.services.map((service, i) => (
              <article key={service.slug} className="m3-benefit">
                <div className="m3-benefit-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt=""
                    className="m3-benefit-img"
                    loading="lazy"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span className="m3-benefit-num">
                    Service {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="m3-benefit-num"
                    style={{ color: "var(--m3-accent)" }}
                  >
                    ↗
                  </span>
                </div>
                <h3 className="m3-benefit-title">{service.title}</h3>
                <p className="m3-benefit-text">{service.description}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button href="/services" variant="ghost">
              View all services
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
