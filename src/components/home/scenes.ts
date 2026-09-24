"use client";

import { bed, combine, furrows, heap, line, loupe, scatter, sieve, strands } from "@/components/motion/particles/shapes";
import { containerShape, sackShape, shipShape } from "@/components/motion/particles/silhouettes";
import type { Scene } from "@/components/motion/particles/types";
import { PALETTE } from "./palette";


export type HomeSceneName =
  | "heap"
  | "soil"
  | "harvest"
  | "sun"
  | "sort"
  | "table"
  | "check"
  | "pack"
  | "container"
  | "port";

type Build = (anchor: Element | null, extra?: Element | null, palette?: readonly string[]) => Scene;

export const homeScenes: Record<HomeSceneName, Build> = {
  heap: (a) => ({
    id: "home-heap",
    parts: [{ anchor: a, shape: heap(0.92), colors: PALETTE.spice }],
    live: true,
    scatter: 90,
  }),
  soil: (a) => ({ id: "home-soil", parts: [{ anchor: a, shape: furrows(6), colors: PALETTE.soil }], scatter: 110 }),
  harvest: (a) => ({ id: "home-harvest", parts: [{ anchor: a, shape: strands(7), colors: PALETTE.vine }], live: true }),
  sun: (a) => ({ id: "home-sun", parts: [{ anchor: a, shape: bed(), colors: PALETTE.greenPepper }], scatter: 60 }),
  sort: (a) => ({ id: "home-sort", parts: [{ anchor: a, shape: sieve(), colors: PALETTE.dried }], scatter: 60 }),
  table: (a) => ({
    id: "home-table",
    parts: [{ anchor: a, shape: scatter(), colors: PALETTE.spice, alpha: 0.55, size: 0.8 }],
    density: 0.35,
    scatter: 40,
  }),
  check: (a) => ({ id: "home-check", parts: [{ anchor: a, shape: loupe(), colors: PALETTE.dried }], scatter: 80 }),
  pack: (a) => ({ id: "home-pack", parts: [{ anchor: a, shape: sackShape, colors: PALETTE.dried }], scatter: 120 }),
  container: (a, _x, palette) => ({
    id: "home-container",
    parts: [{ anchor: a, shape: containerShape, colors: palette ?? PALETTE.night }],
    scatter: 120,
  }),
  port: (a, horizon, palette) => ({
    id: "home-port",
    parts: [
      { anchor: a, shape: shipShape, colors: palette ?? PALETTE.night, weight: horizon ? 3 : 1 },
      ...(horizon
        ? [{ anchor: horizon, shape: combine([line(2), 1]), colors: ["#FBF7EE", "#E3A21A"], weight: 1, size: 0.6, alpha: 0.7 }]
        : []),
    ],
    live: true,
    scatter: 140,
  }),
};
