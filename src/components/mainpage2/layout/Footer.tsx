import Link from "next/link";
import { Button } from "@/components/mainpage2/ui/Button";
import { QuoteForm } from "@/components/mainpage2/sections/QuoteForm";
import data from "@/data/mainpage2/homepage.json";

const navCol1 = [
  { label: "Services", href: "/services" },
  { label: "Areas", href: "#service-areas" },
  { label: "Reviews", href: "#reviews" },
  { label: "Gallery", href: "#gallery" },
  { label: "About Us", href: "/about-us" },
];

const navCol2 = [
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/about-us/contact-us" },
  { label: "Privacy Policy", href: "/about-us/company-policy" },
  { label: "Book Online", href: "/book-online" },
];

export function Footer() {
  const { company } = data;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-accent text-[#151414] rounded-t-[35px] lg:rounded-t-[50px] overflow-x-hidden">
      {/* Quote form — lives inside the footer, dark card on yellow */}
      <QuoteForm />

      {/* Self-running seamless marquee — one row of "Get your free quote" */}
      <div className="pt-[clamp(3.5rem,2.9783rem+2.6087vw,5rem)] pb-6 lg:pb-8 overflow-x-hidden">
        <div className="flex animate-marquee-left whitespace-nowrap font-bold text-[#151414] leading-[0.95] tracking-[-0.04em] text-[14vw] sm:text-[11vw]">
          {Array.from({ length: 3 }).map((_, i) => (
            <Link
              key={i}
              href="/free-estimate"
              className="inline-block shrink-0 pr-[0.35em] hover:underline decoration-[0.06em] underline-offset-[0.08em]"
            >
              Get your free quote
            </Link>
          ))}
        </div>
      </div>

      {/* Top */}
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-[90rem]">
          {/* Row 1 — blurb + button  //  nav cols */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[clamp(3.5rem,2.9783rem+2.6087vw,5rem)] md:gap-8">
            <div className="md:col-span-6 xl:col-span-5">
              <p className="max-w-[450px] font-medium text-[clamp(1.5rem,1.413rem+.4348vw,1.75rem)] md:text-[clamp(1.1563rem,1.1454rem+.0543vw,1.1875rem)] leading-[1.25] tracking-[-0.04em]">
                Have a project in mind? We&rsquo;d love to hear what you&rsquo;re working on and show you how we can help. Whether you&rsquo;re moving next door or across the country, we&rsquo;re ready when you are.
              </p>
              <div className="mt-[clamp(1rem,.8261rem+.8696vw,1.5rem)]">
                <Button
                  href="/free-estimate"
                  className="!bg-white !text-[#151414]"
                >
                  Get a quote
                </Button>
              </div>
            </div>

            <nav className="md:col-span-5 md:col-start-8 xl:col-span-4 xl:col-start-10 grid grid-cols-2 gap-x-8 gap-y-2.5">
              <ul className="flex flex-col gap-y-1.5 text-base">
                {navCol1.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-y-1.5 text-base">
                {navCol2.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Middle — huge heading + contact */}
      <div className="px-4 sm:px-6 lg:px-10 mt-[clamp(3.5rem,2.9783rem+2.6087vw,5rem)]">
        <div className="mx-auto w-full max-w-[90rem]">
          <div className="grid grid-cols-1 lg:grid-cols-14 gap-[clamp(2.5rem,2.1522rem+1.7391vw,3.5rem)] lg:gap-8 pt-8 max-lg:border-t max-lg:border-[#151414]/20">
            <div className="lg:col-span-7">
              <p className="font-medium text-[clamp(3.625rem,1.1033rem+12.6087vw,10.875rem)] leading-[0.95] tracking-[-0.06em] -ml-[0.07em]">
                Let&rsquo;s
                <br />
                <u className="underline underline-offset-[0.12em] decoration-[0.08em]">Move</u>
              </p>
            </div>

            <div className="lg:col-span-4 lg:col-start-10 text-base leading-[1.25] space-y-4">
              <p>
                <strong className="block font-medium text-[#151414]">Los Angeles</strong>
                <span className="text-[#2c2e2a]/60">
                  {company.address.street},<br />
                  {company.address.city}, {company.address.state} {company.address.zip}
                  <br />
                  {company.hours}
                </span>
              </p>
              <p>
                <a href={`mailto:${company.email}`} className="font-medium hover:underline">
                  <strong className="font-medium">{company.email}</strong>
                </a>
              </p>
              <p>
                <a href={`tel:${company.phoneRaw}`} className="font-medium hover:underline">
                  <strong className="font-medium">{company.phone}</strong>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 sm:px-6 lg:px-10 mt-[clamp(2.5rem,2.1522rem+1.7391vw,3.5rem)] pb-9">
        <div className="mx-auto w-full max-w-[90rem]">
          <div className="grid grid-cols-1 lg:grid-cols-14 gap-6 lg:gap-8 text-sm">
            <div className="lg:col-span-7 flex flex-wrap gap-x-6 gap-y-1 max-lg:border-b max-lg:border-[#151414]/20 max-lg:pb-[clamp(1rem,.8261rem+.8696vw,1.5rem)]">
              <span>
                © {year} {company.name}
              </span>
              <span>USDOT {company.license.usdot}</span>
              <span>{company.license.calT}</span>
              <span>{company.license.mc}</span>
            </div>
            <div className="lg:col-span-4 lg:col-start-10 flex flex-wrap gap-x-6 gap-y-1">
              {Object.entries(company.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize hover:underline"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
