import { ImagineScroller } from "./ImagineScroller";

/* ===========================================================================
 * Three drop-in variants of ImagineScroller. Pick whichever lands best in
 * page.tsx and delete the others. All three reuse the same component + word-
 * fill scroll mechanic — only the intro headline + items differ.
 * ========================================================================= */

/* ---------- VARIANT A — value props (replaces WhySos) ---------- */
export function ImagineMoveA() {
  return (
    <ImagineScroller
      id="why-sos"
      intro={
        <>
          Imagine the move as <strong>one seamless system</strong> from your
          old door to your new one.
        </>
      }
      items={[
        { title: "with [transparent hourly pricing] — no fine print",      image: "/mainpage2/images/Helpers-and-Truck.webp" },
        { title: "with [free packing materials] on every job",             image: "/mainpage2/images/SOS-Movers-Loading.webp" },
        { title: "with a [coordinator you know] by name",                  image: "/mainpage2/images/Team_New.webp" },
        { title: "with [licensed, insured] crews on every truck",          image: "/mainpage2/images/Movers-Los-Angeles.avif" },
        { title: "with [same-day quotes] that don't change",               image: "/mainpage2/images/movers_sos.webp" },
        { title: "with [zero hidden fees] at the bill",                    image: "/mainpage2/images/Long-Distance-Movers-Los-Angeles.avif" },
      ]}
    />
  );
}

/* ---------- VARIANT B — perspective shift (picture your move) ---------- */
export function ImagineMoveB() {
  return (
    <ImagineScroller
      id="picture"
      intro={
        <>
          Picture moving day <strong>the way it should be</strong> — calm,
          on time, on budget.
        </>
      }
      items={[
        { title: "where [you don't lift] a thing",                         image: "/mainpage2/images/Helpers-and-Truck.webp" },
        { title: "where [nothing breaks] in transit",                      image: "/mainpage2/images/SOS-Movers-Loading.webp" },
        { title: "where the truck shows up [on the dot]",                  image: "/mainpage2/images/movers_sos.webp" },
        { title: "where the bill matches [the quote]",                     image: "/mainpage2/images/Movers-Los-Angeles.avif" },
        { title: "where the crew [knows your name]",                       image: "/mainpage2/images/Team_New.webp" },
        { title: "where [no one calls you back] at midnight",              image: "/mainpage2/images/Burbank-Movers-1.jpg" },
      ]}
    />
  );
}

/* ---------- VARIANT C — service depth (built for SoCal) ---------- */
export function ImagineMoveC() {
  return (
    <ImagineScroller
      id="built-for-socal"
      intro={
        <>
          Built for <strong>SoCal moving</strong> — every size, every kind,
          every distance.
        </>
      }
      items={[
        { title: "from [studio walk-ups] in Echo Park",                    image: "/mainpage2/images/Apartment-Movers.avif" },
        { title: "to [five-bedroom estates] in Calabasas",                 image: "/mainpage2/images/Movers-Los-Angeles.avif" },
        { title: "across [office relocations] in DTLA",                    image: "/mainpage2/images/Commercial-Movers.avif" },
        { title: "through [interstate runs] to Portland & Seattle",        image: "/mainpage2/images/Long-Distance-Movers-Los-Angeles.avif" },
        { title: "with [climate-controlled storage] in between",           image: "/mainpage2/images/storage-bg.webp" },
        { title: "backed by [10,000+ completed] moves",                    image: "/mainpage2/images/Helpers-and-Truck.webp" },
      ]}
    />
  );
}
