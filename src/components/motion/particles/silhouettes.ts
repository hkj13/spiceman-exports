import type { Silhouette } from "@/data/products";
import { pathShape, silhouette } from "./shapes";
import type { ShapeFn } from "./types";

/**
 * Path data shared by the particle shapes and the SVG art they hand off to,
 * so the particles land exactly where the drawing appears.
 */
export const PATHS = {
  leaf: "M50 97C17 76 8 38 50 3c42 35 33 73 0 94Z",
  sack: [
    "M36 16c6 5 22 5 28 0l-3 13c19 7 29 31 27 61-2 20-18 27-38 27s-36-7-38-27c-2-30 8-54 27-61Z",
    "M30 6l12 10-8 3ZM70 6 58 16l8 3Z",
  ],
  pin: "M50 127S12 80 12 49a38 38 0 0 1 76 0c0 31-38 78-38 78Zm0-60a18 18 0 1 0 0-36 18 18 0 0 0 0 36Z",
  chilli:
    "M21 21c7-4 13 1 15 9 8 26 26 46 54 56 4 2 2 6-4 6-30 0-52-18-60-48-2-8-8-16-5-23ZM19 23c-4-6-4-12 2-16l2 2c-4 4-4 8 0 12Z",
  pod: "M50 6c18 12 22 54 2 88-2 2-4 2-6 0C28 60 32 18 50 6Zm0-4 3 6h-6Z",
  clove: "M46 32h8l-2 62h-4ZM50 10a12 12 0 1 1 0 24 12 12 0 0 1 0-24ZM36 30l10-4v8ZM64 30l-10-4v8Z",
} as const;

export const leafShape = pathShape("leaf", PATHS.leaf);
export const sackShape = pathShape("sack", [...PATHS.sack], 100, 120);
export const pinShape = pathShape("pin", PATHS.pin, 100, 130, true);

/** A shipping container: frame and corrugation ribs. */
export const containerShape: ShapeFn = silhouette(
  "container",
  (ctx) => {
    ctx.fillRect(0, 0, 200, 6);
    ctx.fillRect(0, 84, 200, 6);
    ctx.fillRect(0, 0, 6, 90);
    ctx.fillRect(194, 0, 6, 90);
    for (let i = 1; i < 12; i++) ctx.fillRect(i * 16.6 - 1.5, 10, 3, 70);
  },
  200,
  90,
);

/** A container ship in profile: hull, deck stacks, bridge. */
export const shipShape: ShapeFn = silhouette(
  "ship",
  (ctx) => {
    ctx.beginPath();
    ctx.moveTo(8, 62);
    ctx.lineTo(236, 62);
    ctx.lineTo(214, 94);
    ctx.lineTo(30, 94);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(26, 24, 22, 38);
    ctx.fillRect(32, 12, 8, 12);
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (row === 2 && (col < 2 || col > 6)) continue;
        ctx.fillRect(60 + col * 17, 50 - row * 12, 15, 10);
      }
    }
  },
  240,
  100,
);

export type Capsule = { x: number; y: number; len: number; w: number; rot: number };

/** Turmeric: a knuckled rhizome with fingers branching off it. */
export const FINGERS: Capsule[] = [
  { x: 16, y: 58, len: 56, w: 19, rot: -4 },
  { x: 44, y: 52, len: 34, w: 11, rot: -58 },
  { x: 60, y: 57, len: 30, w: 10, rot: -28 },
  { x: 30, y: 60, len: 26, w: 10, rot: 52 },
  { x: 62, y: 60, len: 28, w: 11, rot: 18 },
  { x: 24, y: 55, len: 24, w: 9, rot: -120 },
];

export type Disc = { cx: number; cy: number; rx: number; ry: number; rot: number };

/** Deterministic scatter of seeds, shared by the particle mask and the SVG art. */
export function discLayout(count: number, rMin: number, rMax: number, seed: number, stretch = 1): Disc[] {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: count }, () => {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 38;
    const r = rMin + rnd() * (rMax - rMin);
    return { cx: 50 + Math.cos(a) * d, cy: 54 + Math.sin(a) * d * 0.8, rx: r * stretch, ry: r, rot: rnd() * Math.PI };
  });
}

export const DISC_SETS = {
  peppercorns: discLayout(26, 5, 7.5, 7),
  "round-seeds": discLayout(34, 4, 6, 11),
  "long-seeds": discLayout(40, 2.2, 3, 19, 2.6),
  lentils: discLayout(46, 3.5, 5, 23, 1.25),
} as const;

const discs = (key: keyof typeof DISC_SETS) =>
  silhouette(key, (ctx) => {
    for (const d of DISC_SETS[key]) {
      ctx.beginPath();
      ctx.ellipse(d.cx, d.cy, d.rx, d.ry, d.rot, 0, Math.PI * 2);
      ctx.fill();
    }
  });

const quill = silhouette("quill", (ctx) => {
  ctx.save();
  ctx.translate(50, 50);
  ctx.rotate(-0.45);
  ctx.beginPath();
  ctx.roundRect(-44, -9, 88, 18, 9);
  ctx.fill();
  ctx.translate(4, 22);
  ctx.beginPath();
  ctx.roundRect(-40, -8, 80, 16, 8);
  ctx.fill();
  ctx.restore();
});

export const productShapes: Record<Silhouette, ShapeFn> = {
  peppercorns: discs("peppercorns"),
  finger: silhouette("finger", (ctx) => {
    for (const c of FINGERS) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rot * Math.PI) / 180);
      ctx.beginPath();
      ctx.roundRect(0, -c.w / 2, c.len, c.w, c.w / 2);
      ctx.fill();
      ctx.restore();
    }
  }),
  chilli: pathShape("chilli", PATHS.chilli),
  pod: pathShape("pod", PATHS.pod),
  "round-seeds": discs("round-seeds"),
  "long-seeds": discs("long-seeds"),
  clove: pathShape("clove", PATHS.clove),
  quill,
  lentils: discs("lentils"),
};
