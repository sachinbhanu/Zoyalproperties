import { EmiCalculator } from "@/components/property/EmiCalculator";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MeshBackground } from "@/components/ui/GlassCard";

export function EmiSection() {
  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="emi-heading">
      <MeshBackground className="opacity-50" />
      <div className="container-x relative">
        <SectionHeading id="emi-heading" eyebrow="Investment & EMI calculator" title={"Plan your *purchase*\nbefore you pick a door"} text="Slide the numbers and watch your EMI, interest split and loan balance redraw live — all in INR." />
        <div className="mt-14">
          <EmiCalculator />
        </div>
      </div>
    </section>
  );
}
