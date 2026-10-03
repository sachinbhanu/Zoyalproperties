import { featuredProperties } from "@/data/properties";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FeaturedProjects() {
  const list = featuredProperties.slice(0, 6);
  return (
    <section className="section-y relative" aria-labelledby="featured-heading">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="featured-heading" eyebrow="Featured projects" title={"Residences that *redefine*\nthe skyline"} text="Six landmark addresses, hand-selected for design, location and long-term value." />
          <Reveal>
            <Button href="/projects" variant="ghost" arrow>
              View all projects
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[minmax(360px,auto)] gap-6 lg:grid-cols-3 lg:auto-rows-[340px]">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08} className={i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
              <div className="h-full">
                <PropertyCard property={p} variant="feature"priority={i === 0} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
