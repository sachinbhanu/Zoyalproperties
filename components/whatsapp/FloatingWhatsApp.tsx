"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { getContextMessage } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { MessagePopover } from "@/components/whatsapp/WhatsAppButton";
import { cn } from "@/lib/utils";

/** Floating bottom-right WhatsApp launcher — visible on every page, context-aware. */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onPropertyPage = /^\/properties\/[^/]+/.test(pathname);

  return (
    <div className={cn("fixed right-4 z-[70] sm:right-6", onPropertyPage ? "bottom-24 sm:bottom-24" : "bottom-5 sm:bottom-6")}>
      <AnimatePresence>
        {open && <MessagePopover initial={getContextMessage(pathname)} onClose={() => setOpen(false)} className="bottom-full right-0 mb-4" />}
      </AnimatePresence>

      <div className="group relative">
        <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-fg px-3 py-1.5 text-xs font-medium text-bg opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
          Chat with us on WhatsApp
        </span>
        <span aria-hidden className="absolute inset-0 animate-pulseRing rounded-full bg-[#25D366]" />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Chat on WhatsApp — customize and send a message"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_-4px_rgba(37,211,102,0.7)] transition-transform hover:scale-110 active:scale-95"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
