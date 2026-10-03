import type { ReactNode } from "react";
import { MeshBackground } from "@/components/ui/GlassCard";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({ eyebrow, title, text, children }: { eyebrow: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 sm:pb-20 sm:pt-44">
      <MeshBackground className="opacity-70" />
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <SplitReveal as="h1" text={title} delay={0.1} className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl" />
        {text && (
          <Reveal delay={0.25}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{text}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.35}>{children}</Reveal>}
      </div>
    </section>
  );
}
