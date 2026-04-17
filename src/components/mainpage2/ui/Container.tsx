type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "nav" | "header" | "footer";
};

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
