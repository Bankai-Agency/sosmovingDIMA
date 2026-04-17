import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/mainpage2/ui/Container";
import { BankaiLink } from "@/components/mainpage2/ui/BankaiLink";
import data from "@/data/mainpage2/homepage.json";

const footerLinks = {
  services: [
    { label: "Local Moving", href: "/services/local-moving" },
    { label: "Long Distance", href: "/services/long-distance-movers" },
    { label: "Apartment Movers", href: "/services/apartment-movers" },
    { label: "Commercial Movers", href: "/services/commercial-movers" },
    { label: "Packing Services", href: "/services/packing-services" },
    { label: "Storage", href: "/services/storage" },
    { label: "White Glove", href: "/services/white-glove-movers" },
  ],
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "Reviews", href: "/about-us/reviews" },
    { label: "Gallery", href: "/about-us/gallery" },
    { label: "FAQ", href: "/about-us/faq" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ],
  quickLinks: [
    { label: "Free Estimate", href: "/free-estimate" },
    { label: "Book Online", href: "/book-online" },
    { label: "Contact Us", href: "/about-us/contact-us" },
    { label: "Company Policy", href: "/about-us/company-policy" },
    { label: "Sitemap", href: "/sitemap" },
  ],
};

function FooterIcon({ type }: { type: "phone" | "email" | "location" | "clock" }) {
  const paths: Record<string, React.ReactNode> = {
    phone: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />,
    email: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    location: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  };

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-text-muted" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

export function Footer() {
  const { company } = data;

  return (
    <footer className="pt-16 pb-8">
      <Container>
        {/* Main grid — 5 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-8 pb-10 border-b border-white/10">
          {/* Logo + description */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/mainpage2/images/Sos-logo-min.avif"
                alt="SOS Moving & Storage logo"
                width={120}
                height={40}
              />
            </Link>
            <p className="text-[0.8rem] text-text-muted leading-relaxed">
              Licensed and insured moving company providing local and long-distance moves
              across California, Oregon, Washington and Colorado.
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-[0.9rem] font-semibold text-white mb-4">Contact</h3>
            <address className="not-italic space-y-3">
              <a href={`tel:${company.phoneRaw}`} className="flex items-center gap-3 text-[0.8rem] text-text-muted hover:text-white transition-colors">
                <FooterIcon type="phone" />
                {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-[0.8rem] text-text-muted hover:text-white transition-colors">
                <FooterIcon type="email" />
                {company.email}
              </a>
              <div className="flex items-start gap-3 text-[0.8rem] text-text-muted">
                <FooterIcon type="location" />
                <span>{company.address.street}, {company.address.city}, {company.address.state} {company.address.zip}</span>
              </div>
              <div className="flex items-center gap-3 text-[0.8rem] text-text-muted">
                <FooterIcon type="clock" />
                {company.hours}
              </div>
            </address>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[0.9rem] font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.8rem] text-text-muted hover:text-white transition-colors underline hover:no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[0.9rem] font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.8rem] text-text-muted hover:text-white transition-colors underline hover:no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[0.9rem] font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.8rem] text-text-muted hover:text-white transition-colors underline hover:no-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-text-muted space-x-4">
            <span>&copy; {new Date().getFullYear()} {company.name}</span>
            <span>USDOT {company.license.usdot}</span>
            <span>{company.license.calT}</span>
            <span>{company.license.mc}</span>
          </div>
          <div className="flex gap-4">
            {Object.entries(company.social).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-white transition-colors capitalize text-xs"
                aria-label={`SOS Moving on ${platform}`}
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        {/* Agency credit */}
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center">
          <span className="text-xs text-text-muted whitespace-nowrap">
            Design & Development by
          </span>
          <BankaiLink />
        </div>
      </Container>
    </footer>
  );
}
