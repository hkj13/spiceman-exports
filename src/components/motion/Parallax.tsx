"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { loadGsap } from "./gsap";

/**
 * Children marked `data-speed` (e.g. "0.6" or "-0.4") drift at different
 * rates while the group crosses the viewport. Off with reduced motion.
 */
export function Parallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let revert = () => {};
    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        el.querySelectorAll<HTMLElement>("[data-speed]").forEach((item) => {
          const speed = Number(item.dataset.speed) || 0;
          gsap.fromTo(
            item,
            { yPercent: speed * 12 },
            {
              yPercent: speed * -12,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      revert = () => mm.revert();
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
