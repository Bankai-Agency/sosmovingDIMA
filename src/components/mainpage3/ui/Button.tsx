import Link from "next/link";

type Variant = "primary" | "ghost" | "link";

type Props = {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  arrow?: boolean;
};

export function Button({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  arrow = true,
}: Props) {
  const cls = `m3-btn m3-btn--${variant} ${className}`.trim();
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="m3-btn-arrow" aria-hidden>
          ↗
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
