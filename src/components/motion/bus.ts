"use client";

import type { Engine, Scene, Tier } from "./particles/types";

/**
 * The seam between pages and the particle layer. Pages describe a scene;
 * the bus forwards it to the engine once it has loaded. If particles are
 * off (reduced motion, low power) or not ready yet, scenes settle
 * immediately so the page's own artwork is always visible.
 */

let engine: Engine | null = null;
let tier: Tier | null = null;
let pending: Scene | null = null;
let booted = false;
const readyWaiters = new Set<(e: Engine | null) => void>();

export function setTier(t: Tier) {
  tier = t;
  if (t === "off") flushReady(null);
}

export function getTier() {
  return tier;
}

export function registerEngine(e: Engine | null) {
  engine = e;
  // Static stage art steps aside once live particles can draw the scenes.
  document.documentElement.dataset.particles = e ? "on" : "off";
  if (e && pending) {
    // The page is already on screen: land the scene without a morph.
    e.play({ ...pending, instant: true });
  }
  pending = null;
  booted = !!e;
  flushReady(e);
}

function flushReady(e: Engine | null) {
  readyWaiters.forEach((w) => w(e));
  readyWaiters.clear();
}

/** Resolves with the engine once loaded, or null if particles are off. */
export function whenReady(): Promise<Engine | null> {
  if (engine || tier === "off") return Promise.resolve(engine);
  return new Promise((res) => readyWaiters.add(res));
}

/** True once the engine is live, i.e. for every page after the first. */
export function particlesLive() {
  return booted && !!engine;
}

export function play(scene: Scene) {
  if (engine) {
    engine.play(scene);
    return;
  }
  pending = scene;
  scene.onSettled?.();
}

export function setTint(hex: string, amount: number) {
  engine?.setTint(hex, amount);
}
