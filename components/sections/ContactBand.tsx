import { Phone } from "lucide-react";
import { FloatingShapes } from "@/components/three/lazy";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { siteConfig } from "@/config/site";

export function ContactBand() {
  return (
    <section className="force-dark relative isolate overflow-hidden bg-[rgb(4_7_18)] py-28 text-fg sm:py-40" aria-labelledby="cta-heading">
      {/* big animated gradient */}
      <div className="mesh-bg" aria-hidden>
        <span style={{ left: "-10%", top: "-30%", background: "rgb(var(--violet))", opacity: 0.55 }} />
        <span style={{ right: "-10%", bottom: "-40%", background: "rgb(var(--cyan))", opacity: 0.45, animationDelay: "-7s" }} />
        <span style={{ left: "35%", top: "10%", background: "rgb(var(--gold))", opacity: 0.25, animationDelay: "-11s" }} />
      </div>
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block" aria-hidden>
        <FloatingShapes variant="b" />
      </div>

      <div className="container-x relative">
        <Reveal>
          <span className="eyebrow">Let&apos;s talk</span>
        </Reveal>
        <SplitReveal id="cta-heading" as="h2" text={"Ready to find your\n*next address?*"} className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl" />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-lg text-lg text-fg/75">Book a private consultation or site visit. Our advisors respond within two working hours.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/contact" size="lg" arrow>
              Book a consultation
            </Button>
            <WhatsAppButton label="Chat on WhatsApp" size="lg" customizable />
            <Button href={siteConfig.telHref} variant="ghost" size="lg">
              <Phone className="h-4 w-4" /> {siteConfig.displayPhone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
