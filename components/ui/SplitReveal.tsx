"use client";

import { createElement, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

interface Props {
  /** Use "\n" for line breaks and *word* to apply the brand gradient to a word. */
  text: string;
  as?: Tag;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
  /** When provided, the reveal waits for this flag instead of scroll-into-view (e.g. after the preloader). */
  gate?: boolean;
}

const container: Variants = { hidden: {}, show: {} };
const word: Variants = {
  hidden: { y: "115%", rotate: 3 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } },
};

/** Staggered, masked line/word text reveal. */
export function SplitReveal({ text, as = "h2", className, id, delay = 0, stagger = 0.055, gate }: Props) {
  const lines = text.split("\n");
  const plain = text.replace(/\*/g, "").replace(/\n/g, " ");

  const motionProps =
    gate === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } }
      : { initial: "hidden", animate: gate ? "show" : "hidden" };

  const content: ReactNode = (
    <motion.span
      aria-hidden
      className="block"
      variants={container}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      {...motionProps}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((w, wi) => {
            const m = w.match(/^\*(.+)\*([^*]*)$/);
            const grad = Boolean(m);
            const label = m ? m[1] : w;
            const tail = m ? m[2] : "";
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span variants={word} className={cn("inline-block origin-left will-change-transform", grad && "text-gradient")}>
                  {label}
                  {tail && <span className="text-fg">{tail}</span>}
                </motion.span>
                {wi < line.split(" ").length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      ))}
    </motion.span>
  );

  return createElement(as, { className, id, "aria-label": plain }, content);
}
