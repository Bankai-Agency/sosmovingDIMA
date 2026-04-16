"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const services = [
  { label: "All Services", href: "/services" },
  { label: "Apartment Movers", href: "/services/apartment-movers" },
  { label: "Commercial Movers", href: "/services/commercial-movers" },
  { label: "Long-Distance Movers", href: "/services/long-distance-movers" },
  { label: "Packing Services", href: "/services/packing-services" },
  { label: "White Glove Movers", href: "/services/white-glove-movers" },
  { label: "Storage", href: "/services/storage" },
  { label: "Local Movers", href: "/services/local-moving" },
];

const locations = [
  { label: "Los Angeles Movers", href: "/los-angeles-movers" },
  { label: "Orange County Movers", href: "/orange-county-movers" },
  { label: "Portland Movers", href: "/portland-movers" },
  { label: "Seattle Movers", href: "/seattle-movers" },
  { label: "Denver Movers", href: "/denver-movers" },
  { label: "Calabasas Movers", href: "/los-angeles-movers/calabasas-movers" },
];

const company = [
  { label: "About Us", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/about-us/reviews" },
  { label: "FAQ", href: "/about-us/faq" },
  { label: "Gallery", href: "/about-us/gallery" },
  { label: "Contact Us", href: "/about-us/contact-us" },
  { label: "Our Team", href: "/about-us/meet-our-team" },
  { label: "Refer Friends", href: "/about-us/referral" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[10005] transition-all duration-500 ${
        scrolled ? "bg-[#222222fc] shadow-[0_0_0.2rem_0.5rem_rgba(52,52,52,0.05)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-[72rem] mx-auto px-[1rem] flex items-center justify-between py-[0.5rem]">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center w-[9.44rem] lg:w-[9.44rem] z-[1001]">
          <Image
            src="/images/general/661fb80f63df1e16fb9dced9_Sos-logo-min.avif"
            alt="SOS Moving & Storage"
            width={189}
            height={50}
            className="w-full h-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0">
          <NavDropdown label="Moving" items={services} active={activeDropdown === "moving"} onToggle={() => setActiveDropdown(activeDropdown === "moving" ? null : "moving")} />
          <NavDropdown label="Locations" items={locations} active={activeDropdown === "locations"} onToggle={() => setActiveDropdown(activeDropdown === "locations" ? null : "locations")} />
          <NavDropdown label="Company" items={company} active={activeDropdown === "company"} onToggle={() => setActiveDropdown(activeDropdown === "company" ? null : "company")} />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-[1rem]">
          <Link
            href="/free-estimate"
            className="hidden sm:inline-flex bg-accent text-black font-bold text-[0.7rem] px-[1rem] py-[0.65rem] rounded-[0.75rem] hover:bg-[#ffec6a] transition-colors"
          >
            Get a Free Quote
          </Link>
          <a href="tel:+19094430004" className="flex items-center gap-[0.4rem] text-white text-[0.7rem] font-bold">
            <svg className="w-[0.9rem] h-[0.9rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="hidden md:inline">909-443-0004</span>
          </a>
          <button className="lg:hidden text-white p-[0.4rem]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-[1.4rem] h-[1.4rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-black h-screen overflow-y-auto px-[1rem] pt-[7rem] pb-[1.8rem]">
          <MobileSection title="Moving" items={services} onClose={() => setMobileOpen(false)} />
          <MobileSection title="Locations" items={locations} onClose={() => setMobileOpen(false)} />
          <MobileSection title="Company" items={company} onClose={() => setMobileOpen(false)} />
          <Link href="/free-estimate" className="block bg-accent text-black font-bold text-center py-[0.65rem] rounded-[0.75rem] mt-[1.5rem] text-[0.8rem]" onClick={() => setMobileOpen(false)}>
            Get a Free Quote
          </Link>
        </div>
      )}

      {/* Callback Widget - fixed right side */}
      <div className="hidden lg:block fixed right-[-5.55rem] bottom-[17.4rem] z-[10004] hover:right-0 transition-[right] duration-300">
        <div className="bg-accent rounded-tl-[0.4rem] rounded-bl-[0.4rem] overflow-hidden">
          <a href="tel:+19094430004" className="flex items-center gap-[0.5rem] px-[0.8rem] py-[0.6rem] text-black text-[0.65rem] font-bold">
            <svg className="w-[1rem] h-[1rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call us
          </a>
          <a href="/free-estimate" className="flex items-center gap-[0.5rem] px-[0.8rem] py-[0.6rem] text-black text-[0.65rem] font-bold border-t border-black/10">
            <svg className="w-[1rem] h-[1rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Free quote
          </a>
        </div>
      </div>
    </header>
  );
}

function NavDropdown({ label, items, active, onToggle }: { label: string; items: { label: string; href: string }[]; active: boolean; onToggle: () => void }) {
  return (
    <div className="relative" onMouseEnter={onToggle} onMouseLeave={() => active && onToggle()}>
      <button className="text-white text-[0.7rem] font-bold flex items-center gap-[0.3rem] px-[1rem] py-[0.8rem] hover:text-accent transition-colors">
        {label}
        <svg className={`w-[0.5rem] h-[0.5rem] transition-transform ${active ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {active && (
        <div className="absolute top-full left-0 bg-[#222] rounded-[0.6rem] py-[0.5rem] min-w-[14rem] shadow-xl border border-white/5">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block px-[1.2rem] py-[0.5rem] text-[0.7rem] text-white/70 hover:text-accent hover:bg-white/5 transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileSection({ title, items, onClose }: { title: string; items: { label: string; href: string }[]; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button className="w-full flex items-center justify-between text-white font-bold text-[0.9rem] py-[0.8rem]" onClick={() => setOpen(!open)}>
        {title}
        <svg className={`w-[0.8rem] h-[0.8rem] transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-[0.8rem]">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block py-[0.5rem] pl-[1rem] text-[0.75rem] text-white/50 hover:text-accent" onClick={onClose}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
