"use client";

import { useSyncExternalStore } from "react";

/**
 * Where the reader is on the soil-to-shipment route, as a float from 0
 * (01 Soil) to 7 (08 Port). Pages either pin themselves to one stage or
 * drive it from scroll progress; the route line in the margin follows.
 */
let stage = 0;
const listeners = new Set<() => void>();

export function setStage(next: number) {
  const clamped = Math.max(0, Math.min(7, next));
  if (Math.abs(clamped - stage) < 0.001) return;
  stage = clamped;
  listeners.forEach((l) => l());
}

export function useStage() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => stage,
    () => 0,
  );
}
