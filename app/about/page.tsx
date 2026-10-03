import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Heart, Target } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StatsCounters } from "@/components/sections/StatsCounters";
import { ContactBand } from "@/components/sections/ContactBand";
import { team, timeline } from "@/data/content";
import { siteConfig } from "@/config/site";
import { unsplash, IMG } from "@/data/images";

export const metadata: Metadata = {
  title: "About Us",
  description: `The story, vision and team behind ${siteConfig.brand} — premium real estate advisory across eight Indian cities.`,
};

const pillars = [
  { Icon: Eye, title: "Vision", text: "To make premium real estate in India transparent, immersive and genuinely joyful to explore." },
  { Icon: Target, title: "Mission", text: "Curate fewer, better homes and guide every family with data, honesty and care — from first call to key handover." },
  { Icon: Heart, title: "Values", text: "Radical transparency. Design obsession. Relationships that outlast the transaction." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Our story" title={"Twelve years of\nbuilding *trust*"} text={`${siteConfig.brand} started with a simple belief: buying a home should feel exciting, not exhausting.`} />

      <section className="container-x grid items-center gap-12 pb-24 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] glow-border">
            <Image src={unsplash(IMG.towerGlass, 1200)} alt="Glass skyscraper rising against the sky" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
          </div>
        </Reveal>
        <div className="space-y-5 text-lg leading-relaxed text-muted">
          <Reveal>
            <p>
              Founded in Gurugram in 2014, we began as a three-person advisory team helping first-time buyers navigate a noisy market. Today we guide thousands of families across eight cities, from sea-facing Mumbai apartments to garden villas in Bengaluru.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              What hasn&apos;t changed is how we work: we only showcase projects we would buy ourselves, we put every number on the table, and we stay with you long after the paperwork is done.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm text-gold">
              This is a demo website. {siteConfig.brand}, its people, projects and testimonials are fictional and created for showcase purposes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-24" aria-label="Vision, mission and values">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="glass glow-border h-full rounded-3xl p-8">
                <Icon className="h-9 w-9 text-cyan" />
                <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <StatsCounters />

      {/* Timeline */}
      <section className="section-y container-x" aria-labelledby="timeline-heading">
        <SectionHeading id="timeline-heading" eyebrow="Timeline" title={"Our journey\nso *far*"} />
        <ol className="relative mt-14 space-y-10 border-l border-line/20 pl-8 sm:pl-12">
          {timeline.map((t, i) => (
            <li key={t.year} className="relative">
              <span className="absolute -left-[2.55rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gradient shadow-[0_0_16px_rgb(var(--cyan)/0.8)] sm:-left-[3.55rem]" aria-hidden />
              <Reveal delay={i * 0.05}>
                <p className="font-display text-4xl font-semibold text-gradient">{t.year}</p>
                <h3 className="mt-1 font-display text-xl font-semibold">{t.title}</h3>
                <p className="mt-1 max-w-xl text-muted">{t.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Team */}
      <section className="container-x pb-28" aria-labelledby="team-heading">
        <SectionHeading id="team-heading" eyebrow="Leadership" title={"The people behind\nthe *skyline*"} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={i * 0.08}>
                <div className="glass glow-border group h-full rounded-3xl p-6 text-center transition hover:-translate-y-2">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-gradient font-display text-3xl font-semibold text-[rgb(4_7_18)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" aria-hidden>
                    {m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{m.name}</h3>
                  <p className="text-sm text-cyan">{m.role}</p>
                  <p className="mt-3 text-sm text-muted">{m.bio}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <ContactBand />
    </>
  );
}
