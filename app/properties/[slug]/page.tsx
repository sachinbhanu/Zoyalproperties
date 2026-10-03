import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getPropertyBySlug, getSimilarProperties, properties } from "@/data/properties";
import { formatArea, formatINR, formatPossession, formatPrice } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { PropertyHero } from "@/components/property/PropertyHero";
import { Gallery } from "@/components/property/Gallery";
import { FloorPlan } from "@/components/property/FloorPlan";
import { EmiCalculator } from "@/components/property/EmiCalculator";
import { EnquiryForm } from "@/components/property/EnquiryForm";
import { PropertyCard } from "@/components/property/PropertyCard";
import { StickyWhatsAppBar } from "@/components/property/StickyWhatsAppBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const p = getPropertyBySlug(params.slug);
  if (!p) return { title: "Property not found" };
  const title = `${p.title} — ${p.bhk > 0 ? `${p.bhk} BHK ` : ""}${p.type} in ${p.locality}, ${p.city}`;
  const description = `${p.tagline}. ${formatPrice(p.price)} · ${formatArea(p.area)} · ${p.status}. ${p.description.slice(0, 110)}…`;
  return {
    title,
    description,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: { title, description, type: "website", images: [{ url: p.gallery[0], width: 1600, height: 1000, alt: p.title }] },
    twitter: { card: "summary_large_image", title, description, images: [p.gallery[0]] },
  };
}

export default function PropertyPage({ params }: Params) {
  const p = getPropertyBySlug(params.slug);
  if (!p) notFound();

  const similar = getSimilarProperties(p, 3);
  const pricePerSqft = Math.round(p.price / p.area);
  const bbox = `${p.coordinates.lng - 0.012},${p.coordinates.lat - 0.008},${p.coordinates.lng + 0.012},${p.coordinates.lat + 0.008}`;
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${p.coordinates.lat},${p.coordinates.lng}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${p.coordinates.lat}&mlon=${p.coordinates.lng}#map=15/${p.coordinates.lat}/${p.coordinates.lng}`;

  const specs: [string, string][] = [
    ["Property type", p.type],
    ...(p.bhk > 0 ? ([["Configuration", `${p.bhk} BHK`]] as [string, string][]) : []),
    ["Super area", formatArea(p.area)],
    ["Price", `${formatPrice(p.price)} (${formatINR(p.price)})`],
    ["Price per sq ft", formatINR(pricePerSqft)],
    ["Status", p.status],
    ["Possession", formatPossession(p.possession)],
    ["Locality", `${p.locality}, ${p.city}`],
    ["State", p.state],
    ["RERA ID", `RERA-DEMO-${p.id.toUpperCase()} (placeholder)`],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    image: p.gallery,
    category: p.type,
    brand: { "@type": "Brand", name: siteConfig.brand },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "INR",
      availability: p.status === "Ready to Move" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url: `${siteConfig.url}/properties/${p.slug}`,
      seller: { "@type": "RealEstateAgent", name: siteConfig.brand },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Area (sq ft)", value: p.area },
      { "@type": "PropertyValue", name: "Locality", value: `${p.locality}, ${p.city}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PropertyHero property={p} />

      <div className="container-x space-y-24 pb-40 pt-16 sm:space-y-32 sm:pt-24">
        {/* Gallery */}
        <section aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="sr-only">
            Gallery
          </h2>
          <Gallery images={p.gallery} title={p.title} />
        </section>

        {/* Overview + specs */}
        <section className="grid gap-12 lg:grid-cols-[1.3fr_1fr]" aria-labelledby="overview-heading">
          <div>
            <SectionHeading id="overview-heading" eyebrow="Overview" title={"About this\n*property*"} />
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-muted">{p.description}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="mt-10 font-display text-2xl font-semibold">Amenities</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.amenities.map((a) => (
                  <li key={a} className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                      <Check className="h-4 w-4" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="glass glow-border overflow-hidden rounded-3xl lg:sticky lg:top-28">
              <h3 className="border-b border-line/15 px-6 py-5 font-display text-xl font-semibold">Specifications</h3>
              <table className="w-full text-sm">
                <caption className="sr-only">Key specifications for {p.title}</caption>
                <tbody>
                  {specs.map(([k, v]) => (
                    <tr key={k} className="border-b border-line/10 last:border-0">
                      <th scope="row" className="w-2/5 px-6 py-3.5 text-left font-normal text-muted">
                        {k}
                      </th>
                      <td className="px-6 py-3.5 font-medium">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* Floor plan */}
        <section aria-labelledby="floorplan-heading">
          <SectionHeading id="floorplan-heading" eyebrow="Floor plan" title={"Space, thoughtfully\n*arranged*"} text="A schematic of the typical layout. Detailed, to-scale plans are shared on request." />
          <div className="mx-auto mt-10 max-w-4xl">
            <FloorPlan property={p} />
          </div>
        </section>

        {/* Location */}
        <section aria-labelledby="location-heading">
          <SectionHeading id="location-heading" eyebrow="Location" title={`${p.locality},\n*${p.city}*`} text={`${p.title} sits in ${p.locality}, ${p.city} — close to schools, hospitals, business hubs and transit.`} />
          <Reveal delay={0.1}>
            <div className="glass glow-border mt-10 overflow-hidden rounded-3xl p-2">
              <iframe title={`Map showing ${p.title} in ${p.locality}, ${p.city}`} src={osmSrc} loading="lazy" referrerPolicy="no-referrer" className="map-embed h-[420px] w-full rounded-2xl border-0" />
            </div>
            <p className="mt-3 text-sm text-muted">
              Map data © OpenStreetMap contributors ·{" "}
              <a href={osmLink} target="_blank" rel="noopener noreferrer" className="text-cyan underline">
                View larger map
              </a>
            </p>
          </Reveal>
        </section>

        {/* EMI */}
        <section aria-labelledby="emi-heading">
          <SectionHeading id="emi-heading" eyebrow="Affordability" title={"Estimate your\n*monthly EMI*"} />
          <div className="mt-12">
            <EmiCalculator defaultPrice={p.price} />
          </div>
        </section>

        {/* Enquiry */}
        <section id="enquire" className="scroll-mt-28 grid gap-12 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="enquiry-heading">
          <div>
            <SectionHeading id="enquiry-heading" eyebrow="Enquire" title={"Make it\n*yours*"} text="Share a few details and our advisor will call you back with a detailed brochure, payment plans and site-visit options." />
            <Reveal delay={0.15}>
              <p className="mt-8 text-sm text-muted">
                Prefer to talk? Call{" "}
                <a href={siteConfig.telHref} className="text-cyan underline">
                  {siteConfig.displayPhone}
                </a>{" "}
                or use the WhatsApp bar below.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <EnquiryForm propertyTitle={`${p.title}, ${p.locality}, ${p.city}`} />
          </Reveal>
        </section>

        {/* Similar */}
        <section aria-labelledby="similar-heading">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading id="similar-heading" eyebrow="You may also like" title={"Similar\n*properties*"} />
            <Button href="/properties" variant="ghost" arrow>
              Browse all
            </Button>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.id} property={s} />
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-muted">
          Demo listing — details are fictional. <Link href="/contact" className="underline hover:text-cyan">Contact us</Link> for real inventory enquiries.
        </p>
      </div>

      <StickyWhatsAppBar property={p} />
    </>
  );
}
