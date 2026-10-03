import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${siteConfig.brand} — home`} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient font-display text-xl font-bold text-[rgb(4_7_18)] shadow-[0_0_24px_-4px_rgb(var(--cyan)/0.8)] transition-transform duration-500 group-hover:rotate-[360deg]">
        {siteConfig.logoLetter}
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        {siteConfig.brandShort}
        <span className="ml-1 font-normal text-muted">Properties</span>
      </span>
    </Link>
  );
}
