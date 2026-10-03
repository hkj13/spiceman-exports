import { PATHS } from "@/components/motion/particles/silhouettes";

/**
 * Drawings for the eight Process stages, one per step's subject. Shared by
 * the particle shapes and the SVG stills, so the particles land exactly where
 * the drawing appears. All are drawn in a 200 × 150 box (the anchors are 4:3);
 * each part is filled with the even-odd rule, so a ring is an outer and an
 * inner outline in one path.
 */

export type ProcessArtKind = "field" | "calendar" | "sun" | "grades" | "spec" | "sacks" | "cargo" | "papers";

type Part = { d: string; x?: number; y?: number; s?: number; r?: number };

export const ART_W = 200;
export const ART_H = 150;

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const ring = (x: number, y: number, w: number, h: number, t: number) => rect(x, y, w, h) + rect(x + t, y + t, w - 2 * t, h - 2 * t);
const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const tick = (x: number, y: number) => `M${x} ${y}l4-4 6 6 12-12 4 4-16 16Z`;

/** Twelve rays around a point, as thin quads. */
function rays(cx: number, cy: number, r0: number, r1: number, half: number) {
  let d = "";
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    const p = (r: number, o: number) => `${(cx + c * r - s * o).toFixed(1)} ${(cy + s * r + c * o).toFixed(1)}`;
    d += `M${p(r0, -half)}L${p(r1, -half)}L${p(r1, half)}L${p(r0, half)}Z`;
  }
  return d;
}

/** A plane seen from above, nose up, in a 100 × 100 box. */
const PLANE =
  "M50 4c4 0 6 6 6 14v22l38 20v8l-38-10v24l12 9v6l-18-5-18 5v-6l12-9V58L6 68v-8l38-20V18c0-8 2-14 6-14Z";

const CONTAINER =
  rect(0, 0, 200, 6) +
  rect(0, 84, 200, 6) +
  rect(0, 0, 6, 90) +
  rect(194, 0, 6, 90) +
  Array.from({ length: 11 }, (_, i) => rect((i + 1) * 16.6 - 1.5, 10, 3, 70)).join("");

export const PROCESS_ART: Record<ProcessArtKind, Part[]> = {
  // 01 Soil, where it grows: a map pin over the furrows of a field
  field: [
    { d: PATHS.pin, x: 64, y: 4, s: 0.72 },
    { d: "M50 106h100v5H50Z" },
    { d: "M30 121h140v6H30Z" },
    { d: "M8 137h184v7H8Z" },
  ],
  // 02 Harvest, when it is picked: a calendar with the harvest months filled
  calendar: [
    { d: "M30 20a6 6 0 0 1 6-6h128a6 6 0 0 1 6 6v114a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6Z" + rect(36, 44, 128, 90) },
    { d: rect(60, 4, 8, 18) },
    { d: rect(132, 4, 8, 18) },
    ...Array.from({ length: 12 }, (_, i) => {
      const [x, y] = [44 + (i % 4) * 30, 52 + Math.floor(i / 4) * 28];
      return { d: [0, 1, 2, 11].includes(i) ? rect(x, y, 22, 20) : ring(x, y, 22, 20, 4) };
    }),
  ],
  // 03 Sun, how it is dried: the sun over a drying yard
  sun: [
    { d: circle(100, 50, 22) },
    { d: rays(100, 50, 30, 44, 2.6) },
    { d: "M28 112h144l8 9H20Z" },
    { d: "M12 128h176l8 10H4Z" },
  ],
  // 04 Sort, cleaning and grading: three heaps graded by size, each flagged
  grades: [
    { d: "M8 130h184v6H8Z" },
    { d: "M18 130Q40 98 62 130Z" },
    { d: "M70 130Q100 76 130 130Z" },
    { d: "M138 130Q165 52 192 130Z" },
    { d: rect(39, 72, 3, 30) + "M42 72l14 5-14 5Z" },
    { d: rect(99, 44, 3, 32) + "M102 44l14 5-14 5Z" },
    { d: rect(164, 14, 3, 36) + "M167 14l14 5-14 5Z" },
  ],
  // 05 Check, against your spec: a specification sheet ticked line by line
  spec: [
    { d: "M48 8h82l26 26v108H48Z" + "M54 14h70l26 26v96H54Z" },
    { d: "M126 8h6v24h24v6h-30Z" },
    ...[52, 76, 100, 124].flatMap((y) => [{ d: tick(62, y) }, { d: rect(94, y - 4, y === 124 ? 30 : 46, 6) }]),
  ],
  // 06 Pack, packing and marking: bags stacked for loading, the front one marked
  sacks: [
    ...PATHS.sack.map((d) => ({ d, x: 34, y: 70, s: 0.6 })),
    ...PATHS.sack.map((d) => ({ d, x: 106, y: 70, s: 0.6 })),
    ...PATHS.sack.map((d) => ({ d, x: 70, y: 12, s: 0.6 })),
  ],
  // 07 Container, by sea or by air: a container and a plane
  cargo: [
    { d: CONTAINER, x: 4, y: 82, s: 0.52 },
    { d: "M0 136h112v5H0Z" },
    { d: PLANE, x: 112, y: 6, s: 0.86, r: 40 },
  ],
  // 08 Port, documents and shipping: the shipment's papers, stamped
  papers: [
    { d: "M70 10h92v112h-6V16H70Z" },
    { d: rect(70, 10, 6, 14) },
    { d: ring(40, 26, 92, 116, 6) },
    ...[48, 62, 76, 90].map((y, i) => ({ d: rect(56, y, i === 3 ? 34 : 60, 5) })),
    { d: circle(114, 120, 20) + circle(114, 120, 14) },
    { d: circle(114, 120, 5) },
  ],
};

/** SVG transform for a part, matching `applyPart` on the canvas. */
export const svgTransform = ({ x = 0, y = 0, s = 1, r = 0 }: Part) =>
  x || y || s !== 1 || r ? `translate(${x} ${y}) scale(${s})${r ? ` rotate(${r} 50 50)` : ""}` : undefined;

/** Paint every part of a drawing onto a canvas context. */
export function paintArt(ctx: CanvasRenderingContext2D, kind: ProcessArtKind) {
  for (const p of PROCESS_ART[kind]) {
    const { x = 0, y = 0, s = 1, r = 0 } = p;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    if (r) {
      ctx.translate(50, 50);
      ctx.rotate((r * Math.PI) / 180);
      ctx.translate(-50, -50);
    }
    ctx.fill(new Path2D(p.d), "evenodd");
    ctx.restore();
  }
}
