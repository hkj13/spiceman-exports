"use client";

import { useRef } from "react";
import { PALETTE } from "@/components/home/palette";
import { leafShape, PATHS } from "@/components/motion/particles/silhouettes";
import { useParticleScene } from "@/components/motion/useParticleScene";

const GREENS = ["#1D6A2C", "#2E8B3E", "#3E6B2E", "#5B7F2F", ...PALETTE.greenPepper];

/** Particles gather into a single leaf; the monogram sits inside it. */
export function LeafStage({ monogram }: { monogram: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useParticleScene(
    () => ({
      id: "about-leaf",
      parts: [{ anchor: ref.current, shape: leafShape, colors: GREENS }],
      handoff: true,
      duration: 1400,
      scatter: 110,
    }),
    "about-leaf",
  );

  return (
    <div ref={ref} className="relative aspect-square w-full">
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: revealed ? 1 : 0 }}
      >
        <defs>
          <pattern id="leaf-grain" width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill="#1D6A2C" />
            <circle cx="0.8" cy="0.8" r="0.55" fill="#12361C" opacity=".5" />
            <circle cx="2.2" cy="2.2" r="0.5" fill="#2E8B3E" opacity=".7" />
          </pattern>
          <clipPath id="leaf-clip">
            <path d={PATHS.leaf} />
          </clipPath>
        </defs>
        <path d={PATHS.leaf} fill="url(#leaf-grain)" />
        <g clipPath="url(#leaf-clip)">
          <path d="M50 96C50 70 50 40 50 8" stroke="#12361C" strokeWidth=".8" fill="none" opacity=".5" />
          {[22, 36, 50, 64].map((y) => (
            <g key={y} stroke="#12361C" strokeWidth=".5" fill="none" opacity=".35">
              <path d={`M50 ${y + 12}C42 ${y + 8} 34 ${y + 2} 28 ${y - 6}`} />
              <path d={`M50 ${y + 12}C58 ${y + 8} 66 ${y + 2} 72 ${y - 6}`} />
            </g>
          ))}
        </g>
      </svg>
      <p
        aria-hidden
        className="absolute inset-0 flex items-center justify-center font-display text-[clamp(3rem,9vw,7rem)] italic text-paper transition-opacity duration-700 [font-variation-settings:'opsz'_144]"
        style={{ opacity: revealed ? 1 : 0 }}
      >
        {monogram}
      </p>
    </div>
  );
}
