type SectionHeadingProps = {
  children: React.ReactNode;
  as?: "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  children,
  as: Tag = "h2",
  className = "",
}: SectionHeadingProps) {
  return (
    <Tag
      className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight ${className}`}
    >
      {children}
    </Tag>
  );
}
