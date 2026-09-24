"use client";

import { useRef } from "react";
import { heap } from "@/components/motion/particles/shapes";
import { useParticleScene } from "@/components/motion/useParticleScene";

export function HeroHeap() {
  const ref = useRef<HTMLDivElement>(null);
  useParticleScene(
    () => ({
      id: "home-heap",
      parts: [{ anchor: ref.current, shape: heap(), colors: ["#2B2420", "#5A2E1A", "#E3A21A", "#B3201B", "#B99459"] }],
      live: true,
    }),
    "home-heap",
  );
  return <div ref={ref} aria-hidden className="absolute bottom-0 right-0 h-[45vh] w-[60vw]" />;
}
