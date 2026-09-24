"use client";

import { useRef, type ReactNode } from "react";
import { productShapes } from "@/components/motion/particles/silhouettes";
import { useParticleScene } from "@/components/motion/useParticleScene";
import type { Silhouette } from "@/data/products";
import { accentPalette } from "@/lib/color";

/** The particles gather into this product's silhouette, then hand off to the drawing. */
export function ProductStage({
  slug,
  silhouette,
  accent,
  children,
  className = "",
}: {
  slug: string;
  silhouette: Silhouette;
  accent: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useParticleScene(
    () => ({
      id: `product-${slug}`,
      parts: [{ anchor: ref.current, shape: productShapes[silhouette], colors: accentPalette(accent), size: 1.1 }],
      handoff: true,
      duration: 1250,
      scatter: 90,
    }),
    slug,
  );

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-500 ${className}`}
      style={{ opacity: revealed ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
