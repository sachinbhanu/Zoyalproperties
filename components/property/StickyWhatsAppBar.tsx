"use client";

import { motion } from "framer-motion";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

/** Fixed bottom bar on property pages with an auto-filled, editable WhatsApp message. */
export function StickyWhatsAppBar({ property: p }: { property: Property }) {
  const message = siteConfig.messages.property({ title: p.title, locality: p.locality, city: p.city, price: formatPrice(p.price) });
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass fixed inset-x-0 bottom-0 z-[60] border-x-0 border-b-0 px-4 py-3 sm:px-8"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold sm:text-base">{p.title}</p>
          <p className="text-xs text-muted">
            <span className="text-gradient font-semibold">{formatPrice(p.price)}</span> · {p.locality}, {p.city}
          </p>
        </div>
        <WhatsAppButton message={message} label="Enquire on WhatsApp" customizable size="md" className="shrink-0" popoverClassName="bottom-full right-0 mb-4" />
      </div>
    </motion.div>
  );
}
