"use client";

/**
 * Every WebGL scene is loaded with next/dynamic (ssr: false) so Three.js never
 * touches the initial bundle. While a chunk loads (or if WebGL is unavailable)
 * a gradient fallback is shown.
 */
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

export function SceneFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(var(--violet)/0.35),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgb(var(--cyan)/0.28),transparent_55%)]",
        className
      )}
    />
  );
}

const loading = () => <SceneFallback />;

export const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false, loading });
export const TowerScene = dynamic(() => import("@/components/three/TowerScene"), { ssr: false, loading });
export const FloatingShapes = dynamic(() => import("@/components/three/FloatingShapes"), { ssr: false, loading });
export const IndiaMapScene = dynamic(() => import("@/components/three/IndiaMapScene"), { ssr: false, loading });
export const NotFoundScene = dynamic(() => import("@/components/three/NotFoundScene"), { ssr: false, loading });
