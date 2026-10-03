"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loadGsap } from "./gsap";

const setTone = (v: number) => {
  const root = document.documentElement;
  const t = Math.max(0, Math.min(1, v));
  // The background eases through the in-between shades quickly; text swaps
  // in a narrow window at the midpoint, so it always contrasts with what is
  // behind it.
  const bg = t * t * (3 - 2 * t);
  root.style.setProperty("--tone", bg.toFixed(3));
  const ink = Math.max(0, Math.min(1, (t - 0.45) / 0.1));
  root.style.setProperty("--tone-ink", ink.toFixed(3));
  // Elements styled with `night:` (header, cursor, rail marker) switch at the midpoint.
  if (t > 0.001) root.dataset.toning = "";
  else delete root.dataset.toning;
  if (t >= 0.5) root.dataset.tone = "night";
  else root.removeAttribute("data-tone");
};

/**
 * Blends the page from cream to green while scrolling: for each section
 * marked `data-tone-start` (the first of a run of green sections) the tone
 * rises from 0 as its top enters the bottom of the screen to 1 as it reaches
 * the upper third, and falls back the same way when scrolling up. With
 * reduced motion it switches at the midpoint instead of blending.
 */
export function ToneScrub() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let kill = () => {};
    setTone(0);
    const start = window.setTimeout(() => {
      loadGsap().then(({ ScrollTrigger }) => {
        if (cancelled) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const triggers = [...document.querySelectorAll<HTMLElement>("main [data-tone-start]")].map((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top bottom",
            end: "top 30%",
            // measured after pinned sections above have added their scroll length
            refreshPriority: -1,
            onUpdate: (self) => setTone(reduce ? (self.progress >= 0.5 ? 1 : 0) : self.progress),
          }),
        );
        ScrollTrigger.refresh();
        triggers.forEach((t) => setTone(reduce ? (t.progress >= 0.5 ? 1 : 0) : t.progress));
        kill = () => triggers.forEach((t) => t.kill());
      });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
      kill();
      setTone(0);
    };
  }, [pathname]);

  return null;
}
