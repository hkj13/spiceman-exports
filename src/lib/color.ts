const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

/** Mix a hex colour toward white (amount > 0) or black (amount < 0). */
export function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const t = amount > 0 ? 255 : 0;
  const k = Math.abs(amount);
  const mix = (c: number) => clamp(c + (t - c) * k);
  return `#${((1 << 24) | (mix(r) << 16) | (mix(g) << 8) | mix(b)).toString(16).slice(1)}`;
}

/** A small palette around a spice's own colour, for particles and heaps. */
export const accentPalette = (hex: string) => [hex, shade(hex, -0.22), shade(hex, 0.18), shade(hex, -0.4), hex];
