"use client";

import { useEffect, useRef, useState } from "react";
import { particlesLive, play } from "./bus";
import type { Scene } from "./particles/types";

/**
 * Ask the particle layer to form a scene while this component is mounted.
 *
 * Returns `revealed`: whether the component's own artwork should be visible.
 * On the first page load (server-rendered) artwork is visible straight away;
 * after client navigation it waits until the particles have formed it, which
 * is what makes the handoff read as one object.
 */
export function useParticleScene(build: () => Scene | null, key: string) {
  const [revealed, setRevealed] = useState(() => !particlesLive());
  const buildRef = useRef(build);

  useEffect(() => {
    buildRef.current = build;
  });

  useEffect(() => {
    let alive = true;
    const scene = buildRef.current();
    if (!scene) return;
    play({
      ...scene,
      onSettled: () => {
        scene.onSettled?.();
        if (alive) setRevealed(true);
      },
    });
    return () => {
      alive = false;
    };
  }, [key]);

  return revealed;
}
