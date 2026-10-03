import { stats } from "@/data/content";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { MeshBackground } from "@/components/ui/GlassCard";

export function StatsCounters() {
  return (
    <section aria-label="Zoyal in numbers" className="relative overflow-hidden py-20 sm:py-28">
      <MeshBackground className="opacity-60" />
      <div className="container-x relative">
        <dl className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="glass glow-border group relative overflow-hidden rounded-3xl p-6 text-center sm:p-9">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan/20 blur-3xl transition-all duration-700 group-hover:scale-150" aria-hidden />
                <dd className="text-gradient font-display text-5xl font-semibold tracking-tight sm:text-7xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
                <dt className="mt-3 text-xs uppercase tracking-[0.25em] text-muted sm:text-sm">{s.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
