"use client";

import { useEffect, useState } from "react";

export interface DeviceInfo {
  /** false during SSR / first render — render nothing heavy until true */
  ready: boolean;
  /** "high" = desktop-class GPU path with postprocessing; "low" = reduced particles, no postprocessing */
  tier: "high" | "low";
  reducedMotion: boolean;
  isTouch: boolean;
  isMobile: boolean;
}

const SSR_STATE: DeviceInfo = { ready: false, tier: "low", reducedMotion: false, isTouch: false, isMobile: false };

export function detectDevice(): DeviceInfo {
  const mq = (q: string) => window.matchMedia(q).matches;
  const reducedMotion = mq("(prefers-reduced-motion: reduce)");
  const isTouch = mq("(pointer: coarse)") || mq("(hover: none)");
  const isMobile = mq("(max-width: 767px)");
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowSpec = (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;
  const tier = reducedMotion || isMobile || isTouch || lowSpec ? "low" : "high";
  return { ready: true, tier, reducedMotion, isTouch, isMobile };
}

export function useDevice(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(SSR_STATE);
  useEffect(() => {
    setInfo(detectDevice());
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setInfo(detectDevice());
    mql.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);
  return info;
}
