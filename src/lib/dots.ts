/**
 * Collapse many dots into one SVG path per colour. A still of a particle
 * scene then costs a handful of DOM nodes instead of hundreds of circles.
 */
export function dotPaths(
  count: number,
  pos: Float32Array,
  radius: (i: number) => number,
  color: (i: number) => string,
) {
  const byColor = new Map<string, string[]>();
  for (let i = 0; i < count; i++) {
    const r = radius(i);
    const x = pos[i * 2];
    const y = pos[i * 2 + 1];
    const d = `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
    const c = color(i);
    const list = byColor.get(c);
    if (list) list.push(d);
    else byColor.set(c, [d]);
  }
  return Array.from(byColor, ([fill, ds]) => ({ fill, d: ds.join("") }));
}
