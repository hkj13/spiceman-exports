"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { play, setTint } from "@/components/motion/bus";
import { loadGsap } from "@/components/motion/gsap";
import { setStage } from "@/lib/journey";
import { homeScenes, type HomeSceneName } from "./scenes";

/**
 * Harvest → Sun → Sort as one horizontal chapter on large screens: the
 * section pins and the panels travel sideways with the scroll. On small
 * screens, with reduced motion and without JS the panels simply stack; the
 * horizontal layout is switched on by script only when it will be driven.
 *
 * Panels are the children marked `data-panel`, each with `data-scene`,
 * `data-stage` and an inner `data-scene-anchor`.
 */
export function HorizontalChapters({ children, labelledBy }: { children: ReactNode; labelledBy?: string }) {
  const root = useRef<HTMLElement>(null);
  // GSAP wraps the pinned element in a spacer, so pin an inner wrapper: the
  // section React owns must keep its original parent for unmounting.
  const pinned = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const pinEl = pinned.current;
    const tr = track.current;
    if (!el || !pinEl || !tr) return;
    let cancelled = false;
    let revert = () => {};

    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    let current = -1;
    const activate = (i: number) => {
      if (i === current || !panels[i]) return;
      current = i;
      const p = panels[i];
      setStage(Number(p.dataset.stage));
      const name = p.dataset.scene as HomeSceneName;
      if (name !== "sun") setTint("#2B2420", 0);
      play(homeScenes[name](p.querySelector("[data-scene-anchor]")));
    };
    const sunIndex = panels.findIndex((p) => p.dataset.scene === "sun");

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          wide: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          narrow: "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { wide } = context.conditions as { wide: boolean };

          if (wide) {
            el.dataset.hscroll = "on";
            const distance = () => tr.scrollWidth - window.innerWidth;
            const tween = gsap.to(tr, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: pinEl,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.6,
                invalidateOnRefresh: true,
                onUpdate: () => {
                  const mid = window.innerWidth / 2;
                  let best = 0;
                  let bestD = Infinity;
                  panels.forEach((p, i) => {
                    const r = p.getBoundingClientRect();
                    const d = Math.abs(r.left + r.width / 2 - mid);
                    if (d < bestD) {
                      bestD = d;
                      best = i;
                    }
                  });
                  activate(best);
                  if (best === sunIndex) {
                    const r = panels[sunIndex].getBoundingClientRect();
                    const k = 1 - (r.left + r.width / 2) / window.innerWidth; // 0 entering → 1 leaving
                    setTint("#2B2420", Math.max(0, Math.min(1, (k - 0.2) * 1.6)));
                  }
                },
                onEnter: () => activate(0),
                onEnterBack: () => {
                  current = -1;
                },
              },
            });
            ScrollTrigger.refresh();
            return () => {
              tween.scrollTrigger?.kill();
              tween.kill();
              gsap.set(tr, { clearProps: "transform" });
              el.dataset.hscroll = "off";
            };
          }

          const triggers = panels.map((p, i) =>
            ScrollTrigger.create({
              trigger: p,
              start: "top 55%",
              end: "bottom 45%",
              onToggle: (self) => self.isActive && activate(i),
              onUpdate:
                i === sunIndex
                  ? (self) => setTint("#2B2420", Math.max(0, Math.min(1, self.progress * 1.3)))
                  : undefined,
            }),
          );
          return () => triggers.forEach((t) => t.kill());
        },
      );
      revert = () => mm.revert();
    });

    return () => {
      cancelled = true;
      revert();
      setTint("#2B2420", 0);
    };
  }, []);

  return (
    <section ref={root} aria-labelledby={labelledBy} data-hscroll="off" className="group/h relative overflow-x-clip">
      <div ref={pinned} className="group-data-[hscroll=on]/h:h-svh">
        <div
          ref={track}
          className="flex flex-col group-data-[hscroll=on]/h:h-full group-data-[hscroll=on]/h:w-max group-data-[hscroll=on]/h:flex-row group-data-[hscroll=on]/h:will-change-transform"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
