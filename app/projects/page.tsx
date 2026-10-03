import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/property/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { featuredProperties, properties } from "@/data/properties";
import { formatArea, formatPossession, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Signature Projects",
  description: "A curated showcase of Zoyal Properties' landmark residential and commercial projects across India.",
};

const collections = [
  { title: "Ready to Move", text: "Keys in hand — move in this quarter.", href: "/properties?status=Ready%20to%20Move", count: properties.filter((p) => p.status === "Ready to Move").length },
  { title: "New Launches", text: "Be first in line with launch-phase pricing.", href: "/properties?status=New%20Launch", count: properties.filter((p) => p.status === "New Launch").length },
  { title: "Under Construction", text: "Pre-possession plans with staged payments.", href: "/properties?status=Under%20Construction", count: properties.filter((p) => p.status === "Under Construction").length },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="Curated showcase" title={"Signature\n*projects*"} text="Six landmark addresses that define how Zoyal sees the Indian skyline." />

      <div className="container-x space-y-20 pb-24 sm:space-y-32">
        {featuredProperties.map((p, i) => (
          <Reveal key={p.id}>
            <article className={cn("grid items-center gap-8 lg:grid-cols-2 lg:gap-16", i % 2 === 1 && "lg:[&>*:first-child]:order-2")}>
              <Link href={`/properties/${p.slug}`} className="group glow-border relative block aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image src={p.gallery[0]} alt={`${p.title} in ${p.locality}, ${p.city}`} fill sizes="(min-width: 1024px) 50vw, 100vw" priority={i === 0} className="object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <StatusBadge status={p.status} className="absolute left-5 top-5" />
                <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                  <ArrowUpRight className="h-6 w-6" />
                </span>
              </Link>
              <div>
                <p className="font-display text-6xl font-bold text-line/15">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-cyan">{p.type}</p>
                <h2 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">{p.title}</h2>
                <p className="mt-3 flex items-center gap-2 text-muted">
                  <MapPin className="h-4 w-4 text-cyan" /> {p.locality}, {p.city}
                </p>
                <p className="mt-5 max-w-lg leading-relaxed text-muted">{p.description}</p>
                <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-line/15 py-5 text-sm">
                  <div>
                    <dt className="text-muted">From</dt>
                    <dd className="text-gradient font-display text-xl font-semibold">{formatPrice(p.price)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Area</dt>
                    <dd className="font-display text-xl font-semibold">{formatArea(p.area)}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1 text-muted">
                      <CalendarClock className="h-3.5 w-3.5" /> Possession
                    </dt>
                    <dd className="font-display text-xl font-semibold">{formatPossession(p.possession)}</dd>
                  </div>
                </dl>
                <div className="mt-7">
                  <Button href={`/properties/${p.slug}`} arrow>
                    Explore project
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <section className="container-x pb-28" aria-labelledby="collections-heading">
        <h2 id="collections-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          Browse by <span className="text-gradient">stage</span>
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {collections.map((c) => (
            <li key={c.title}>
              <Link href={c.href} className="glass glow-border group flex h-full flex-col justify-between rounded-3xl p-7 transition hover:-translate-y-1">
                <div>
                  <p className="font-display text-xl font-semibold">{c.title}</p>
                  <p className="mt-2 text-sm text-muted">{c.text}</p>
                </div>
                <p className="mt-8 flex items-center justify-between text-sm text-cyan">
                  {c.count} listings <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
