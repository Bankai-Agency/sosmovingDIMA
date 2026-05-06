"use client";

import { useRef, useState } from "react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";

/**
 * Real client video reviews — paired with the actual thumbnails used on
 * www.sosmovingla.net main page (the "Video reviews" gallery: 7 cards with
 * play-button overlay) and our own real client mp4s pulled from
 * /public/pages/about-us__video-reviews.html (vidzflow CDN).
 *
 * Behaviour matches the live site: thumbnail is shown by default with a
 * yellow play button; click → video starts playing inline (with sound),
 * play button hides, click again → pauses.
 */

type VR = { name: string; thumb: string; video: string };

const REVIEWS: VR[] = [
  {
    name: "Jamon Pulliam",
    thumb:
      "https://cdn.prod.website-files.com/645ab1d97922876b775bef4f/68c39e07cb47e42f29ba66d2_%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-09-12%20%D0%B2%2009.13.44.avif",
    video: "https://r2.vidzflow.com/source/5b5cbf96-db19-4732-8bba-7dceab2d83fc.mp4",
  },
  {
    name: "Kelsey Fawley",
    thumb:
      "https://cdn.prod.website-files.com/645ab1d97922876b775bef4f/69986b201af6a22822c0fe3e_d46dd17eadf5da9729dee2de4e465e7242910907.avif",
    video: "https://r2.vidzflow.com/source/933d532c-499a-4c54-91f3-aa95c70fb88d.mp4",
  },
  {
    name: "Nicole Lai",
    thumb:
      "https://cdn.prod.website-files.com/645ab1d97922876b775bef4f/68bacad026bb9ca4438fdbf7_%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-09-05%20%D0%B2%2016.29.40.avif",
    video: "https://r2.vidzflow.com/source/e521d544-6e8c-4872-8973-f76abf9753db.mp4",
  },
  {
    name: "Vish Saheb",
    thumb:
      "https://cdn.prod.website-files.com/645ab1d97922876b775bef4f/68bacad0b6106f8eeda4582c_%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-09-05%20%D0%B2%2016.33.07.avif",
    video: "https://r2.vidzflow.com/source/1d54ff12-48e2-4072-aa05-c726392edc56.mp4",
  },
  {
    name: "Suhaila Meera",
    thumb:
      "https://cdn.prod.website-files.com/645ab1d97922876b775bef4f/68bac95802c97c7a6ed13ffc_%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-09-05%20%D0%B2%2016.27.54.avif",
    video: "https://r2.vidzflow.com/source/6c523574-289a-4884-af47-36bde27848b8.mp4",
  },
  {
    name: "Malia F.",
    thumb:
      "https://cdn.prod.website-files.com/645ab1d97922876b775bef4f/68bacad04087513e2b79aab3_%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-09-05%20%D0%B2%2016.30.48.avif",
    video: "https://r2.vidzflow.com/source/45c71a7f-50f5-4adf-8512-ace2d73a4de9.mp4",
  },
  {
    name: "Rita G.",
    thumb:
      "https://cdn.prod.website-files.com/645ab1d97922876b775bef4f/68bac8e7c86b2a73d2dd3146_%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202025-09-05%20%D0%B2%2016.26.08.avif",
    video: "https://r2.vidzflow.com/source/8a7e833b-a345-4120-9885-b88ecc29d9e2.mp4",
  },
];

function VideoCard({ r }: { r: VR }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      style={{
        flex: "0 0 auto",
        width: "clamp(260px, 26vw, 360px)",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
      }}
    >
      <button
        type="button"
        onClick={toggle}
        style={{
          aspectRatio: "9 / 16",
          overflow: "hidden",
          borderRadius: 8,
          background: "var(--m3-surface)",
          position: "relative",
          border: "none",
          padding: 0,
          cursor: "pointer",
          isolation: "isolate",
        }}
        aria-label={`Play video review by ${r.name}`}
      >
        <video
          ref={videoRef}
          src={r.video}
          poster={r.thumb}
          loop
          playsInline
          preload="metadata"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Play / Pause overlay */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: playing
              ? "linear-gradient(to top, rgba(0,0,0,0.45), transparent 35%)"
              : "rgba(0,0,0,0.18)",
            transition: "background 0.3s ease",
          }}
        >
          {!playing && (
            <span
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "var(--m3-accent)",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 10px 32px rgba(0,0,0,0.35)",
                transition: "transform 0.25s ease",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="var(--m3-accent-text)"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          )}
        </span>
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="m3-text-body" style={{ fontWeight: 500 }}>{r.name}</span>
        <span className="m3-text-mono-sm" style={{ color: "var(--m3-text-dim)" }}>Video review</span>
      </div>
    </div>
  );
}

export function VideoReviews() {
  return (
    <section
      id="video-reviews"
      style={{
        padding: "clamp(4rem, 8vw, 7.5rem) 0",
        borderTop: "1px solid var(--m3-border)",
      }}
    >
      <div className="m3-container" style={{ padding: "0 var(--m3-pad-x)" }}>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <div>
              <Eyebrow num="07" total="08">Real moves</Eyebrow>
              <h2
                className="m3-text-h2"
                style={{ marginTop: "1rem", maxWidth: "22ch" }}
              >
                Watch{" "}
                <span style={{ color: "var(--m3-accent)" }}>real clients</span>{" "}
                tell their move story.
              </h2>
            </div>
            <Button href="/about-us/video-reviews" variant="ghost">
              Watch all video reviews
            </Button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div
          style={{
            marginTop: "3rem",
            overflowX: "auto",
            overflowY: "hidden",
            paddingLeft: "var(--m3-pad-x)",
            paddingRight: "var(--m3-pad-x)",
            scrollSnapType: "x mandatory",
          }}
        >
          <div style={{ display: "flex", gap: "1.25rem", paddingBottom: "1rem" }}>
            {REVIEWS.map((r) => (
              <VideoCard key={r.video} r={r} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
