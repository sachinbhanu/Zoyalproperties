import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Talk to ${siteConfig.brand} — enquire about properties, book a site visit or chat with an advisor on WhatsApp.`,
};

const OFFICE = { lat: 28.495, lng: 77.089 };

export default function ContactPage() {
  const bbox = `${OFFICE.lng - 0.012},${OFFICE.lat - 0.008},${OFFICE.lng + 0.012},${OFFICE.lat + 0.008}`;
  const details = [
    { Icon: MapPin, label: "Office", value: siteConfig.address },
    { Icon: Phone, label: "Phone", value: siteConfig.displayPhone, href: siteConfig.telHref },
    { Icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { Icon: Clock, label: "Hours", value: siteConfig.officeHours },
  ];

  return (
    <>
      <PageHeader eyebrow="Contact" title={"Let's find your\n*next address*"} text="Tell us what you're looking for — we'll handle the rest. Or skip the form and WhatsApp us directly." />

      <section className="container-x grid gap-10 pb-24 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <EnquiryForm />
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.1}>
            <ul className="glass glow-border space-y-5 rounded-3xl p-7">
              {details.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan/10 text-cyan">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{label}</p>
                    {href ? (
                      <a href={href} className="font-medium hover:text-cyan">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <WhatsAppButton size="lg" customizable popoverClassName="left-0 top-full mt-3" />
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-28" aria-label="Office location">
        <Reveal>
          <div className="glass glow-border overflow-hidden rounded-3xl p-2">
            <iframe
              title="Map showing the Zoyal Properties office in Gurugram"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${OFFICE.lat},${OFFICE.lng}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="map-embed h-[420px] w-full rounded-2xl border-0"
            />
          </div>
          <p className="mt-3 text-sm text-muted">Map data © OpenStreetMap contributors. Demo address — replace in config/site.ts.</p>
        </Reveal>
      </section>
    </>
  );
}
