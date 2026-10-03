import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass glow-border rounded-3xl", className)} {...props} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-xl", className)} />;
}

export function MeshBackground({ className }: { className?: string }) {
  return (
    <div className={cn("mesh-bg", className)} aria-hidden>
      <span style={{ left: "-12%", top: "-18%", background: "rgb(var(--violet))" }} />
      <span style={{ right: "-14%", top: "10%", background: "rgb(var(--cyan))", animationDelay: "-5s" }} />
      <span style={{ left: "25%", bottom: "-30%", background: "rgb(var(--gold))", opacity: 0.18, animationDelay: "-9s" }} />
    </div>
  );
}
