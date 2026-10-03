"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { amenityShowcase } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/**
 * Desktop: the section pins and a GSAP ScrollTrigger scrubs the track sideways.
 * Mobile / reduced-motion: a native horizontal scroll-snap carousel.
 */
export function Amenities() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;
      setPinned(true);
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => {
        setPinned(false);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="force-dark relative overflow-hidden bg-[rgb(4_7_18)] text-fg md:flex md:h-screen md:flex-col md:justify-center" aria-labelledby="amenities-heading">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative pb-8 pt-20 md:pb-10 md:pt-0">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="amenities-heading" eyebrow="Amenities showcase" title={"Life, *elevated*\nin every detail"} />
          <p className="hidden max-w-xs text-sm text-muted md:block">Keep scrolling — the amenities glide past as you move down the page.</p>
        </div>
      </div>

      <div className={cn("relative", pinned ? "overflow-hidden" : "overflow-x-auto no-scrollbar")}>
        <div ref={trackRef} className={cn("flex gap-5 px-5 pb-16 md:gap-8 md:px-12 md:pb-0", !pinned && "snap-x snap-mandatory")}>
          {amenityShowcase.map((a, i) => (
            <article key={a.title} className="group glass glow-border relative aspect-[4/5] w-[78vw] shrink-0 snap-center overflow-hidden rounded-3xl sm:w-[52vw] md:aspect-auto md:h-[52vh] md:w-[34vw] lg:w-[28vw]">
              <Image src={a.image} alt={`${a.title} at a Zoyal development`} fill sizes="(min-width: 1024px) 28vw, 78vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(4_7_18)] via-[rgb(4_7_18)]/30 to-transparent" />
              <span className="absolute left-6 top-5 font-display text-6xl font-bold text-white/15">{String(i + 1).padStart(2, "0")}</span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl font-semibold text-white">{a.title}</h3>
                <p className="mt-1 text-sm text-white/75">{a.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {pinned && (
        <div className="container-x relative mt-8 hidden md:block" aria-hidden>
          <div className="h-px w-full bg-white/10">
            <div ref={barRef} className="h-full origin-left scale-x-0 bg-brand-gradient" />
          </div>
        </div>
      )}
    </section>
  );
}
