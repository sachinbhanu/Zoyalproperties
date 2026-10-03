"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HeroScene } from "@/components/three/lazy";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { useApp } from "@/components/providers/AppProvider";
import { heroState } from "@/lib/sceneState";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";
import { stats } from "@/data/content";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { ready } = useApp();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    heroState.progress = v;
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      heroState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      heroState.progress = 0;
      heroState.mouseX = 0;
      heroState.mouseY = 0;
    };
  }, []);

  const textOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -90]);
  const statsOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <section ref={ref} aria-label="Introduction" className="relative h-[230vh] bg-[rgb(6_10_28)]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <HeroScene />

        <div className="force-dark pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(4_7_18/0.65)_100%)]" aria-hidden />
        <div className="force-dark pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgb(4_7_18/0.78)] via-[rgb(4_7_18/0.3)] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgb(4_7_18/0.8)] to-transparent" aria-hidden />

        <div className="force-dark container-x relative z-10 flex h-full flex-col justify-center pb-44 pt-24 text-fg sm:pb-40">
          <motion.div style={{ opacity: textOpacity, y: textY }} className="max-w-5xl">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="eyebrow"
            >
              {siteConfig.brand} · Premium Real Estate · India
            </motion.span>

            <SplitReveal
              as="h1"
              gate={ready}
              delay={0.25}
              text={"Own the *skyline*\nof tomorrow."}
              className="mt-6 font-display text-[clamp(2.7rem,min(11vw,13.5vh),7.2rem)] font-semibold leading-[0.96] tracking-tight"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.9 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-fg/75 sm:text-lg"
            >
              Handpicked sky-homes, villas and penthouses across Gurugram, Mumbai, Bengaluru and beyond — presented the way tomorrow&apos;s cities deserve to be seen.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 1.1 }}
              className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4"
            >
              <Button href="/properties" size="lg" arrow>
                Explore Properties
              </Button>
              <Button href={buildWhatsAppLink({ message: siteConfig.messages.general })} variant="whatsapp" size="lg">
                <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div style={{ opacity: statsOpacity }} className="force-dark absolute inset-x-0 bottom-0 z-10 pb-7 sm:pb-10">
          <div className="container-x">
            <motion.dl
              initial={{ opacity: 0, y: 30 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 1.3 }}
              className="glass grid grid-cols-2 gap-y-5 rounded-3xl px-5 py-5 sm:grid-cols-4 sm:px-8"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center sm:border-r sm:border-line/15 sm:last:border-r-0">
                  <dt className="order-2 text-[11px] uppercase tracking-[0.2em] text-muted">{s.label}</dt>
                  <dd className="font-display text-2xl font-semibold text-fg sm:text-4xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </motion.div>

        <motion.div style={{ opacity: hintOpacity }} className="force-dark absolute bottom-[8.5rem] right-6 z-10 hidden flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted sm:flex lg:right-12" aria-hidden>
          <span className="[writing-mode:vertical-rl]">Scroll to fly through</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-cyan" />
        </motion.div>
      </div>
    </section>
  );
}
