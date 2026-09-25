"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { play } from "@/components/motion/bus";
import { loadGsap } from "@/components/motion/gsap";
import { claimStage } from "@/components/motion/liveStage";
import { homeScenes, type HomeSceneName } from "@/components/home/scenes";
import { PALETTE } from "@/components/home/palette";
import { setStage } from "@/lib/journey";

type StageMeta = { id: string; n: string; label: string; scene: HomeSceneName; art: ReactNode };

/**
 * On large screens a sticky stage sits beside the chapters: its numeral and
 * particle scene follow whichever chapter is being read. Below that, each
 * chapter carries its own drawing and the particles form there instead.
 */
export function ProcessScroller({ stages, children }: { stages: StageMeta[]; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    let kill = () => {};
    const wide = window.matchMedia("(min-width: 1024px)");

    const activate = (i: number) => {
      setActive(i);
      setStage(i);
      const article = el.querySelectorAll<HTMLElement>("[data-stage-article]")[i];
      const anchor = wide.matches ? sticky.current : article?.querySelector("[data-inline-anchor]");
      const name = stages[i].scene;
      // Paper-tone palettes for the scenes that are drawn in night colours on Home.
      const palette = name === "container" || name === "port" ? PALETTE.dried : undefined;
      const owner = (wide.matches ? sticky.current : article) as HTMLElement | null;
      const settled = owner ? claimStage(owner) : undefined;
      play({ ...homeScenes[name](anchor ?? null, null, palette), onSettled: settled });
    };

    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const articles = Array.from(el.querySelectorAll<HTMLElement>("[data-stage-article]"));
      const triggers = articles.map((a, i) =>
        ScrollTrigger.create({
          trigger: a,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => self.isActive && activate(i),
        }),
      );
      kill = () => triggers.forEach((t) => t.kill());
    });
    return () => {
      cancelled = true;
      kill();
    };
  }, [stages]);

  const s = stages[active];

  return (
    <div ref={root} className="wrap grid-12 relative">
      <div className="col-span-5 hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)] flex h-[calc(100svh-var(--header-h)-4rem)] flex-col justify-between">
          <div aria-hidden>
            <p
              data-n={s.n}
              className="font-display text-[clamp(8rem,16vw,15rem)] leading-[0.8] tracking-[-0.05em] text-rule [font-variation-settings:'opsz'_144] before:content-[attr(data-n)]"
            />
            <p className="mono-label mt-4 text-brown">{s.label}</p>
          </div>
          <div ref={sticky} className="relative aspect-[4/3] w-full max-w-[520px]">
            {stages.map((st, i) => (
              <div
                key={st.id}
                aria-hidden
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                {st.art}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-4 md:col-span-8 lg:col-span-7">{children}</div>
    </div>
  );
}
