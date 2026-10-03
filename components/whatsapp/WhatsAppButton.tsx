"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PencilLine, RotateCcw, X } from "lucide-react";
import { buildWhatsAppLink, getContextMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Props {
  /** Defaults to a message derived from the current route */
  message?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "whatsapp" | "ghost" | "primary";
  /** Shows a "Customize message" popover so the visitor can edit text first */
  customizable?: boolean;
  className?: string;
  /** Position classes for the customize popover (default opens below the button) */
  popoverClassName?: string;
}

/** Reusable WhatsApp CTA. */
export function WhatsAppButton({ message, label = "Chat on WhatsApp", size = "md", variant = "whatsapp", customizable = false, className, popoverClassName = "left-0 top-full mt-3" }: Props) {
  const pathname = usePathname();
  const initial = message ?? getContextMessage(pathname);
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      <Button href={buildWhatsAppLink({ message: initial })} variant={variant} size={size}>
        <WhatsAppIcon className="h-5 w-5" />
        {label}
      </Button>
      {customizable && (
        <>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Customize WhatsApp message"
            className="glass flex h-11 w-11 items-center justify-center rounded-full text-fg transition hover:border-[#25D366]/70"
          >
            <PencilLine className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {open && <MessagePopover initial={initial} onClose={() => setOpen(false)} className={popoverClassName} />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

/** Editable-message popover used by the button and the floating widget. */
export function MessagePopover({ initial, onClose, className }: { initial: string; onClose: () => void; className?: string }) {
  const [text, setText] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setText(initial), [initial]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label="Customize your WhatsApp message"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className={cn("glass glow-border absolute z-50 w-[min(92vw,22rem)] rounded-2xl p-4 shadow-2xl", className)}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-sm font-medium text-fg">Customize your message</p>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 text-muted hover:text-fg">
          <X className="h-4 w-4" />
        </button>
      </div>
      <label htmlFor="wa-msg" className="sr-only">
        WhatsApp message
      </label>
      <textarea
        id="wa-msg"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="input-base resize-none text-[13px] leading-relaxed"
      />
      <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => setText(initial)} className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <Button href={buildWhatsAppLink({ message: text.trim() || initial })} variant="whatsapp" size="sm" magnetic={false} onClick={onClose}>
          <WhatsAppIcon className="h-4 w-4" /> Open WhatsApp
        </Button>
      </div>
    </motion.div>
  );
}
