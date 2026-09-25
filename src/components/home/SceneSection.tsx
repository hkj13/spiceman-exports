"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { play } from "@/components/motion/bus";
import { loadGsap } from "@/components/motion/gsap";
import { claimStage } from "@/components/motion/liveStage";
import { setStage } from "@/lib/journey";
import { PALETTE } from "./palette";
import { homeScenes, type HomeSceneName } from "./scenes";

// The page is in its night tone while any night chapter is on screen.
const nightActive = new Set<Element>();
const applyTone = () => {
  if (nightActive.size) document.documentElement.dataset.tone = "night";
  else document.documentElement.removeAttribute("data-tone");
};

type Props = {
  scene: HomeSceneName;
  /** Position on the route line, 0..7 */
  stage: number;
  /** Switch the page to its night tone while this section is active */
  night?: boolean;
  /** Draw the scene in the night palette (for scenes that are paper-toned by default) */
  nightPalette?: boolean;
  /** Grains fly here from the previous shape, on phones too */
  flow?: boolean;
  id?: string;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
};

/**
 * A chapter of the journey. While it occupies the middle of the viewport,
 * the particles form its scene inside the element marked
 * `data-scene-anchor` (and `data-scene-extra`, if present).
 */
export function SceneSection({ scene, stage, night, nightPalette, flow, id, className, labelledBy, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let kill = () => {};
    let cancelled = false;

    const activate = () => {
      setStage(stage);
      const anchor = el.querySelector("[data-scene-anchor]");
      const extra = el.querySelector("[data-scene-extra]");
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
      // Tone switches early so light text never sits on paper.
      const tone = night
        ? ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            end: "bottom top",
            onToggle: (self) => {
              if (self.isActive) nightActive.add(el);
              else nightActive.delete(el);
              applyTone();
            },
          })
        : null;
      kill = () => {
        st.kill();
        tone?.kill();
        nightActive.delete(el);
        applyTone();
      };
    });

    return () => {
      cancelled = true;
      kill();
    };
  }, [scene, stage, night, nightPalette, flow]);

  return (
    <section ref={ref} id={id} className={className} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
