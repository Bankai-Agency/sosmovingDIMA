"use client";

import Link from "next/link";
import data from "@/data/mainpage2/homepage.json";
import { Eyebrow } from "../ui/Eyebrow";
import { Button } from "../ui/Button";

/**
 * Ported from /mainpage2 Reviews — same 2-column layout (heading left,
 * dual vertical marquee right on desktop / dual horizontal marquee on mobile),
 * adapted to mainpage3 palette + Switzer typography.
 */

type Review = (typeof data.reviews)[number];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="var(--m3-accent)"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function SourceIcon({ source }: { source: string }) {
  if (source === "yelp") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3.70463 11.591C3.33131 12.1645 3.17481 13.9682 3.30491 15.164C3.35016 15.5584 3.42558 15.8877 3.53305 16.0849C3.68201 16.3562 3.93278 16.519 4.21749 16.5281C4.40038 16.5371 4.51539 16.5064 7.95641 15.4444C7.95641 15.4444 9.48554 14.9759 9.49309 14.9722C9.87396 14.8782 10.1323 14.5417 10.1568 14.1129C10.1813 13.6715 9.9456 13.2825 9.55342 13.1432L8.47304 12.7217C4.77371 11.2581 4.60778 11.2002 4.42112 11.1984C4.13453 11.1894 3.88187 11.3269 3.70463 11.591ZM11.9782 22.4982C12.0385 22.3317 12.046 22.2178 12.0555 18.7479C12.0555 18.7479 12.063 17.2155 12.0649 17.1993C12.0894 16.823 11.8367 16.481 11.4219 16.3273C10.9939 16.1699 10.5339 16.2676 10.2756 16.5751C10.2756 16.5751 9.52137 17.4345 9.5176 17.4345C6.92694 20.3544 6.81758 20.4901 6.75536 20.6619C6.71576 20.7632 6.70256 20.8718 6.71388 20.9803C6.72896 21.1359 6.80249 21.2879 6.92316 21.4308C7.52464 22.1164 10.4057 23.1332 11.3258 22.9812C11.6482 22.9287 11.8801 22.7569 11.9782 22.4982ZM17.8251 21.2915C18.6943 20.9586 20.5892 18.6466 20.7231 17.7547C20.7702 17.4453 20.6684 17.1776 20.4459 17.0075C20.3007 16.9026 20.1895 16.861 16.7484 15.7773C16.7484 15.7773 15.2401 15.2997 15.2193 15.2906C14.8535 15.155 14.4368 15.2816 14.1578 15.6127C13.8655 15.9528 13.8222 16.4033 14.056 16.7416L14.6631 17.6895C16.7051 20.8718 16.8616 21.0961 17.0086 21.2065C17.2349 21.3783 17.5234 21.4073 17.8251 21.2915ZM16.047 13.0998C19.9557 12.1916 20.1084 12.1428 20.2611 12.0451C20.4987 11.8913 20.6175 11.6362 20.5967 11.3251C20.5967 11.316 20.5986 11.3052 20.5967 11.2943C20.4968 10.3717 18.8149 7.97639 17.9853 7.58743C17.6912 7.45174 17.3971 7.46079 17.1538 7.61818C17.003 7.71226 16.8917 7.85518 14.7989 10.6032C14.7989 10.6032 13.8542 11.8389 13.8429 11.8515C13.594 12.1428 13.5903 12.5589 13.8335 12.9171C14.0861 13.288 14.5123 13.4671 14.9026 13.3639C14.9026 13.3639 14.8875 13.3911 14.8837 13.3947C15.076 13.3241 15.4192 13.2427 16.047 13.0998Z" />
      </svg>
    );
  }
  if (source === "google") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    );
  }
  return null;
}

function ReviewCard({ review, href }: { review: Review; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: "var(--m3-surface)",
        borderRadius: "1rem",
        padding: "1.75rem",
        border: "1px solid var(--m3-border)",
        transition: "border-color 0.2s ease",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.image}
            alt={review.name}
            width={56}
            height={56}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minWidth: 0,
              flex: 1,
            }}
          >
            <div className="m3-text-h3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {review.name}
            </div>
            <div className="m3-text-mono-sm" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {review.city}
            </div>
          </div>
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              color: "var(--m3-text)",
              flexShrink: 0,
            }}
          >
            <SourceIcon source={review.source} />
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <StarRating count={review.rating} />
          <p className="m3-text-body">
            &ldquo;{review.text}&rdquo;
          </p>
        </div>
      </div>
    </Link>
  );
}

export function Reviews() {
  const { reviews, company } = data;
  const socialUrls = company.social as Record<string, string>;
  const urlFor = (source: string) => socialUrls[source] ?? "#";
  const loopA = [...reviews, ...reviews];
  const loopB = [...reviews.slice().reverse(), ...reviews.slice().reverse()];

  return (
    <section
      id="reviews"
      style={{
        padding: "clamp(4rem, 8vw, 7.5rem) var(--m3-pad-x)",
        borderTop: "1px solid var(--m3-border)",
        overflow: "hidden",
      }}
    >
      <div className="m3-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "center",
          }}
          className="m3-reviews-grid"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Eyebrow num="06" total="08">Reviews</Eyebrow>
            <h2 className="m3-text-h2" style={{ maxWidth: "16ch" }}>
              More than{" "}
              <span style={{ color: "var(--m3-accent)" }}>5,000 satisfied</span>{" "}
              customers.
            </h2>
            <div>
              <Button href="/about-us/reviews" variant="ghost">
                View all reviews
              </Button>
            </div>
          </div>

          {/* Mobile: 2 horizontal marquees */}
          <div
            className="m3-reviews-mobile"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              overflow: "hidden",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
            }}
          >
            <div
              className="animate-marquee-left"
              style={{
                display: "flex",
                gap: "0.75rem",
                whiteSpace: "nowrap",
                animationDuration: "20s",
              }}
            >
              {[...reviews, ...reviews, ...reviews].map((r, i) => (
                <div
                  key={`ma-${i}`}
                  style={{ flex: "0 0 auto", width: "82vw", whiteSpace: "normal" }}
                >
                  <ReviewCard review={r} href={urlFor(r.source)} />
                </div>
              ))}
            </div>
            <div
              className="animate-marquee-right"
              style={{
                display: "flex",
                gap: "0.75rem",
                whiteSpace: "nowrap",
                animationDuration: "20s",
              }}
            >
              {[...reviews.slice().reverse(), ...reviews.slice().reverse(), ...reviews.slice().reverse()].map(
                (r, i) => (
                  <div
                    key={`mb-${i}`}
                    style={{ flex: "0 0 auto", width: "82vw", whiteSpace: "normal" }}
                  >
                    <ReviewCard review={r} href={urlFor(r.source)} />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Desktop: 2 vertical marquee columns */}
          <div
            className="m3-reviews-desktop"
            style={{
              display: "none",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              height: "680px",
              position: "relative",
              overflow: "hidden",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="animate-marquee-down"
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0 }}
              >
                {loopA.map((r, i) => (
                  <ReviewCard key={`a-${i}`} review={r} href={urlFor(r.source)} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="animate-marquee-up"
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0 }}
              >
                {loopB.map((r, i) => (
                  <ReviewCard key={`b-${i}`} review={r} href={urlFor(r.source)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
