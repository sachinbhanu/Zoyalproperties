import { cn } from "@/lib/utils";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  text,
  id,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  id?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <span className={cn("eyebrow", align === "center" && "justify-center")}>{eyebrow}</span>
      </Reveal>
      <SplitReveal
        as="h2"
        id={id}
        text={title}
        className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
      />
      {text && (
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{text}</p>
        </Reveal>
      )}
    </div>
  );
}
