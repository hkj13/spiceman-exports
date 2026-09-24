import type { Rect, ShapeFn, ShapeOut } from "./types";

/* ------------------------------------------------------------------ */
/* Procedural shapes                                                   */
/* ------------------------------------------------------------------ */

const gauss = (rng: () => number) => {
  // Box-Muller, clamped so nothing flies to infinity
  const u = Math.max(rng(), 1e-6);
  const v = rng();
  return Math.max(-3, Math.min(3, Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)));
};

/** Evenly scattered across the box. */
export const scatter =
  (margin = 0): ShapeFn =>
  (n, r, rng) => {
    const pos = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      pos[i * 2] = r.x - margin + rng() * (r.w + margin * 2);
      pos[i * 2 + 1] = r.y - margin + rng() * (r.h + margin * 2);
    }
    return { pos };
  };

/** A mound of grains sitting on the bottom edge of the box: a rounded spill, not a cone. */
export const heap =
  (peak = 0.9, spread = 1.6): ShapeFn =>
  (n, r, rng) => {
    const pos = new Float32Array(n * 2);
    const size = new Float32Array(n);
    const cx = r.x + r.w / 2;
    const half = r.w / 2;
    const bottom = r.y + r.h;
    const profile = (u: number) => Math.pow(Math.max(0, 1 - u * u), spread);
    for (let i = 0; i < n; i++) {
      // rejection-sample x in proportion to the pile's height there
      let u = 0;
      for (let tries = 0; tries < 12; tries++) {
        u = rng() * 2 - 1;
        if (rng() < profile(u)) break;
      }
      const h = r.h * peak * profile(u);
      // denser toward the surface, where grains come to rest
      const depth = Math.pow(rng(), 0.5);
      pos[i * 2] = cx + u * half + gauss(rng) * 1.5;
      pos[i * 2 + 1] = bottom - h * depth;
      size[i] = 0.8 + rng() * 0.5;
    }
    return { pos, size };
  };

/** Seeds lying in curved furrows, receding in perspective. */
export const furrows =
  (rows = 6): ShapeFn =>
  (n, r, rng) => {
    const pos = new Float32Array(n * 2);
    const size = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const row = Math.floor(rng() * rows);
      const depth = (row + 1) / rows; // 0 far .. 1 near
      const t = rng();
      const y0 = r.y + r.h * (0.15 + 0.85 * Math.pow(depth, 1.4));
      const inset = (1 - depth) * r.w * 0.22;
      const x = r.x + inset + t * (r.w - inset * 2);
      const wave = Math.sin(t * Math.PI * 2 + row) * r.h * 0.02;
      pos[i * 2] = x + gauss(rng) * 2;
      pos[i * 2 + 1] = y0 + wave + gauss(rng) * (1.5 + depth * 3);
      size[i] = 0.55 + depth * 0.7;
    }
    return { pos, size };
  };

/** Grains spread flat on a drying yard, in slight perspective. */
export const bed = (): ShapeFn => (n, r, rng) => {
  const pos = new Float32Array(n * 2);
  const size = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const v = Math.pow(rng(), 0.8); // depth
    const u = rng();
    const inset = (1 - v) * r.w * 0.18;
    pos[i * 2] = r.x + inset + u * (r.w - inset * 2);
    pos[i * 2 + 1] = r.y + r.h * (0.1 + v * 0.9);
    size[i] = 0.6 + v * 0.6;
  }
  return { pos, size };
};

/** Large grains held above a mesh line, fine ones fallen through below. */
export const sieve = (): ShapeFn => (n, r, rng) => {
  const pos = new Float32Array(n * 2);
  const size = new Float32Array(n);
  const mesh = r.y + r.h * 0.48;
  for (let i = 0; i < n; i++) {
    const big = rng() < 0.55;
    const x = r.x + rng() * r.w;
    if (big) {
      pos[i * 2] = x;
      pos[i * 2 + 1] = mesh - 4 - Math.pow(rng(), 1.8) * r.h * 0.22;
      size[i] = 1.1 + rng() * 0.4;
    } else {
      pos[i * 2] = x + gauss(rng) * 6;
      pos[i * 2 + 1] = mesh + 14 + Math.pow(rng(), 0.7) * r.h * 0.5;
      size[i] = 0.45 + rng() * 0.25;
    }
  }
  return { pos, size };
};

/** A loupe: dense ring with a sparse, magnified interior. */
export const loupe = (): ShapeFn => (n, r, rng) => {
  const pos = new Float32Array(n * 2);
  const size = new Float32Array(n);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const R = Math.min(r.w, r.h) / 2;
  for (let i = 0; i < n; i++) {
    const a = rng() * Math.PI * 2;
    const ring = rng() < 0.62;
    const rad = ring ? R * (0.93 + rng() * 0.07) : R * Math.sqrt(rng()) * 0.82;
    pos[i * 2] = cx + Math.cos(a) * rad;
    pos[i * 2 + 1] = cy + Math.sin(a) * rad;
    size[i] = ring ? 0.7 : 1.4 + rng() * 0.8;
  }
  return { pos, size };
};

/** Grains lifting off a mouth (ellipse), used as a spawn shape. */
export const mouth = (): ShapeFn => (n, r, rng) => {
  const pos = new Float32Array(n * 2);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  for (let i = 0; i < n; i++) {
    const a = rng() * Math.PI * 2;
    const k = Math.sqrt(rng());
    pos[i * 2] = cx + Math.cos(a) * k * r.w * 0.5;
    pos[i * 2 + 1] = cy + Math.sin(a) * k * r.h * 0.5;
  }
  return { pos };
};

/** A thin line of grains, e.g. a horizon. */
export const line = (thickness = 3): ShapeFn => (n, r, rng) => {
  const pos = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    pos[i * 2] = r.x + rng() * r.w;
    pos[i * 2 + 1] = r.y + r.h / 2 + gauss(rng) * thickness;
  }
  return { pos };
};

/** Combine shapes, splitting the count by weight. */
export const combine =
  (...parts: [ShapeFn, number][]): ShapeFn =>
  (n, r, rng) => {
    const total = parts.reduce((s, [, w]) => s + w, 0);
    const pos = new Float32Array(n * 2);
    const size = new Float32Array(n).fill(1);
    const alpha = new Float32Array(n).fill(1);
    let o = 0;
    parts.forEach(([fn, w], idx) => {
      const c = idx === parts.length - 1 ? n - o : Math.round((n * w) / total);
      if (c <= 0) return;
      const out = fn(c, r, rng);
      pos.set(out.pos, o * 2);
      if (out.size) size.set(out.size, o);
      if (out.alpha) alpha.set(out.alpha, o);
      o += c;
    });
    return { pos, size, alpha };
  };

/* ------------------------------------------------------------------ */
/* Raster-sampled silhouettes                                          */
/* ------------------------------------------------------------------ */

export type Draw = (ctx: CanvasRenderingContext2D) => void;

type Mask = { pts: Uint16Array; count: number; w: number; h: number; ox: number; oy: number; scale: number };
const maskCache = new Map<string, Mask>();

function rasterise(key: string, draw: Draw, vbW: number, vbH: number, r: Rect): Mask | null {
  // Fit the viewBox inside the rect (contain) at a capped raster size.
  const scale = Math.min(r.w / vbW, r.h / vbH);
  const drawW = vbW * scale;
  const drawH = vbH * scale;
  const raster = Math.min(1, 360 / Math.max(drawW, drawH));
  const w = Math.max(8, Math.round(drawW * raster));
  const h = Math.max(8, Math.round(drawH * raster));
  const cacheKey = `${key}:${w}x${h}`;
  const ox = r.x + (r.w - drawW) / 2;
  const oy = r.y + (r.h - drawH) / 2;
  const cached = maskCache.get(cacheKey);
  if (cached) return { ...cached, ox, oy, scale: 1 / raster };

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.scale(w / vbW, h / vbH);
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  draw(ctx);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 110) pts.push(x, y);
    }
  }
  const mask: Mask = { pts: Uint16Array.from(pts), count: pts.length / 2, w, h, ox, oy, scale: 1 / raster };
  maskCache.set(cacheKey, mask);
  return mask;
}

/**
 * Sample points inside a drawn silhouette. `draw` paints in viewBox units.
 */
export const silhouette =
  (key: string, draw: Draw, vbW = 100, vbH = 100): ShapeFn =>
  (n, r, rng): ShapeOut => {
    const mask = rasterise(key, draw, vbW, vbH, r);
    if (!mask || mask.count === 0) return heap()(n, r, rng);
    const pos = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const k = Math.floor(rng() * mask.count);
      pos[i * 2] = mask.ox + (mask.pts[k * 2] + rng()) * mask.scale;
      pos[i * 2 + 1] = mask.oy + (mask.pts[k * 2 + 1] + rng()) * mask.scale;
    }
    return { pos };
  };

/** Silhouette from SVG path data. */
export const pathShape = (key: string, d: string | string[], vbW = 100, vbH = 100, evenOdd = false) =>
  silhouette(
    key,
    (ctx) => {
      for (const p of Array.isArray(d) ? d : [d]) ctx.fill(new Path2D(p), evenOdd ? "evenodd" : "nonzero");
    },
    vbW,
    vbH,
  );
