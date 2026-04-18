"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import data from "@/data/mainpage2/homepage.json";

type DropdownItem = { label: string; href: string };

type NavItem = {
  label: string;
  href: string;
  dropdown?: {
    image?: { src: string; alt: string; label: string };
    primary: DropdownItem[];
    secondary: DropdownItem[];
  };
};

const navLinks: NavItem[] = [
  {
    label: "Moving",
    href: "/services",
    dropdown: {
      image: {
        src: "/mainpage2/images/Long-Distance-Movers-Los-Angeles.avif",
        alt: "SOS Moving services",
        label: "All Services",
      },
      primary: [
        { label: "Apartment Movers", href: "/services/apartment-movers" },
        { label: "Commercial Movers", href: "/services/commercial-movers" },
        { label: "Long-Distance Movers", href: "/services/long-distance-movers" },
        { label: "Packing Services", href: "/services/packing-services" },
        { label: "White Glove Movers", href: "/services/white-glove-movers" },
        { label: "Storage", href: "/services/storage" },
        { label: "Local Movers", href: "/services/local-moving" },
      ],
      secondary: [],
    },
  },
  {
    label: "Locations",
    href: "/los-angeles-movers",
    dropdown: {
      image: {
        src: "/mainpage2/images/Movers-Los-Angeles.avif",
        alt: "Service areas",
        label: "Los Angeles",
      },
      primary: [
        { label: "Los Angeles Movers", href: "/los-angeles-movers" },
        { label: "Orange County Movers", href: "/orange-county-movers" },
        { label: "Calabasas Movers", href: "/los-angeles-movers/calabasas-movers" },
        { label: "Portland Movers", href: "/portland-movers" },
        { label: "Seattle Movers", href: "/seattle-movers" },
        { label: "Denver Movers", href: "/denver-movers" },
      ],
      secondary: [],
    },
  },
  {
    label: "About Us",
    href: "/about-us",
    dropdown: {
      image: {
        src: "/mainpage2/images/Helpers-and-Truck.webp",
        alt: "About SOS Moving",
        label: "About Us",
      },
      primary: [
        { label: "Our Team", href: "/about-us/meet-our-team" },
        { label: "Gallery", href: "/about-us/gallery" },
        { label: "Contact Us", href: "/about-us/contact-us" },
        { label: "Company Policy", href: "/about-us/company-policy" },
        { label: "Apartment Partnership", href: "/about-us/apartment-partnership" },
        { label: "Refer Friends & Get Cash", href: "/about-us/referral" },
      ],
      secondary: [],
    },
  },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
];

/** Dark plate — navbar background */
const BAR_BG = "#141414";
// Larger, heavier nav font — per user feedback
const NAV_FONT =
  "text-base sm:text-[1.0625rem] font-medium tracking-[-0.01em] leading-none";
// Pill-hover wrap: MM's .c-menu-desktop_link — h-11 rounded-full + soft fill on hover
const NAV_LINK =
  "relative inline-flex items-center justify-center gap-2 h-11 px-4 rounded-full text-white hover:bg-white/10 transition-colors duration-300";
const NAV_LINK_ON_YELLOW =
  "relative inline-flex items-center justify-center gap-2 h-11 px-4 rounded-full text-accent-text hover:bg-black/10 transition-colors duration-300";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Smart sticky: transparent over hero → compact plate after hero, hide on down-scroll, show on up-scroll
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const heroEnd = window.innerHeight * 0.85;

      if (y < heroEnd) {
        setCompact(false);
        setVisible(true);
      } else {
        setCompact(true);
        const delta = y - lastScrollY.current;
        if (delta > 6) setVisible(false);
        else if (delta < -6) setVisible(true);
      }
      lastScrollY.current = y;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openDropdown]);

  return (
    <>
      {/* Outer container — fixed at top with smart sticky behavior */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -140, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 pointer-events-none"
      >
        <div
          ref={headerRef}
          className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-stretch gap-3 sm:gap-4 pointer-events-auto"
        >
          {/* MAIN BAR — transparent over hero, grey plate after scroll */}
          <div
            className={`relative flex-grow flex items-center justify-between h-[76px] rounded-[10px] pl-4 pr-2.5 gap-6 transition-colors duration-500`}
            style={{ backgroundColor: compact ? BAR_BG : "transparent" }}
          >
            {/* inner wraps logo + nav as MM .c-menu-desktop_inner */}
            {/* Logo */}
            <Link href="/" className="flex items-center" aria-label="SOS Moving — Home">
              <Image
                src="/mainpage2/images/Sos-logo-min.avif"
                alt="SOS Moving & Storage logo"
                width={100}
                height={34}
                priority
              />
            </Link>

            {/* Desktop nav — pill-hover style from MM .c-menu-desktop_link */}
            <nav className="hidden lg:flex items-center gap-1 h-full">
              {navLinks.map((link) => {
                const hasDropdown = Boolean(link.dropdown);
                const isOpen = openDropdown === link.label;
                const chevron = (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" />
                  </svg>
                );
                const labelContent = (
                  <span className="pill-label-stack">
                    <span className="pill-label">
                      {link.label}
                      {hasDropdown && chevron}
                    </span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {link.label}
                      {hasDropdown && chevron}
                    </span>
                  </span>
                );
                if (hasDropdown) {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() =>
                        setOpenDropdown(isOpen ? null : link.label)
                      }
                      aria-expanded={isOpen}
                      className={`pill-nav-link ${NAV_FONT} ${isOpen ? "is-open" : ""}`}
                    >
                      {labelContent}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`pill-nav-link ${NAV_FONT}`}
                  >
                    {labelContent}
                  </Link>
                );
              })}
            </nav>

            {/* Circle menu/phone button (right inside bar) — MM green circle */}
            <a
              href={`tel:${data.company.phoneRaw}`}
              aria-label={`Call ${data.company.phone}`}
              className="relative hidden sm:grid place-items-center w-10 h-10 rounded-full bg-accent text-accent-text hover:bg-accent-hover transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen ? true : undefined}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-5 h-3.5">
                <span className={`absolute left-0 w-full h-[1.5px] bg-white transition-all duration-300 origin-center ${mobileOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-white transition-all duration-200 ${mobileOpen ? "opacity-0 scale-0" : "opacity-100"}`} />
                <span className={`absolute left-0 w-full h-[1.5px] bg-white transition-all duration-300 origin-center ${mobileOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0"}`} />
              </div>
            </button>
          </div>

          {/* CTA plate — yellow accent plate with dark text */}
          <Link
            href="/free-estimate"
            className="hidden sm:inline-flex items-center h-[76px] rounded-[10px] px-2 whitespace-nowrap bg-accent hover:bg-accent-hover transition-colors"
          >
            <span className={`${NAV_LINK_ON_YELLOW} ${NAV_FONT}`}>Get a quote</span>
          </Link>

          {/* Mega-dropdown panel — MindMarket 1:1 */}
          <AnimatePresence>
            {openDropdown &&
              (() => {
                const item = navLinks.find((n) => n.label === openDropdown);
                if (!item?.dropdown) return null;
                const { image, primary, secondary } = item.dropdown;
                const allLinks = [...primary, ...secondary];
                const EASE = [0.5, 0, 0, 1] as const;
                return (
                  <motion.div
                    key={openDropdown}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute left-4 sm:left-6 lg:left-8 top-[calc(76px+0.5rem)] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] max-w-[720px] pointer-events-auto grid grid-cols-[240px_1fr] gap-3 p-3 rounded-[10px] bg-white text-[#2c2e2a] shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
                  >
                    {/* Col 1 — image CTA */}
                    {image && (
                      <Link
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="group relative rounded-[10px] overflow-hidden bg-[#2c2e2a]"
                        style={{ aspectRatio: "284 / 330" }}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 1200px) 33vw, 20vw"
                          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.38,.005,.215,1)] scale-[1.05] group-hover:scale-[1.08] group-hover:rotate-[2deg]"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between text-white z-10">
                          <span className="text-[clamp(1.1563rem,1.1454rem+.0543vw,1.1875rem)] font-medium leading-[1.25] tracking-[-0.04em]">
                            {image.label}
                          </span>
                          <span className="relative w-8 h-8 grid place-items-center text-black">
                            <span className="absolute inset-0 rounded-full bg-white scale-[1.1] transition-transform duration-[400ms] ease-[cubic-bezier(.17,.67,.3,1.33)] group-hover:scale-[1.15]" />
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="relative z-10">
                              <path d="m8 14 4-4-4-4" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    )}

                    {/* Right col — 2-col link list, tight */}
                    <nav className="p-2">
                      <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                        {allLinks.map((l, idx) => (
                          <motion.li
                            key={l.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: idx * 0.025,
                              ease: EASE,
                            }}
                          >
                            <Link
                              href={l.href}
                              onClick={() => setOpenDropdown(null)}
                              className="inline-block py-1.5 text-base font-medium leading-[1.3] tracking-[-0.02em] text-[#2c2e2a] hover:underline"
                            >
                              {l.label}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </nav>
                  </motion.div>
                );
              })()}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl"
          >
            <Container className="pt-24 pb-8 flex flex-col h-full">
              <nav className="flex flex-col gap-2 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block text-3xl font-bold text-white hover:text-accent transition-colors py-3 border-b border-border/20"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex flex-col gap-4"
              >
                <a href={`tel:${data.company.phoneRaw}`} className="text-2xl font-bold text-accent">
                  {data.company.phone}
                </a>
                <Link
                  href="/free-estimate"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-full h-[76px] rounded-[10px] bg-[#2c2e2a] text-white font-medium text-base hover:text-accent transition-colors"
                >
                  Get a quote
                </Link>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
