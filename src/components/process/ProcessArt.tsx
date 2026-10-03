import { useId } from "react";
import { ART_H, ART_W, PROCESS_ART, svgTransform, type ProcessArtKind } from "./drawings";

/** Grain colours for each Process drawing. */
export const PROCESS_COLORS: Record<ProcessArtKind, readonly string[]> = {
  field: ["#5A2E1A", "#3E6B2E"],
  calendar: ["#2E8B3E", "#C8231E"],
  sun: ["#E3A21A", "#B3201B"],
  grades: ["#6B4E2C", "#B99459"],
  spec: ["#2B2420", "#5A2E1A"],
  sacks: ["#5A2E1A", "#B99459"],
  cargo: ["#2B2420", "#B99459"],
  papers: ["#3A2F29", "#B3201B"],
};

/**
 * A still of a Process stage's drawing, filled with a pattern of grains. It's
 * what visitors see with reduced motion or before the particle layer boots,
 * and it hides itself once live particles take over (see `.stage-art`).
 */
export function ProcessArt({ kind }: { kind: ProcessArtKind }) {
  const id = `pg-${useId().replace(/:/g, "")}`;
  const [a, b] = PROCESS_COLORS[kind];
  return (
    <svg viewBox={`0 0 ${ART_W} ${ART_H}`} className="stage-art" aria-hidden>
      <defs>
        <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.8" cy="1.8" r="1.5" fill={a} />
          <circle cx="4.8" cy="4.8" r="1.1" fill={b} />
        </pattern>
      </defs>
      {PROCESS_ART[kind].map((p, i) => (
        <path key={i} d={p.d} transform={svgTransform(p)} fill={`url(#${id})`} fillRule="evenodd" />
      ))}
    </svg>
  );
}
