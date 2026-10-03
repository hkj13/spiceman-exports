"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Mark = { label: string; el: HTMLElement };

/**
 * The hairline in the left margin: one tick per section of the current page
 * (sections marked `data-rail="Label"`), with a peppercorn on the section
 * being read and its name beside it. Decorative; headings carry the same
 * information. Hidden on pages with fewer than two sections.
 */
export function RouteLine() {
  const pathname = usePathname();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [active, setActive] = useState(0);

  // Collect the page's sections after each navigation (and once more after
  // late content mounts).
  useEffect(() => {
    const collect = () =>
      setMarks(
        [...document.querySelectorAll<HTMLElement>("main [data-rail]")].map((el) => ({
          label: el.dataset.rail || "",
          el,
        })),
      );
    collect();
    const t = window.setTimeout(collect, 600);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // The active section is the one taking up most of the viewport.
  useEffect(() => {
    if (marks.length < 2) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let best = 0;
      let bestArea = -1;
      marks.forEach((m, i) => {
        const r = m.el.getBoundingClientRect();
        const w = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
        const h = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const area = w * h;
        if (area > bestArea + 1) {
          bestArea = area;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [marks]);

  if (marks.length < 2) return null;
  const last = marks.length - 1;
  const pos = (i: number) => `${(i / last) * 100}%`;
  const current = marks[Math.min(active, last)];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-6 top-[calc(var(--header-h)+1.5rem)] z-40 hidden w-8 -translate-x-1/2 sm:block [view-transition-name:route-line]"
      style={{ left: "var(--route-x)" }}
    >
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-rule night:bg-paper/20" />
      {marks.map((m, i) => (
        <div
          key={`${m.label}-${i}`}
          className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
          style={{ top: pos(i) }}
        >
          <span
            className={`block h-px w-2.5 transition-colors duration-500 ${i <= active ? "bg-brown night:bg-paper/70" : "bg-rule night:bg-paper/25"}`}
          />
        </div>
      ))}
      {/* peppercorn, carrying the current section's number and name */}
      <div
        className="absolute left-1/2 top-0 h-full w-0 transition-transform duration-700 ease-(--ease-settle)"
        style={{ transform: `translateY(${(active / last) * 100}%)` }}
      >
        <span className="absolute -left-[5px] -top-[5px] block h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#6b5a4e,#2b2420_60%)] shadow-[0_1px_0_rgb(0_0_0/0.2)] night:bg-[radial-gradient(circle_at_35%_30%,#fff3c9,#e3a21a_60%)]" />
        <span
          className={`mono-label absolute left-2 hidden whitespace-nowrap text-[0.625rem] text-brown [writing-mode:vertical-rl] lg:block night:text-paper/70 ${active === last && last > 0 ? "-top-3 -translate-y-full" : "top-3"}`}
        >
          {String(active + 1).padStart(2, "0")} {current.label}
        </span>
      </div>
    </div>
  );
}
