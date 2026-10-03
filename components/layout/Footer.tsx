import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { siteConfig } from "@/config/site";
import { CITIES } from "@/data/properties";

const social = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: Instagram },
  { label: "Facebook", href: siteConfig.social.facebook, Icon: Facebook },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: Linkedin },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: Youtube },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line/10 bg-surface/40">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">{siteConfig.description}</p>
            <div className="flex gap-2">
              {social.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:border-cyan/60 hover:text-cyan"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="space-y-4">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-fg">Explore</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {[
                ["Properties", "/properties"],
                ["Featured Projects", "/projects"],
                ["About Us", "/about"],
                ["Insights", "/blog"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-cyan">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-fg">Cities</h3>
            <ul className="space-y-2.5 text-sm text-muted">
              {CITIES.map((c) => (
                <li key={c}>
                  <Link href={`/properties?city=${c}`} className="transition hover:text-cyan">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="font-display text-sm uppercase tracking-[0.2em] text-fg">Stay ahead of the market</h3>
            <NewsletterForm />
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan" /> {siteConfig.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-cyan" /> {siteConfig.displayPhone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-cyan" /> {siteConfig.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 space-y-3 border-t border-line/10 pt-8 text-xs leading-relaxed text-muted">
          <p>
            © {new Date().getFullYear()} {siteConfig.brand}. All rights reserved. Built with Next.js, Three.js &amp; a lot of coffee.
          </p>
        </div>
      </div>
    </footer>
  );
}
