"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element is within `margin` of the viewport. Used to mount/unmount WebGL canvases. */
export function useNearViewport(ref: RefObject<Element>, margin = "200px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}
