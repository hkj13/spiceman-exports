"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { setTier } from "./bus";
import { detectTier, finePointer } from "./device";
import type { Tier } from "./particles/types";

const ParticleLayer = dynamic(() => import("./ParticleLayer"), { ssr: false });
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });

const idle = (cb: () => void) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(cb, { timeout: 1800 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(cb, 600);
  return () => clearTimeout(id);
};

/**
 * Everything decorative about motion, loaded after the page is interactive:
 * the particle field, smooth scroll and the custom cursor. With reduced
 * motion none of it loads.
 */
export function MotionRoot() {
  const [state, setState] = useState<{ tier: Tier; cursor: boolean } | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelIdle = () => {};
    const decide = () => {
      cancelIdle();
      const tier = detectTier();
      setTier(tier);
      document.documentElement.dataset.motion = tier === "off" ? "reduced" : "full";
      cancelIdle = idle(() => setState({ tier, cursor: tier !== "off" && finePointer() }));
    };
    decide();
    media.addEventListener("change", decide);
    return () => {
      cancelIdle();
      media.removeEventListener("change", decide);
    };
  }, []);

  if (!state || state.tier === "off") return null;
  return (
    <>
      <ParticleLayer tier={state.tier} />
      <SmoothScroll />
      {state.cursor && <Cursor />}
    </>
  );
}
