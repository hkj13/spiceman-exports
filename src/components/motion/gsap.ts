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

/** GSAP is loaded after first paint and shared by every scene. */
export function loadGsap(): Promise<GsapBundle> {
  if (bundle) return Promise.resolve(bundle);
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/SplitText")]).then(
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
