"use client";
import Link from "next/link";

type Variant = "orange" | "ghost-dark" | "ghost-light";
type Size = "sm" | "md" | "lg";

interface Props {
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  full?: boolean;
  disabled?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  "orange":      "bg-orange text-white hover:bg-orange-dark shadow-sm hover:shadow-md active:scale-[0.98]",
  "ghost-dark":  "bg-white/10 text-white border border-white/20 hover:bg-white/20",
  "ghost-light": "bg-black/5 text-charcoal border border-black/10 hover:bg-black/10",
};
const SIZES: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base",
};

export default function Button({ variant = "orange", size = "md", href, onClick, children, className = "", type = "button", full, disabled }: Props) {
  const cls = `inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 no-underline ${VARIANTS[variant]} ${SIZES[size]} ${full ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;
  if (href) {
    if (href.startsWith("#")) return <a href={href} className={cls}>{children}</a>;
    return <Link href={href} className={cls}>{children}</Link>;
  }
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}