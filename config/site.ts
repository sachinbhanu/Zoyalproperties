/**
 * ONE PLACE TO REBRAND.
 * Change the brand name, contact details, WhatsApp number and default
 * WhatsApp messages here. Colours live in app/globals.css (CSS variables).
 */

const digits = (value: string) => value.replace(/\D/g, "");

/** Read from .env (NEXT_PUBLIC_WHATSAPP_NUMBER): international format, digits only, no "+" */
export const WHATSAPP_NUMBER = digits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "");

/** "919876543210" -> "+91 98765 43210" (falls back to "+<digits>" for other lengths) */
const formatPhone = (n: string) =>
  n.length === 12 && n.startsWith("91") ? `+91 ${n.slice(2, 7)} ${n.slice(7)}` : n ? `+${n}` : "";

export const siteConfig = {
  brand: "Zoyal Properties",
  brandShort: "Zoyal",
  logoLetter: "Z",
  tagline: "Own the skyline of tomorrow.",
  description:
    "Zoyal Properties — premium apartments, villas, penthouses, plots and commercial spaces across India's most sought-after cities.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,
  whatsappNumber: WHATSAPP_NUMBER,
  displayPhone: formatPhone(WHATSAPP_NUMBER),
  /** tel: link target, derived from the same number */
  telHref: `tel:+${WHATSAPP_NUMBER}`,
  email: "hello@zoyalproperties.example",
  address: "Tower B, Cyber Hub Road, DLF Phase 2, Gurugram, Haryana 122002",
  officeHours: "Mon – Sat · 10:00 AM – 7:00 PM IST",
  rera: "RERA registration numbers are placeholders — replace with the actual state RERA IDs (e.g. HRERA-PKL-GGM-000/2025) before going live.",
  disclaimer:
    "Demo website — all listings, prices, projects, testimonials and people are fictional and for showcase purposes only. Not an offer to sell.",
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
  },
  /** Default WhatsApp message templates. Edit freely. */
  messages: {
    general:
      "Hi Zoyal Properties, I'm exploring premium properties and would like some guidance. Could you please get in touch?",
    property: (p: { title: string; locality: string; city: string; price: string }) =>
      `Hi Zoyal Properties, I'm interested in ${p.title} in ${p.locality}, ${p.city} priced at ${p.price}. Please share details.`,
    properties:
      "Hi Zoyal Properties, I'm browsing your listings and would like to shortlist a few options. Can you help?",
    contact:
      "Hi Zoyal Properties, I'd like to schedule a site visit / consultation. Please let me know a suitable time.",
    blog: "Hi Zoyal Properties, I read your latest insight and would like to discuss investment options.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
