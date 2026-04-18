import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  /** @deprecated retained for API compatibility */
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

/**
 * Pill button — based on startduck.com .u-button spec:
 * border-radius: 100vw (full pill), font-weight: 500, letter-spacing: -0.03em,
 * line-height: 100%, padding 1.25em equivalent (px-8 py-4).
 * Primary variant filled with our accent yellow.
 */
const base =
  "inline-flex items-center justify-center rounded-full font-medium leading-none tracking-[-0.03em] whitespace-nowrap px-8 py-4 text-base transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary: "bg-accent text-accent-text hover:bg-accent-hover",
  outline:
    "border border-white/20 text-white hover:bg-white/10 backdrop-blur-[40px]",
  ghost: "text-white hover:bg-white/10",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
