import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { getPropertyBySlug } from "@/data/properties";

export interface WhatsAppLinkArgs {
  phone?: string;
  message: string;
}

/** Returns https://wa.me/<number>?text=<encoded message> */
export function buildWhatsAppLink({ phone = siteConfig.whatsappNumber, message }: WhatsAppLinkArgs) {
  const number = phone.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Picks an auto-filled message based on the current route. */
export function getContextMessage(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "properties" && parts[1]) {
    const p = getPropertyBySlug(parts[1]);
    if (p) {
      return siteConfig.messages.property({
        title: p.title,
        locality: p.locality,
        city: p.city,
        price: formatPrice(p.price),
      });
    }
  }
  if (parts[0] === "properties") return siteConfig.messages.properties;
  if (parts[0] === "contact") return siteConfig.messages.contact;
  if (parts[0] === "blog") return siteConfig.messages.blog;
  return siteConfig.messages.general;
}

export interface EnquiryMessageArgs {
  name: string;
  budget?: string;
  requirement?: string;
  property?: string;
}

export function buildEnquiryMessage({ name, budget, requirement, property }: EnquiryMessageArgs) {
  const lines = [
    `Hi ${siteConfig.brand}, I'm ${name}.`,
    property ? `Property of interest: ${property}` : null,
    budget ? `Budget: ${budget}` : null,
    requirement ? `Requirement: ${requirement}` : null,
    "Please get in touch with me.",
  ].filter(Boolean);
  return lines.join("\n");
}
