import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase, Building2, Crown, Home, Map as MapIcon, type LucideIcon } from "lucide-react";
import { categories } from "@/data/content";
import { properties } from "@/data/properties";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<string, LucideIcon> = { Building2, Home, Crown, Map: MapIcon, Briefcase };

export function Categories() {
  return (
    <section className="section-y relative" aria-labelledby="categories-heading">
      <div className="container-x">
        <SectionHeading id="categories-heading" eyebrow="Property categories" title={"Find your *kind*\nof extraordinary"} text="From sky-high apartments to build-your-own plots — pick a category and dive in." />

        <Reveal delay={0.1}>
          <ul className="mt-14 flex flex-col gap-4 lg:h-[540px] lg:flex-row">
            {categories.map((c) => {
              const Icon = icons[c.icon];
              const count = properties.filter((p) => p.type === c.type).length;
              return (
                <li key={c.type} className="min-h-[200px] flex-1 transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-h-0 lg:hover:flex-[2.6] lg:focus-within:flex-[2.6]">
                  <Link href={`/properties?type=${c.type}`} className="group glow-border relative block h-full overflow-hidden rounded-3xl">
                    <Image src={c.image} alt={`${c.type} category`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgb(4_7_18)] via-[rgb(4_7_18)]/40 to-[rgb(4_7_18)]/10 transition-colors group-hover:from-[rgb(4_7_18)]/90" />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                      <div className="flex items-start justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md transition group-hover:bg-brand-gradient group-hover:text-[rgb(4_7_18)]">
                          <Icon className="h-6 w-6" />
                        </span>
                        <ArrowUpRight className="h-6 w-6 -translate-x-2 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-cyan">{count} listings</p>
                        <h3 className="mt-1 font-display text-3xl font-semibold lg:[writing-mode:horizontal-tb]">{c.type === "Plot" ? "Plots" : c.type === "Commercial" ? "Commercial" : `${c.type}s`}</h3>
                        <p className="mt-2 max-h-0 overflow-hidden text-sm text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100 max-lg:max-h-20 max-lg:opacity-100">{c.text}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
