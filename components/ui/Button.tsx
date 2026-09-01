import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium uppercase tracking-widest transition-all duration-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-champagne disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-warm-ivory text-obsidian hover:bg-champagne hover:text-obsidian shadow-lg",
    secondary: "bg-transparent border border-warm-ivory/20 text-warm-ivory hover:border-champagne hover:text-champagne",
    accent: "bg-champagne text-obsidian hover:bg-champagne-light shadow-lg",
    ghost: "bg-transparent text-warm-ivory hover:text-champagne hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-xs font-semibold",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
