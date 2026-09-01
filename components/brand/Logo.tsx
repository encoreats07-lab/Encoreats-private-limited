
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  badgeText?: string;
}

export default function Logo({
  variant = "full",
  size = "md",
  href = "/",
  className = "",
  badgeText,
}: LogoProps) {
  const sizes = {
    sm: {
      icon: 36,
      text: "text-xl",
    },
    md: {
      icon: 48,
      text: "text-2xl",
    },
    lg: {
      icon: 60,
      text: "text-3xl",
    },
  };

  const currentSize = sizes[size];

  const content = (
    <div
      className={`inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* FULL LOGO - ICON + ENCOREATS */}
      {variant === "full" && (
        <>
          <Image
            src="/images/encoreats-logo.png"
            alt="Encoreats Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain transform group-hover:scale-105 transition-transform duration-300"
          />

          <span
            className={`${currentSize.text} font-bold tracking-tight text-white leading-none`}
          >
            Encoreats
          </span>
        </>
      )}

      {/* ICON ONLY */}
      {variant === "icon" && (
        <Image
          src="/images/encoreats-logo.png"
          alt="Encoreats Logo"
          width={currentSize.icon}
          height={currentSize.icon}
          priority
          className="object-contain"
        />
      )}

      {/* WORDMARK ONLY */}
      {variant === "wordmark" && (
        <div className="leading-none">
          <span
            className={`${currentSize.text} font-bold tracking-tight text-white`}
          >
            Encoreats
          </span>
        </div>
      )}

      {/* OPTIONAL BADGE */}
      {badgeText && (
        <span className="px-2 py-1 text-[9px] uppercase tracking-widest border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 rounded">
          {badgeText}
        </span>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      aria-label="Encoreats Home"
      className="inline-flex"
    >
      {content}
    </Link>
  );
}

