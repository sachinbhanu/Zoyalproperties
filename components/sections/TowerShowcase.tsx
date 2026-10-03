"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { Building, CalendarClock, Layers, Ruler } from "lucide-react";
import { TowerScene } from "@/components/three/lazy";
import { getPropertyBySlug } from "@/data/properties";
import { formatArea, formatPossession, formatPrice } from "@/lib/format";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { siteConfig } from "@/config/site";

export function TowerShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = getPropertyBySlug("aurelia-skyline-residences-golf-course-road")!;

  const facts = [
    { Icon: Layers, label: "Storeys", value: "52" },
    { Icon: Ruler, label: "Residences from", value: formatArea(p.area) },
    { Icon: CalendarClock, label: "Possession", value: formatPossession(p.possession) },
    { Icon: Building, label: "Starting at", value: formatPrice(p.price) },
  ];

  return (
    <section ref={ref} className="force-dark relative overflow-hidden bg-[rgb(4_7_18)] text-fg" aria-labelledby="spotlight-heading">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative grid items-center gap-8 py-24 lg:grid-cols-2 lg:py-32">
        <div className="relative z-10">
          <SectionHeading id="spotlight-heading" eyebrow="Project spotlight" title={"Meet the *Aurelia*\nSkyline Tower"} text={`${p.tagline}. A 52-storey kinetic landmark on Golf Course Road — drag, scroll and watch it come alive.`} />
          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-2 gap-4">
              {facts.map(({ Icon, label, value }) => (
                <div key={label} className="glass rounded-2xl p-4">
                  <Icon className="h-5 w-5 text-cyan" />
                  <dt className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted">{label}</dt>
                  <dd className="mt-1 font-display text-xl font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={`/properties/${p.slug}`} arrow size="lg">
                View residences
              </Button>
              <WhatsAppButton message={siteConfig.messages.property({ title: p.title, locality: p.locality, city: p.city, price: formatPrice(p.price) })} label="Ask about Aurelia" size="lg" variant="ghost" />
            </div>
          </Reveal>
        </div>

        <div className="relative h-[520px] sm:h-[640px] lg:h-[720px]" aria-hidden>
          <TowerScene progress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
