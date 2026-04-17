import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const base =
  "relative inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent overflow-hidden active:scale-[0.97]";

const variants = {
  primary:
    "bg-accent text-accent-text shimmer-btn hover:shadow-[0_0_30px_6px_rgba(255,229,51,0.3)]",
  outline:
    "border border-border text-white hover:border-accent/50 hover:bg-accent/5 glow-border-btn",
  ghost:
    "text-text hover:text-white hover:bg-surface-hover",
};

const sizes = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <span className="shimmer-sweep" aria-hidden="true" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {inner}
    </button>
  );
}
