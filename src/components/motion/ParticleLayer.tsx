"use client";

import { useEffect, useRef } from "react";
import { registerEngine } from "./bus";
import { createEngine } from "./particles/engine";
import type { Tier } from "./particles/types";

/** The persistent canvas. Mounted once in the root layout; never unmounts on navigation. */
export default function ParticleLayer({ tier }: { tier: Exclude<Tier, "off"> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let engine: ReturnType<typeof createEngine> | null = null;
    try {
      engine = createEngine(canvas, tier);
    } catch {
      engine = null;
    }
    registerEngine(engine);
    return () => {
      engine?.destroy();
      registerEngine(null);
    };
  }, [tier]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] h-lvh w-full [view-transition-name:particles]"
    />
  );
}
