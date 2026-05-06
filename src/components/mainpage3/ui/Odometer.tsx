"use client";

/**
 * Vertical digit-roll odometer — direct port of Terminal Industries'
 * `.odometer / .digit-column / .digit-stack` pattern.
 *
 * Each digit is a column with stacked 0-9; we translateY the stack so the
 * target digit lands in the visible window. CSS handles the animation.
 */
type Props = {
  value: number;
  /** Pad to N digits with leading zeros, default 2. */
  padTo?: number;
};

export function Odometer({ value, padTo = 2 }: Props) {
  const digits = String(value).padStart(padTo, "0").split("").map(Number);
  return (
    <span className="m3-odometer" aria-label={`Step ${value}`}>
      {digits.map((d, i) => (
        <span key={i} className="m3-odometer-col">
          <span
            className="m3-odometer-stack"
            style={{ transform: `translateY(calc(var(--digit-h) * -${d}))` }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
