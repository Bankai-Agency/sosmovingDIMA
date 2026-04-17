import { FadeIn } from "@/components/mainpage2/ui/Animate";
import { Container } from "@/components/mainpage2/ui/Container";

const pressLogos = [
  { name: "AP News" },
  { name: "Business Insider" },
  { name: "NY Entrepreneur" },
];

export function Press() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <FadeIn>
          <p className="text-center text-sm text-text-muted mb-8 uppercase tracking-wider font-medium">
            As seen in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {pressLogos.map((logo) => (
              <span
                key={logo.name}
                className="text-text-muted text-lg font-semibold opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default"
              >
                {logo.name}
              </span>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
