type SectionProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  as?: "section" | "aside" | "div";
};

export function Section({
  children,
  id,
  className = "",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={`py-16 md:py-24 ${className}`}>
      {children}
    </Tag>
  );
}
