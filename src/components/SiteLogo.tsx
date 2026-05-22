"use client";

import Image from "next/image";
import Link from "next/link";

// Wordmark natural dimensions: 1400 × 408 px (aspect ≈ 3.43 : 1)
const WORDMARK_W = 1400;
const WORDMARK_H = 408;

interface SiteLogoProps {
  /** Navigate to this href when clicked. Omit to render a plain div (use onClick instead). */
  href?: string;
  /** Rendered height in px. Width is derived from the natural aspect ratio. Default: 40 */
  height?: number;
  /** Called when the logo is clicked. Only used when href is not provided. */
  onClick?: () => void;
  className?: string;
}

export default function SiteLogo({
  href,
  height = 40,
  onClick,
  className = "",
}: SiteLogoProps) {
  const width = Math.round((height / WORDMARK_H) * WORDMARK_W);

  const img = (
    <Image
      src="/logo-wordmark.png"
      alt="Your Second Thought"
      width={width}
      height={height}
      priority
      className="select-none"
    />
  );

  const base = `inline-flex items-center shrink-0 ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {img}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={base} type="button">
        {img}
      </button>
    );
  }

  return <div className={base}>{img}</div>;
}
