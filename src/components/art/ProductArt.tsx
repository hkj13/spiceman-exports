import { useId } from "react";
import { DISC_SETS, FINGERS, PATHS } from "@/components/motion/particles/silhouettes";
import { heap, mulberry } from "@/components/motion/particles/shapes";
import type { Product } from "@/data/products";
import { accentPalette, shade } from "@/lib/color";

/**
 * Illustration of a product in its own colours: the silhouette the
 * particles form on the product page, drawn as SVG so it is crisp and
 * available without JavaScript.
 */
export function ProductArt({ product, className = "" }: { product: Product; className?: string }) {
  const id = useId().replace(/:/g, "");
  const { accent, silhouette } = product;
  const dark = shade(accent, -0.35);
  const light = shade(accent, 0.25);
  const title = `${product.name}, illustrated`;

  const grain = (
    <defs>
      <pattern id={`g-${id}`} width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="3" height="3" fill={accent} />
        <circle cx="0.8" cy="0.8" r="0.55" fill={dark} opacity="0.55" />
        <circle cx="2.3" cy="2.1" r="0.45" fill={light} opacity="0.6" />
      </pattern>
    </defs>
  );

  let body;
  if (silhouette === "quill") {
    body = (
      <g transform="translate(50 50) rotate(-25.8)">
        <rect x="-44" y="-9" width="88" height="18" rx="9" fill={`url(#g-${id})`} />
        <rect x="-40" y="-9" width="6" height="18" rx="3" fill={dark} opacity=".5" />
        <g transform="translate(4 22)">
          <rect x="-40" y="-8" width="80" height="16" rx="8" fill={`url(#g-${id})`} />
          <rect x="-36" y="-8" width="5" height="16" rx="2.5" fill={dark} opacity=".5" />
        </g>
      </g>
    );
  } else if (silhouette === "finger") {
    body = FINGERS.map((c, i) => (
      <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`}>
        <rect y={-c.w / 2} width={c.len} height={c.w} rx={c.w / 2} fill={`url(#g-${id})`} />
        {/* the rings on a turmeric finger */}
        {Array.from({ length: Math.floor(c.len / 9) }, (_, k) => (
          <rect key={k} x={6 + k * 9} y={-c.w / 2 + 1.5} width="1" height={c.w - 3} rx=".5" fill={dark} opacity=".2" />
        ))}
      </g>
    ));
  } else if (silhouette in DISC_SETS) {
    const discs = DISC_SETS[silhouette as keyof typeof DISC_SETS];
    const palette = accentPalette(accent);
    body = discs.map((d, i) => (
      <g key={i} transform={`translate(${d.cx.toFixed(2)} ${d.cy.toFixed(2)}) rotate(${((d.rot * 180) / Math.PI).toFixed(1)})`}>
        <ellipse rx={d.rx.toFixed(2)} ry={d.ry.toFixed(2)} fill={palette[i % palette.length]} />
        <ellipse
          cx={(-d.rx * 0.3).toFixed(2)}
          cy={(-d.ry * 0.3).toFixed(2)}
          rx={(d.rx * 0.35).toFixed(2)}
          ry={(d.ry * 0.3).toFixed(2)}
          fill="#fff"
          opacity=".18"
        />
      </g>
    ));
  } else {
    const d = PATHS[silhouette as "chilli" | "pod" | "clove"];
    body = <path d={d} fill={`url(#g-${id})`} />;
  }

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      {grain}
      {body}
    </svg>
  );
}

/** A heap of the product, in its colours, for the sorting table. */
export function ProductHeapArt({ product, className = "" }: { product: Product; className?: string }) {
  const palette = accentPalette(product.accent);
  const rng = mulberry(product.slug.length * 977 + product.slug.charCodeAt(0));
  const count = 190;
  const out = heap(0.95, 1.4)(count, { x: 0, y: 0, w: 200, h: 110 }, rng);
  return (
    <svg viewBox="0 0 200 110" className={className} aria-hidden>
      <ellipse cx="100" cy="108" rx="92" ry="3.5" fill="#5A2E1A" opacity=".12" />
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={out.pos[i * 2].toFixed(1)}
          cy={out.pos[i * 2 + 1].toFixed(1)}
          r={(2.9 * (out.size?.[i] ?? 1)).toFixed(2)}
          fill={palette[Math.floor(rng() * palette.length)]}
        />
      ))}
    </svg>
  );
}
