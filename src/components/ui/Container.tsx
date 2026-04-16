export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-[72rem] mx-auto px-[1rem] ${className}`}>{children}</div>
  );
}
