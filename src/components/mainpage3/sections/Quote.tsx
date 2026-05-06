import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";

export function Quote() {
  // pick the first highlighted review — Terminal uses one big editorial pull-quote
  const r = data.reviews[0];
  return (
    <section className="m3-quote" id="reviews">
      <div
        className="m3-quote-bg"
        style={{
          backgroundImage: `url(/mainpage2/images/Movers-Los-Angeles.avif)`,
        }}
        aria-hidden
      />
      <div className="m3-quote-inner">
        <Eyebrow num="03" total="06">
          What clients say
        </Eyebrow>
        <p className="m3-quote-text">&ldquo;{r.text}&rdquo;</p>
        <div className="m3-quote-cite">
          <span className="m3-quote-cite-name">{r.name}</span>
          <span>{r.city}</span>
        </div>
      </div>
    </section>
  );
}
