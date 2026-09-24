import type { Tier } from "./particles/types";

type NavigatorExtras = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Pick how much particle work this device should do. */
export function detectTier(): Tier {
  if (typeof window === "undefined" || prefersReducedMotion()) return "off";
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return "low";
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return "low";
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores <= 2 || memory <= 2) return "low";
  const small = window.innerWidth < 768;
  if (cores <= 4 || memory <= 4 || small) return "mid";
  return "high";
}
