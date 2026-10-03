"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useApp } from "@/components/providers/AppProvider";

const LAYERS = 16;

export function Preloader() {
  const { setReady } = useApp();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("zoyal-seen") === "1";
    } catch {
      /* ignore */
    }
    if (seen) {
      setVisible(false);
      setReady(true);
      return;
    }

    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 600 : 2300;
    const start = performance.now();
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem("zoyal-seen", "1");
      } catch {
        /* ignore */
      }
      setTimeout(() => {
        document.body.style.overflow = "";
        setVisible(false);
        setReady(true);
      }, 450);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      // hold at 94% until the page has actually loaded
      const cap = document.readyState === "complete" ? 100 : 94;
      const value = Math.min(cap, Math.round(eased * 100));
      setProgress(value);
      if (value >= 100) finish();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [setReady]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-preloader
          role="status"
          aria-label="Loading"
          className="force-dark fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[rgb(4_7_18)]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="mesh-bg" aria-hidden>
            <span style={{ left: "-10%", top: "-20%", background: "rgb(var(--violet))" }} />
            <span style={{ right: "-15%", bottom: "-25%", background: "rgb(var(--cyan))", animationDelay: "-6s" }} />
          </div>
          <div className="grid-lines absolute inset-0" aria-hidden />

          {/* CSS 3D extruded logomark */}
          <div className="relative h-40 w-40" style={{ perspective: 900 }} aria-hidden>
            <div className="logo3d animate-spin3d relative h-full w-full">
              {Array.from({ length: LAYERS }).map((_, i) => {
                const front = i === LAYERS - 1;
                return (
                  <span
                    key={i}
                    className="absolute inset-0 flex items-center justify-center font-display text-[9.5rem] font-bold leading-none"
                    style={{
                      transform: `translateZ(${(i - LAYERS / 2) * 3}px)`,
                      color: front ? "rgb(238 242 255)" : `rgb(${34 + i * 6} ${211 - i * 8} ${238 - i * 2})`,
                      opacity: front ? 1 : 0.55,
                      textShadow: front ? "0 0 40px rgb(34 211 238 / 0.8)" : "none",
                    }}
                  >
                    {siteConfig.logoLetter}
                  </span>
                );
              })}
            </div>
          </div>

          <p className="mt-12 font-display text-sm uppercase tracking-[0.5em] text-fg/80">{siteConfig.brand}</p>

          <div className="mt-10 flex w-64 flex-col items-center gap-3">
            <div className="h-px w-full overflow-hidden bg-white/10">
              <motion.div className="h-full bg-brand-gradient" animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.1 }} />
            </div>
            <span className="font-display text-5xl font-light tabular-nums text-fg">
              {progress.toString().padStart(2, "0")}
              <span className="text-xl text-muted">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
