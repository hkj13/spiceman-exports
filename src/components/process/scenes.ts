"use client";

import { silhouette } from "@/components/motion/particles/shapes";
import type { Scene } from "@/components/motion/particles/types";
import { PALETTE } from "@/components/home/palette";
import { ART_H, ART_W, paintArt, type ProcessArtKind } from "./drawings";

const COLORS: Record<ProcessArtKind, readonly string[]> = {
  field: PALETTE.soil,
  calendar: PALETTE.vine,
  sun: ["#E3A21A", "#DDAE45", "#B3201B", "#C8231E", "#5A2E1A", "#B99459"],
  grades: PALETTE.dried,
  spec: PALETTE.dried,
  sacks: ["#5A2E1A", "#7A4A2A", "#B99459", "#6B4E2C"],
  cargo: PALETTE.dried,
  papers: ["#2B2420", "#3A2F29", "#5A2E1A", "#B3201B"],
};

const shapes = Object.fromEntries(
  (Object.keys(COLORS) as ProcessArtKind[]).map((k) => [k, silhouette(`process-${k}`, (ctx) => paintArt(ctx, k), ART_W, ART_H)]),
) as Record<ProcessArtKind, ReturnType<typeof silhouette>>;

/** The particle scene for one Process stage, fitted to `anchor`. */
export const processScene = (kind: ProcessArtKind, anchor: Element | null): Scene => ({
  id: `process-${kind}`,
  parts: [{ anchor, shape: shapes[kind], colors: COLORS[kind] }],
  scatter: 100,
});
