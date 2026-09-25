"use client";

import type Lenis from "lenis";

type GsapBundle = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

let bundle: GsapBundle | null = null;
let loading: Promise<GsapBundle> | null = null;
let lenis: Lenis | null = null;

/**
 * Resolve when the browser is idle, or as soon as the reader starts to
 * scroll or touch the page, whichever comes first. Keeps GSAP out of the
 * window where the first screen is being painted and hydrated.
 */
function afterFirstPaint() {
  return new Promise<void>((resolve) => {
    let done = false;
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
    const go = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, go));
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    if ("requestIdleCallback" in window) window.requestIdleCallback(go, { timeout: 2500 });
    else setTimeout(go, 1200);
  });
}

/** GSAP is loaded after first paint and shared by every scene. */
export function loadGsap(): Promise<GsapBundle> {
  if (bundle) return Promise.resolve(bundle);
  loading ??= afterFirstPaint()
    .then(() => Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]))
    .then(
    ([g, st, sp]) => {
      g.gsap.registerPlugin(st.ScrollTrigger, sp.SplitText);
      g.gsap.defaults({ ease: "power3.out" });
      bundle = { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger, SplitText: sp.SplitText };
      return bundle;
    },
  );
  return loading;
}

/** Synchronous access once loaded (used to animate in the same frame on client navigation). */
export const gsapNow = () => bundle;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;
