type EyebrowProps = {
  num?: string;
  total?: string;
  children: React.ReactNode;
  withDot?: boolean;
};

export function Eyebrow({ num, total, children, withDot }: EyebrowProps) {
  return (
    <span className="m3-eyebrow">
      {withDot && <span className="m3-eyebrow-dot" aria-hidden />}
      {num && (
        <span className="m3-eyebrow-num">
          {num}
          {total && <span className="m3-eyebrow-total"> / {total}</span>}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
