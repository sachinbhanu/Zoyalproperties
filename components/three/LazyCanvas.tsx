"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useDevice } from "@/hooks/useDevice";
import { useNearViewport } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

interface Props {
  className?: string;
  camera?: { fov?: number; near?: number; far?: number; position?: [number, number, number] };
  children: ReactNode;
  /** IntersectionObserver margin — the canvas is mounted only while near the viewport (saves GPU + WebGL contexts) */
  margin?: string;
  /** Paint a gradient behind the canvas until WebGL is ready / when unsupported */
  fallbackClassName?: string;
  alpha?: boolean;
}

/**
 * Shared R3F Canvas wrapper: mounts on demand, pauses off-screen, honours
 * reduced-motion, picks DPR by device tier, and degrades to a CSS gradient
 * when WebGL is unavailable.
 */
export function LazyCanvas({ className, camera, children, margin = "150px", fallbackClassName, alpha = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref, margin);
  const device = useDevice();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => setWebgl(hasWebGL()), []);
  useEffect(() => {
    if (!near) setReady(false);
  }, [near]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(var(--violet)/0.35),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgb(var(--cyan)/0.28),transparent_55%)]",
          fallbackClassName
        )}
      />
      {device.ready && webgl && near && (
        <Canvas
          frameloop={device.reducedMotion ? "demand" : "always"}
          dpr={device.tier === "high" ? [1, 1.75] : [1, 1.25]}
          camera={camera}
          gl={{ antialias: device.tier === "low", powerPreference: "high-performance", alpha }}
          style={{ position: "absolute", inset: 0, opacity: ready ? 1 : 0, transition: "opacity 1.2s ease" }}
          onCreated={() => requestAnimationFrame(() => setReady(true))}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
