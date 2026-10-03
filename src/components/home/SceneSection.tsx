"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { play } from "@/components/motion/bus";
import { loadGsap } from "@/components/motion/gsap";
import { claimStage } from "@/components/motion/liveStage";
import { setStage } from "@/lib/journey";
import { PALETTE } from "./palette";
import { homeScenes, type HomeSceneName } from "./scenes";

type Props = {
  scene: HomeSceneName;
  /** Position on the route line, 0..7 */
  stage: number;
  /** Part of a green run: its colours follow the scroll-driven tone */
  night?: boolean;
  /** First section of a green run: the tone blends in as it approaches */
  toneStart?: boolean;
  /** Draw the scene in the night palette (for scenes that are paper-toned by default) */
  nightPalette?: boolean;
  /** Grains fly here from the previous shape, on phones too */
  flow?: boolean;
  id?: string;
  className?: string;
  labelledBy?: string;
  /** Label for this section on the side rail */
  rail?: string;
  children: ReactNode;
};

/**
 * A chapter of the journey. While it occupies the middle of the viewport,
 * the particles form its scene inside the element marked
 * `data-scene-anchor` (and `data-scene-extra`, if present).
 */
export function SceneSection({ scene, stage, night, toneStart, nightPalette, flow, id, className, labelledBy, rail, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let kill = () => {};
    let cancelled = false;

    const activate = () => {
      setStage(stage);
      // A section can carry separate anchors per layout; use the visible one.
      const visible = (sel: string) =>
        [...el.querySelectorAll<HTMLElement>(sel)].find((n) => n.offsetParent !== null || n.getClientRects().length > 0) ?? null;
      const anchor = visible("[data-scene-anchor]");
      const extra = visible("[data-scene-extra]");
      const settled = claimStage(el);
      play({ ...homeScenes[scene](anchor, extra, nightPalette ? PALETTE.night : undefined), flow, onSettled: settled });
    };

    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && activate(),
      });
      if (st.isActive) activate();
      kill = () => st.kill();
    });

    return () => {
      cancelled = true;
      kill();
    };
  }, [scene, stage, nightPalette, flow]);

  return (
    <section
      ref={ref}
      id={id}
      className={`${night ? "tone-scrub " : ""}${className ?? ""}`}
      aria-labelledby={labelledBy}
      data-rail={rail}
      data-tone-start={toneStart ? "" : undefined}
    >
      {children}
    </section>
  );
}
