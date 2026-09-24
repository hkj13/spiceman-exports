import { useId } from "react";
import { PATHS } from "@/components/motion/particles/silhouettes";
import { bed, furrows, heap, loupe, mulberry, sieve, strands } from "@/components/motion/particles/shapes";
import type { ShapeFn } from "@/components/motion/particles/types";

/**
 * A still of each particle scene, drawn as SVG on the server. It's what
 * visitors see with reduced motion or before the particle layer boots, and
 * it hides itself once live particles take over (see `.stage-art` in CSS).
 */

export type StageKind =
  | "heap"
  | "furrows"
  | "strands"
  | "bed"
  | "sieve"
  | "loupe"
  | "sack"
  | "container"
  | "ship";

const PROCEDURAL: Partial<Record<StageKind, ShapeFn>> = {
  heap: heap(),
  furrows: furrows(6),
  strands: strands(7),
  bed: bed(),
  sieve: sieve(),
  loupe: loupe(),
};

type Props = {
  kind: StageKind;
  colors: readonly string[];
  className?: string;
  /** Number of dots for procedural scenes */
  count?: number;
  /** viewBox width/height; match the anchor's aspect ratio */
  w?: number;
  h?: number;
};

export function StageArt({ kind, colors, className = "", count = 160, w = 400, h = 300 }: Props) {
  const id = useId().replace(/:/g, "");
  const shape = PROCEDURAL[kind];

  if (shape) {
    const rng = mulberry(kind.length * 131 + count);
    const out = shape(count, { x: 0, y: 0, w, h }, rng);
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className={`stage-art ${className}`} aria-hidden preserveAspectRatio="xMidYMid meet">
        {Array.from({ length: count }, (_, i) => (
          <circle
            key={i}
            cx={out.pos[i * 2].toFixed(1)}
            cy={out.pos[i * 2 + 1].toFixed(1)}
            r={(2.4 * (out.size?.[i] ?? 1)).toFixed(2)}
            fill={colors[Math.floor(rng() * colors.length)]}
          />
        ))}
      </svg>
    );
  }

  const dots = (
    <pattern id={`dots-${id}`} width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.7" fill={colors[0]} />
      <circle cx="5.5" cy="5.5" r="1.3" fill={colors[1] ?? colors[0]} />
    </pattern>
  );

  if (kind === "sack") {
    return (
      <svg viewBox="0 0 100 120" className={`stage-art ${className}`} aria-hidden>
        <defs>{dots}</defs>
        {PATHS.sack.map((d) => (
          <path key={d} d={d} fill={`url(#dots-${id})`} />
        ))}
      </svg>
    );
  }

  if (kind === "container") {
    return (
      <svg viewBox="0 0 200 90" className={`stage-art ${className}`} aria-hidden>
        <defs>{dots}</defs>
        <g fill={`url(#dots-${id})`}>
          <rect x="0" y="0" width="200" height="6" />
          <rect x="0" y="84" width="200" height="6" />
          <rect x="0" y="0" width="6" height="90" />
          <rect x="194" y="0" width="6" height="90" />
          {Array.from({ length: 11 }, (_, i) => (
            <rect key={i} x={(i + 1) * 16.6 - 1.5} y="10" width="3" height="70" />
          ))}
        </g>
      </svg>
    );
  }

  // ship
  return (
    <svg viewBox="0 0 240 100" className={`stage-art ${className}`} aria-hidden>
      <defs>{dots}</defs>
      <g fill={`url(#dots-${id})`}>
        <path d="M8 62h228l-22 32H30Z" />
        <rect x="26" y="24" width="22" height="38" />
        <rect x="32" y="12" width="8" height="12" />
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) =>
            row === 2 && (col < 2 || col > 6) ? null : (
              <rect key={`${row}-${col}`} x={60 + col * 17} y={50 - row * 12} width="15" height="10" />
            ),
          ),
        )}
      </g>
    </svg>
  );
}
