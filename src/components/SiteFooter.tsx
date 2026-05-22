import Link from "next/link";
import SiteLogo from "./SiteLogo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-stone-100">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <SiteLogo href="/" height={36} />
        <p>Privacy-first · No tracking · Open-source encryption</p>
        <div className="flex gap-5">
          <Link href="/think" className="hover:text-sage transition-colors">App</Link>
          <Link href="/gallery" className="hover:text-sage transition-colors">Journal</Link>
        </div>
      </div>
    </footer>
  );
}
