import Link from 'next/link';

type ButtonProps = {
  href?: string;
  variant?: 'primary' | 'outline';
  size?: 'default' | 'big';
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  external,
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-bold leading-[1.4em] rounded-[0.75rem] transition-colors';
  const sizes = {
    default: 'text-[0.8rem] px-[1rem] py-[0.65rem]',
    big: 'text-[0.9rem] px-[1.5rem] py-[0.85rem]',
  };
  const variants = {
    primary: 'bg-accent text-black border border-accent hover:bg-[#ffec6a]',
    outline: 'border border-accent text-accent hover:bg-accent hover:text-black',
  };

  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href && !external) return <Link href={href} className={cls}>{children}</Link>;
  if (href && external) return <a href={href} className={cls}>{children}</a>;
  return <button className={cls}>{children}</button>;
}
