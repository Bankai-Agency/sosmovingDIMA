import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { label: 'Free Estimate', href: '/free-estimate' },
  { label: 'Book Online', href: '/book-online' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Reviews', href: '/about-us/reviews' },
  { label: 'FAQ', href: '/about-us/faq' },
  { label: 'Contact Us', href: '/about-us/contact-us' },
  { label: 'Company Policy', href: '/about-us/company-policy' },
  { label: 'Blog', href: '/blog' },
];

const serviceLinks = [
  { label: 'Apartment Movers', href: '/services/apartment-movers' },
  { label: 'Commercial Movers', href: '/services/commercial-movers' },
  { label: 'Long-Distance Movers', href: '/services/long-distance-movers' },
  { label: 'Packing Services', href: '/services/packing-services' },
  { label: 'White Glove Movers', href: '/services/white-glove-movers' },
  { label: 'Storage', href: '/services/storage' },
  { label: 'Local Movers', href: '/services/local-moving' },
];

const locationLinks = [
  { label: 'Los Angeles Movers', href: '/los-angeles-movers' },
  { label: 'Orange County Movers', href: '/orange-county-movers' },
  { label: 'Portland Movers', href: '/portland-movers' },
  { label: 'Seattle Movers', href: '/seattle-movers' },
  { label: 'Denver Movers', href: '/denver-movers' },
];

export function Footer() {
  return (
    <footer className="pt-[4rem] bg-[#151414]">
      <div className="max-w-[72rem] mx-auto px-[1rem]">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.75fr_0.75fr_0.75fr] gap-[2rem] pb-[2.75rem] border-b border-white/10">
          {/* Logo + contact */}
          <div>
            <Link href="/" className="block mb-[1.5rem]">
              <Image
                src="/images/general/645ab1d97922876e435bf06c_logo-sos.png"
                alt="SOS Moving"
                width={120}
                height={40}
                className="h-[2.5rem] w-auto"
              />
            </Link>
            <div className="space-y-[0.5rem] text-[0.75rem] text-text-muted">
              <a href="tel:+19094430004" className="block text-white hover:text-accent transition-colors font-bold">
                909-443-0004
              </a>
              <p>5530 Jillson Street, Los Angeles, CA 90040, US</p>
              <a href="mailto:info@sosmovingla.net" className="block hover:text-accent transition-colors">
                info@sosmovingla.net
              </a>
              <p>Monday - Sunday, 8AM - 6PM</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-[0.8rem] mb-[1.2rem]">Quick Links</h4>
            <ul className="space-y-[0.5rem]">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.75rem] text-text-muted hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-[0.8rem] mb-[1.2rem]">Services</h4>
            <ul className="space-y-[0.5rem]">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.75rem] text-text-muted hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-white font-bold text-[0.8rem] mb-[1.2rem]">Locations</h4>
            <ul className="space-y-[0.5rem]">
              {locationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.75rem] text-text-muted hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Licenses */}
          <div>
            <h4 className="text-white font-bold text-[0.8rem] mb-[1.2rem]">Licenses</h4>
            <div className="space-y-[0.5rem] text-[0.75rem] text-text-muted">
              <p>USDOT: 3398018</p>
              <p>CAL-T: 0192140</p>
              <p>MC: 1153871</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-[1.5rem] flex flex-col sm:flex-row items-center justify-between gap-[1rem] text-[0.65rem] text-text-muted">
          <p>&copy; {new Date().getFullYear()} SOS Moving & Storage LLC. All rights reserved.</p>
          <div className="flex items-center gap-[1.5rem]">
            <Link href="/about-us/company-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
