"use client";

import SiteLogo from "./SiteLogo";

export default function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <SiteLogo href="/" height={47} />
        {children && (
          <div className="flex items-center gap-5">{children}</div>
        )}
      </div>
    </header>
  );
}
