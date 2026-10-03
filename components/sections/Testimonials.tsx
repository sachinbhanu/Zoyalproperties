"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useDevice } from "@/hooks/useDevice";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name
    .replace(/Dr\.\s*/, "")
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

export function Testimonials() {
  const { reducedMotion } = useDevice();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta: number) => setState(([i]) => [(i + delta + testimonials.length) % testimonials.length, delta]), []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  }, [paused, reducedMotion, go]);

  const t = testimonials[index];

  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="container-x">
        <SectionHeading id="testimonials-heading" eyebrow="Testimonials" title={"Families who found\ntheir *forever* home"} align="center" />

        <div
          className="relative mx-auto mt-14 max-w-4xl"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="glass glow-border relative min-h-[360px] overflow-hidden rounded-[2rem] p-8 sm:min-h-[320px] sm:p-12">
            <Quote className="absolute right-8 top-8 h-16 w-16 text-cyan/15" aria-hidden />
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                aria-live={paused ? "polite" : "off"}
              >
                <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-6 font-display text-xl leading-relaxed sm:text-2xl">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient font-display text-sm font-semibold text-[rgb(4_7_18)]">{initials(t.name)}</span>
                  <span>
                    <span className="block font-medium">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
              {testimonials.map((x, i) => (
                <button
                  key={x.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1}: ${x.name}`}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  className={cn("h-1.5 rounded-full transition-all duration-500", i === index ? "w-10 bg-brand-gradient" : "w-4 bg-line/25 hover:bg-line/50")}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {(
                [
                  [-1, ChevronLeft, "Previous testimonial"],
                  [1, ChevronRight, "Next testimonial"],
                ] as const
              ).map(([d, Icon, label]) => (
                <button key={label} type="button" onClick={() => go(d)} aria-label={label} className="glass flex h-11 w-11 items-center justify-center rounded-full transition hover:border-cyan/60 hover:text-cyan">
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
