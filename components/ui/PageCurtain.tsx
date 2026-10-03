"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/** Gradient wipe that sweeps away on every client-side route change. */
export function PageCurtain() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // compare against the last pathname so React Strict Mode's double-effect doesn't trigger it on first load
    if (previous.current === pathname) return;
    previous.current = pathname;
    setKey((k) => k + 1);
  }, [pathname]);

  return (
    <AnimatePresence>
      {key > 0 && (
        <motion.div
          key={key}
          aria-hidden
          className="force-dark pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-[rgb(4_7_18)]"
          initial={{ y: "0%" }}
          animate={{ y: "-101%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-gradient" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
