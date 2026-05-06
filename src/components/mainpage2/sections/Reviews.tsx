"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/mainpage2/ui/Container";
import { RevealText } from "@/components/mainpage2/ui/RevealText";
import { Button } from "@/components/mainpage2/ui/Button";
import data from "@/data/mainpage2/homepage.json";

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {[...Array(count)].map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

type Review = (typeof data.reviews)[number];

function SourceIcon({ source }: { source: string }) {
  if (source === "yelp") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3.70463 11.591C3.33131 12.1645 3.17481 13.9682 3.30491 15.164C3.35016 15.5584 3.42558 15.8877 3.53305 16.0849C3.68201 16.3562 3.93278 16.519 4.21749 16.5281C4.40038 16.5371 4.51539 16.5064 7.95641 15.4444C7.95641 15.4444 9.48554 14.9759 9.49309 14.9722C9.87396 14.8782 10.1323 14.5417 10.1568 14.1129C10.1813 13.6715 9.9456 13.2825 9.55342 13.1432L8.47304 12.7217C4.77371 11.2581 4.60778 11.2002 4.42112 11.1984C4.13453 11.1894 3.88187 11.3269 3.70463 11.591ZM11.9782 22.4982C12.0385 22.3317 12.046 22.2178 12.0555 18.7479C12.0555 18.7479 12.063 17.2155 12.0649 17.1993C12.0894 16.823 11.8367 16.481 11.4219 16.3273C10.9939 16.1699 10.5339 16.2676 10.2756 16.5751C10.2756 16.5751 9.52137 17.4345 9.5176 17.4345C6.92694 20.3544 6.81758 20.4901 6.75536 20.6619C6.71576 20.7632 6.70256 20.8718 6.71388 20.9803C6.72896 21.1359 6.80249 21.2879 6.92316 21.4308C7.52464 22.1164 10.4057 23.1332 11.3258 22.9812C11.6482 22.9287 11.8801 22.7569 11.9782 22.4982ZM17.8251 21.2915C18.6943 20.9586 20.5892 18.6466 20.7231 17.7547C20.7702 17.4453 20.6684 17.1776 20.4459 17.0075C20.3007 16.9026 20.1895 16.861 16.7484 15.7773C16.7484 15.7773 15.2401 15.2997 15.2193 15.2906C14.8535 15.155 14.4368 15.2816 14.1578 15.6127C13.8655 15.9528 13.8222 16.4033 14.056 16.7416L14.6631 17.6895C16.7051 20.8718 16.8616 21.0961 17.0086 21.2065C17.2349 21.3783 17.5234 21.4073 17.8251 21.2915ZM16.047 13.0998C19.9557 12.1916 20.1084 12.1428 20.2611 12.0451C20.4987 11.8913 20.6175 11.6362 20.5967 11.3251C20.5967 11.316 20.5986 11.3052 20.5967 11.2943C20.4968 10.3717 18.8149 7.97639 17.9853 7.58743C17.6912 7.45174 17.3971 7.46079 17.1538 7.61818C17.003 7.71226 16.8917 7.85518 14.7989 10.6032C14.7989 10.6032 13.8542 11.8389 13.8429 11.8515C13.594 12.1428 13.5903 12.5589 13.8335 12.9171C14.0861 13.288 14.5123 13.4671 14.9026 13.3639C14.9026 13.3639 14.8875 13.3911 14.8837 13.3947C15.076 13.3241 15.4192 13.2427 16.047 13.0998ZM12.1233 10.0026C12.0555 8.5155 11.5898 1.89595 11.5351 1.5902C11.4559 1.3116 11.2296 1.11441 10.9053 1.03481C9.90601 0.797811 6.09166 1.82358 5.38461 2.5219C5.15646 2.74985 5.0735 3.02845 5.14138 3.2763C5.25262 3.4952 9.97954 10.6304 9.97954 10.6304C10.6772 11.7176 11.2485 11.5476 11.4351 11.4915C11.6199 11.439 12.1875 11.269 12.1233 10.0026Z" />
      </svg>
    );
  }
  if (source === "google") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      className="block bg-surface rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex flex-col gap-6">
        {/* Header: avatar + name/city + source icon */}
        <div className="flex items-center gap-3">
          <Image
            src={review.image}
            alt={review.name}
            width={56}
            height={56}
            className="rounded-full object-cover w-14 h-14 shrink-0"
          />
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="text-white font-semibold text-[1.5rem] leading-[1.4] tracking-[-0.03em] truncate">
              {review.name}
            </div>
            <div className="text-white font-mono font-bold text-base leading-[1.2] tracking-[-0.04em] truncate">
              {review.city}
            </div>
          </div>
          <span className="grid place-items-center w-14 h-14 rounded-full bg-[#303030] text-white shrink-0 transition-colors duration-200 hover:bg-accent hover:text-accent-text">
            <SourceIcon source={review.source} />
          </span>
        </div>

        {/* Stars + text */}
        <div className="flex flex-col gap-3">
          <StarRating count={review.rating} />
          <p className="text-white font-normal text-lg leading-[1.4] tracking-[-0.02em]">
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
  // Double the array so the marquee loop is seamless (keyframe goes 0 → -50%)
  const loopA = [...reviews, ...reviews];
  const loopB = [...reviews.slice().reverse(), ...reviews.slice().reverse()];

  return (
    <section id="reviews" className="py-20 md:py-32 bg-black overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-12 lg:gap-16 items-center">
          {/* LEFT — heading + CTA */}
          <div className="flex flex-col gap-10 lg:gap-14">
            <RevealText
              as="h2"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-bold text-white leading-[0.95] tracking-[-0.04em]"
            >
              More than 5,000 satisfied customers
            </RevealText>

            <div className="self-start">
              <Button href="/reviews">View all reviews</Button>
            </div>
          </div>

          {/* RIGHT — horizontal scroll on mobile, two opposing vertical
              marquee columns on sm+ */}

          {/* Mobile: TWO horizontal auto-marquees with opposing directions
              (mirrors desktop's two vertical columns). Pauses on hover. */}
          <div
            className="sm:hidden -mx-4 overflow-hidden flex flex-col gap-3"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
            }}
          >
            {/* Row 1 — scrolls LEFT (tripled array, 25s, matches desktop cadence) */}
            <div
              className="flex gap-3 px-4 animate-marquee-left whitespace-nowrap"
              style={{ animationDuration: "15s" }}
            >
              {[...reviews, ...reviews, ...reviews].map((r, i) => (
                <div key={`ma-${i}`} className="flex-shrink-0 w-[82vw] whitespace-normal">
                  <ReviewCard review={r} href={urlFor(r.source)} />
                </div>
              ))}
            </div>

            {/* Row 2 — scrolls RIGHT (reversed order so the layout doesn't mirror) */}
            <div
              className="flex gap-3 px-4 animate-marquee-right whitespace-nowrap"
              style={{ animationDuration: "15s" }}
            >
              {[...reviews.slice().reverse(), ...reviews.slice().reverse(), ...reviews.slice().reverse()].map((r, i) => (
                <div key={`mb-${i}`} className="flex-shrink-0 w-[82vw] whitespace-normal">
                  <ReviewCard review={r} href={urlFor(r.source)} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: two vertical marquee columns */}
          <div
            className="hidden sm:grid grid-cols-2 gap-3 h-[680px] relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            <div className="flex flex-col">
              <div className="animate-marquee-down flex flex-col gap-3 shrink-0">
                {loopA.map((r, i) => (
                  <ReviewCard key={`a-${i}`} review={r} href={urlFor(r.source)} />
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="animate-marquee-up flex flex-col gap-3 shrink-0">
                {loopB.map((r, i) => (
                  <ReviewCard key={`b-${i}`} review={r} href={urlFor(r.source)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
