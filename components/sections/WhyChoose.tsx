"use client";

import { motion } from "framer-motion";
import { Banknote, Gem, Handshake, ShieldCheck, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import { whyChoose } from "@/data/content";
import { FloatingShapes } from "@/components/three/lazy";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<string, LucideIcon> = { ShieldCheck, Gem, Handshake, TrendingUp, Banknote, Sparkles };

export function WhyChoose() {
  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="why-heading">
      <div className="container-x relative">
        <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr]">
          <SectionHeading id="why-heading" eyebrow="Why choose Zoyal" title={"Built on trust.\nDesigned for *tomorrow*."} text="We pair old-fashioned honesty with new-age technology — so every decision you make is clear, confident and beautifully informed." />
          <div className="relative -my-6 hidden h-[340px] lg:block" aria-hidden>
            <FloatingShapes variant="a" />
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.08}>
                <motion.article
                  whileHover="hover"
                  initial="rest"
                  className="glass glow-border group relative h-full overflow-hidden rounded-3xl p-7"
                >
                  <div className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-violet/25 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-cyan/25" aria-hidden />
                  <motion.div
                    variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: [0, -8, 8, 0], scale: 1.12 } }}
                    transition={{ duration: 0.6 }}
                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-[rgb(4_7_18)] shadow-[0_0_30px_-6px_rgb(var(--cyan)/0.8)]"
                  >
                    <Icon className="h-7 w-7" />
                  </motion.div>
                  <h3 className="relative mt-6 font-display text-xl font-semibold">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                  <motion.span variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.5 }} className="absolute inset-x-7 bottom-0 h-0.5 origin-left bg-brand-gradient" />
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
