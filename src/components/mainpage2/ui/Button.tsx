"use client";

import Link from "next/link";
import { openQuoteModal } from "@/components/mainpage2/ui/QuoteModal";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  /** @deprecated retained for API compatibility */
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  /** Hide the trailing arrow icon (default: show) */
  noIcon?: boolean;
};

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

const base =
  "pill-btn inline-flex items-center justify-center gap-3 md:gap-4 h-12 md:h-14 lg:h-[60px] px-6 md:px-8 lg:px-9 rounded-full font-semibold leading-none tracking-[-0.02em] whitespace-nowrap text-[0.9375rem] md:text-base lg:text-[1.0625rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent w-full sm:w-auto";

const variants = {
  primary: "pill-btn--primary bg-accent text-accent-text",
  outline:
    "pill-btn--outline border border-white/20 text-white backdrop-blur-[40px]",
  ghost: "pill-btn--ghost text-white",
};

// Hrefs that should open the quote-modal instead of navigating.
const QUOTE_HREFS = new Set(["/free-estimate", "/book-online"]);

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  noIcon = false,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const body = (
    <>
      {children}
      {!noIcon && <ArrowIcon />}
    </>
  );
  const content = (
    <>
      <span className="pill-btn-sizer" aria-hidden="true">
        {body}
      </span>
      <span className="pill-label">{body}</span>
      <span className="pill-label-hover" aria-hidden="true">
        {body}
      </span>
    </>
  );

  // Intercept quote-CTA links — open the modal instead of navigating.
  if (href && QUOTE_HREFS.has(href)) {
    return (
      <Link
        href={href}
        onClick={(e) => {
          e.preventDefault();
          openQuoteModal();
          onClick?.();
        }}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
