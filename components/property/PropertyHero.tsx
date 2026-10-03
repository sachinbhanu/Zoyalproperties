"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { BedDouble, ChevronRight, MapPin, Maximize2 } from "lucide-react";
import type { Property } from "@/data/properties";
import { formatArea, formatPossession, formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/property/PropertyCard";
import { TiltCard } from "@/components/ui/TiltCard";

export function PropertyHero({ property: p }: { property: Property }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[88vh] min-h-[600px] overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image src={p.gallery[0]} alt={`${p.title} — ${p.type} in ${p.locality}, ${p.city}`} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-[rgb(4_7_18)]/60" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgb(var(--violet)/0.35),transparent_55%)]" aria-hidden />

      <motion.div style={{ opacity: fade }} className="container-x relative z-10 flex h-full flex-col justify-end pb-14 pt-32">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-white/80">
          <Link href="/" className="hover:text-cyan">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/properties" className="hover:text-cyan">Properties</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/properties?city=${p.city}`} className="hover:text-cyan">{p.city}</Link>
          <ChevronRight className="h-3 w-3" />
          <span aria-current="page" className="text-white">{p.title}</span>
        </nav>

        <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <StatusBadge status={p.status} />
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {p.title}
            </motion.h1>
            <p className="mt-4 flex items-center gap-2 text-lg text-white/85">
              <MapPin className="h-5 w-5 text-cyan" /> {p.locality}, {p.city}, {p.state}
            </p>
            <p className="mt-2 max-w-xl text-white/70">{p.tagline}</p>
          </div>

          <TiltCard max={7} className="lg:justify-self-end">
            <div className="glass glow-border w-full rounded-3xl p-6 text-fg sm:min-w-[340px]">
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted">Starting price</p>
              <p className="text-gradient mt-1 font-display text-5xl font-semibold" style={{ transform: "translateZ(50px)" }}>
                {formatPrice(p.price)}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line/15 pt-5 text-center text-sm">
                <div>
                  <BedDouble className="mx-auto h-5 w-5 text-cyan" />
                  <p className="mt-1 font-medium">{p.bhk > 0 ? `${p.bhk} BHK` : p.type}</p>
                </div>
                <div>
                  <Maximize2 className="mx-auto h-5 w-5 text-cyan" />
                  <p className="mt-1 font-medium">{formatArea(p.area)}</p>
                </div>
                <div>
                  <MapPin className="mx-auto h-5 w-5 text-cyan" />
                  <p className="mt-1 font-medium">{formatPossession(p.possession)}</p>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </motion.div>
    </section>
  );
}
