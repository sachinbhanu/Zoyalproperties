"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, MapPin, Maximize2 } from "lucide-react";
import type { Property, PropertyStatus } from "@/data/properties";
import { formatArea, formatPossession, formatPrice } from "@/lib/format";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

const statusStyles: Record<PropertyStatus, string> = {
  "Ready to Move": "border-emerald-400/40 bg-emerald-400/15 text-emerald-300",
  "Under Construction": "border-amber-400/40 bg-amber-400/15 text-amber-300",
  "New Launch": "border-violet/50 bg-violet/20 text-[rgb(196_181_253)]",
};

export function StatusBadge({ status, className }: { status: PropertyStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wider backdrop-blur-md", statusStyles[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

type Variant = "grid" | "list" | "feature";

export function PropertyCard({ property: p, variant = "grid", priority = false }: { property: Property; variant?: Variant; priority?: boolean }) {
  const alt = `${p.title} — ${p.type} in ${p.locality}, ${p.city}`;
  const sizes =
    variant === "feature" ? "(min-width: 1024px) 66vw, 100vw" : variant === "list" ? "(min-width: 768px) 360px, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  if (variant === "list") {
    return (
      <Link href={`/properties/${p.slug}`} className="group glass glow-border flex flex-col overflow-hidden rounded-3xl md:flex-row">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden md:aspect-auto md:w-[360px]">
          <Image src={p.gallery[0]} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-[900ms] group-hover:scale-110" />
          <StatusBadge status={p.status} className="absolute left-4 top-4" />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-4 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan">{p.type}</p>
            <h3 className="mt-1 font-display text-2xl font-semibold">{p.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-4 w-4 text-cyan" /> {p.locality}, {p.city}
            </p>
            <p className="mt-3 line-clamp-2 max-w-xl text-sm text-muted">{p.description}</p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              {p.bhk > 0 && (
                <span className="flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4" /> {p.bhk} BHK
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Maximize2 className="h-4 w-4" /> {formatArea(p.area)}
              </span>
              <span>Possession {formatPossession(p.possession)}</span>
            </div>
            <p className="font-display text-2xl font-semibold text-gradient">{formatPrice(p.price)}</p>
          </div>
        </div>
      </Link>
    );
  }

  const isFeature = variant === "feature";
  return (
    <TiltCard className="h-full" max={isFeature ? 5 : 8}>
      <Link
        href={`/properties/${p.slug}`}
        className={cn("group glass glow-border relative block h-full overflow-hidden rounded-3xl", isFeature && "min-h-[420px] lg:min-h-0")}
      >
        <div className={cn("relative overflow-hidden", isFeature ? "absolute inset-0" : "aspect-[4/3]")}>
          <Image
            src={p.gallery[0]}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgb(4_7_18)] via-[rgb(4_7_18)]/30 to-transparent" />
          <StatusBadge status={p.status} className="absolute left-4 top-4" />
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>

        <div className={cn("relative flex flex-col justify-end", isFeature ? "absolute inset-x-0 bottom-0 p-6 sm:p-8" : "p-5")} style={{ transform: "translateZ(40px)" }}>
          {!isFeature && <div className="absolute inset-0 -z-10 bg-surface/80" />}
          <p className={cn("text-[11px] uppercase tracking-[0.22em]", isFeature ? "text-cyan" : "text-cyan")}>{p.type}</p>
          <h3 className={cn("mt-1 font-display font-semibold leading-tight", isFeature ? "text-2xl text-white sm:text-4xl" : "text-xl text-fg")}>{p.title}</h3>
          <p className={cn("mt-1 flex items-center gap-1.5 text-sm", isFeature ? "text-white/80" : "text-muted")}>
            <MapPin className="h-4 w-4 text-cyan" /> {p.locality}, {p.city}
          </p>
          {isFeature && <p className="mt-2 max-w-md text-sm text-white/70">{p.tagline}</p>}
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className={cn("font-display font-semibold text-gradient", isFeature ? "text-3xl" : "text-xl")}>{formatPrice(p.price)}</p>
            <p className={cn("flex items-center gap-3 text-xs", isFeature ? "text-white/80" : "text-muted")}>
              {p.bhk > 0 && <span>{p.bhk} BHK</span>}
              <span>{formatArea(p.area)}</span>
            </p>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
