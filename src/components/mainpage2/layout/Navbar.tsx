"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/mainpage2/ui/Container";
import { Button } from "@/components/mainpage2/ui/Button";
import data from "@/data/mainpage2/homepage.json";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Areas", href: "#service-areas" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Floating pill navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled
            ? "w-[92%] sm:w-[95%] max-w-5xl bg-bg/80 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl shadow-black/20"
            : "w-[92%] sm:w-[95%] max-w-7xl bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" aria-label="SOS Moving — Home">
            <Image
              src="/mainpage2/images/Sos-logo-min.avif"
              alt="SOS Moving & Storage logo"
              width={100}
              height={34}
              priority
            />
          </Link>

          {/* Desktop nav — center */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-text-muted hover:text-white rounded-full hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${data.company.phoneRaw}`}
              className="text-sm font-medium text-text-muted hover:text-accent transition-colors"
              aria-label={`Call ${data.company.phone}`}
            >
              {data.company.phone}
            </a>
            <Button href="/free-estimate" size="sm">Free Quote</Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden relative w-10 h-10 flex items-center justify-center"
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
                    key={link.href}
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
                <Button href="/free-estimate" className="w-full" size="lg" onClick={() => setMobileOpen(false)}>
                  Get a Free Quote
                </Button>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
