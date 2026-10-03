"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [open, next, prev]);

  const openAt = (i: number, el: HTMLElement) => {
    triggerRef.current = el;
    setActive(i);
    setOpen(true);
  };

  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <button
          type="button"
          onClick={(e) => openAt(0, e.currentTarget)}
          aria-label={`Open gallery for ${title}`}
          className="group relative aspect-[16/10] overflow-hidden rounded-3xl lg:aspect-auto lg:min-h-[480px]"
        >
          <Image src={images[0]} alt={`${title} — main view`} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs text-white backdrop-blur-md">
            <Expand className="h-4 w-4" /> View all {images.length} photos
          </span>
        </button>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-[1fr_1fr]">
          {images.slice(1, 3).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={(e) => openAt(i + 1, e.currentTarget)}
              aria-label={`Open photo ${i + 2} of ${images.length}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-auto"
            >
              <Image src={src} alt={`${title} — view ${i + 2}`} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
              {i === 1 && images.length > 3 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 font-display text-3xl font-semibold text-white backdrop-blur-[2px]">+{images.length - 3}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} photo gallery`}
            className="fixed inset-0 z-[150] flex flex-col bg-black/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="flex items-center justify-between p-4 text-white">
              <p className="text-sm">
                {title} · {active + 1} / {images.length}
              </p>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close gallery" className="rounded-full bg-white/10 p-2.5 hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div key={active} className="absolute inset-4 sm:inset-10" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <Image src={images[active]} alt={`${title} — photo ${active + 1}`} fill sizes="100vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
              {(
                [
                  [prev, ChevronLeft, "Previous photo", "left-3 sm:left-6"],
                  [next, ChevronRight, "Next photo", "right-3 sm:right-6"],
                ] as const
              ).map(([fn, Icon, label, pos]) => (
                <button key={label} type="button" onClick={fn} aria-label={label} className={cn("absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur hover:bg-white/25", pos)}>
                  <Icon className="h-6 w-6" />
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-2 p-4" onClick={(e) => e.stopPropagation()}>
              {images.map((src, i) => (
                <button key={src} type="button" onClick={() => setActive(i)} aria-label={`Go to photo ${i + 1}`} aria-current={i === active} className={cn("relative h-14 w-20 overflow-hidden rounded-lg border-2 transition", i === active ? "border-cyan" : "border-transparent opacity-60 hover:opacity-100")}>
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
