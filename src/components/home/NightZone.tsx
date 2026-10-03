"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { loadGsap } from "@/components/motion/gsap";
import { applyTone, nightActive } from "./SceneSection";

/** A green section without a particle scene: flips the page tone like a night chapter. */
export function NightZone({ children, className, labelledBy, rail }: { children: ReactNode; className?: string; labelledBy?: string; rail?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let kill = () => {};
    let cancelled = false;
    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 64px",
        end: "bottom 64px",
        onToggle: (self) => {
          if (self.isActive) nightActive.add(el);
          else nightActive.delete(el);
          applyTone();
        },
      });
      kill = () => {
        st.kill();
        nightActive.delete(el);
        applyTone();
      };
    });
    return () => {
      cancelled = true;
      kill();
    };
  }, []);
  return (
    <section ref={ref} className={className} aria-labelledby={labelledBy} data-rail={rail}>
      {children}
    </section>
  );
}
