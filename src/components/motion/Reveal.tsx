"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsapNow, loadGsap } from "./gsap";
import { hasNavigated } from "./navigation";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "lines" masks and lifts each line; "chars" for short display words; "fade" for blocks */
  by?: "lines" | "chars" | "fade";
  delay?: number;
  id?: string;
};

/**
 * Text that settles into place line by line as it enters the viewport.
 * Server-rendered and fully visible without JS or with reduced motion;
 * text that is already on screen at first load is never hidden.
 */
export function Reveal({ as: Tag = "div", children, className, by = "lines", delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.documentElement.dataset.motion === "reduced") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const inView = el.getBoundingClientRect().top < window.innerHeight;
    // On the first load, don't hide text the reader can already see.
    if (inView && !hasNavigated()) return;

    let revert = () => {};
    let cancelled = false;

    const run = (b: NonNullable<ReturnType<typeof gsapNow>>) => {
      if (cancelled) return;
      const { gsap, SplitText } = b;
      const ctx = gsap.context(() => {
        const trigger = inView ? undefined : { trigger: el, start: "top 88%", once: true };
        if (by === "fade") {
          gsap.from(el, { autoAlpha: 0, y: 24, duration: 0.9, delay, ease: "power3.out", scrollTrigger: trigger });
          return;
        }
        SplitText.create(el, {
          type: by === "chars" ? "lines,chars" : "lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(by === "chars" ? self.chars : self.lines, {
              yPercent: 110,
              duration: by === "chars" ? 0.8 : 0.95,
              stagger: by === "chars" ? 0.025 : 0.07,
              delay,
              ease: "power4.out",
              scrollTrigger: trigger,
            });
          },
        });
      }, el);
      revert = () => ctx.revert();
    };

    const ready = gsapNow();
    if (ready) run(ready);
    else document.fonts.ready.then(() => loadGsap()).then(run);

    return () => {
      cancelled = true;
      revert();
    };
  }, [by, delay]);

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
