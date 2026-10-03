"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useScroll } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { IndiaMapScene } from "@/components/three/lazy";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { mapLocations } from "@/data/content";
import { projectCountByCity } from "@/data/properties";
import { useDevice } from "@/hooks/useDevice";
import { cn } from "@/lib/utils";

export function LocationsMap() {
  const router = useRouter();
  const { isTouch } = useDevice();
  const ref = useRef<HTMLElement>(null);
  const tapped = useRef<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const onActive = useCallback(
    (city: string | null) => {
      // On touch, hover-out fires right after a tap — keep the card open until another city is tapped
      if (isTouch && city === null) return;
      setActive(city);
    },
    [isTouch]
  );

  const onSelect = useCallback(
    (city: string) => {
      if (isTouch && tapped.current !== city) {
        tapped.current = city;
        setActive(city);
        return;
      }
      router.push(`/properties?city=${encodeURIComponent(city)}`);
    },
    [isTouch, router]
  );

  return (
    <section ref={ref} id="locations" className="force-dark relative overflow-hidden bg-[rgb(4_7_18)] text-fg" aria-labelledby="locations-heading">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative grid items-center gap-10 py-24 lg:grid-cols-[0.8fr_1.4fr] lg:py-32">
        <div className="relative z-10">
          <SectionHeading id="locations-heading" eyebrow="Explore locations" title={"Seven cities.\nOne *signature*."} text="Hover a glowing node to see live project counts, then click to filter properties in that city." />
          <Reveal delay={0.1}>
            <ul className="mt-8 grid grid-cols-2 gap-3" aria-label="Cities">
              {mapLocations.map((l) => {
                const count = projectCountByCity(l.city);
                return (
                  <li key={l.city}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(l.city)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(l.city)}
                      onBlur={() => setActive(null)}
                      onClick={() => router.push(`/properties?city=${encodeURIComponent(l.city)}`)}
                      className={cn("glass group flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left transition", active === l.city && "border-gold/60 bg-gold/10")}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-cyan" /> {l.city}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted">
                        {count}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <div className="relative h-[460px] sm:h-[600px] lg:h-[700px]" role="img" aria-label="Interactive 3D map of India with glowing city nodes. Use the city list to browse by location.">
          <IndiaMapScene active={active} onActive={onActive} onSelect={onSelect} progress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
