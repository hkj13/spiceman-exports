"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = [
  "main [data-rv]",
  "main figure",
  "main [data-rv-group] > *",
  // headings, lead paragraphs and labels in content sections
  "main section h2",
  "main section h2 + p",
  "main dl > div",
  "main aside",
  "main nav[aria-label='More products']",
  "main [data-stage-article] article > *",
].join(", ");

/**
 * Photos and marked blocks below the fold ease up into place as they reach
 * the screen. Anything already on screen is left alone, so nothing visible
 * is ever hidden after load. Off with reduced motion.
 */
export function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let io: IntersectionObserver | null = null;
    const t = window.setTimeout(() => {
      const vh = window.innerHeight;
      const els = [...document.querySelectorAll<HTMLElement>(SELECTOR)].filter((el) => {
        // skip elements inside sideways-pinned chapters and anything already in view
        if (el.closest("[data-panel], .reveal-line-mask, [data-reveal-skip]")) return false;
        // headings already animated by the line-reveal effect are left alone
        if (el.querySelector(".reveal-line-mask")) return false;
        const r = el.getBoundingClientRect();
        return r.top > vh * 0.95 && r.width > 0;
      });
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            el.classList.add("rv-in");
            el.classList.remove("rv-pending");
            io?.unobserve(el);
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      els.forEach((el, i) => {
        el.classList.add("rv-pending");
        // siblings in a group follow one another slightly
        const parent = el.parentElement;
        if (parent?.hasAttribute("data-rv-group")) {
          el.style.transitionDelay = `${Math.min([...parent.children].indexOf(el), 6) * 70}ms`;
        }
        io!.observe(el);
        void i;
      });
    }, 300);
    return () => {
      window.clearTimeout(t);
      io?.disconnect();
      document.querySelectorAll(".rv-pending").forEach((el) => el.classList.remove("rv-pending"));
    };
  }, [pathname]);
  return null;
}
