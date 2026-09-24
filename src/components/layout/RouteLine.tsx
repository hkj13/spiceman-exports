"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { stages } from "@/config/site";
import { setStage, useStage } from "@/lib/journey";

/** Pages without scroll-driven chapters sit at a fixed point on the route. */
const PAGE_STAGE: Record<string, number> = {
  "/about": 0,
  "/products": 3,
  "/contact": 7,
};

/**
 * The signature hairline in the left margin: the eight stages from soil to
 * port, with a peppercorn marking where the reader is. Decorative; the
 * same information is available in headings and the nav.
 */
export function RouteLine() {
  const pathname = usePathname();
  const stage = useStage();

  useEffect(() => {
    if (pathname in PAGE_STAGE) setStage(PAGE_STAGE[pathname]);
    else if (pathname.startsWith("/products/")) setStage(4);
    else setStage(0);
  }, [pathname]);

  const active = Math.round(stage);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-6 top-[calc(var(--header-h)+1.5rem)] z-40 hidden w-8 -translate-x-1/2 sm:block [view-transition-name:route-line]"
      style={{ left: "var(--route-x)" }}
    >
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-rule night:bg-paper/20" />
      {stages.map((s, i) => (
        <div
          key={s.id}
          className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
          style={{ top: `${(i / 7) * 100}%` }}
        >
          <span
            className={`block h-px w-2.5 transition-colors duration-500 ${i <= active ? "bg-brown night:bg-paper/70" : "bg-rule night:bg-paper/25"}`}
          />
        </div>
      ))}
      {/* peppercorn */}
      <div
        className="absolute left-1/2 top-0 h-full w-0 transition-transform duration-700 ease-(--ease-settle)"
        style={{ transform: `translateY(${(stage / 7) * 100}%)` }}
      >
        <span className="absolute -left-[5px] -top-[5px] block h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#6b5a4e,#2b2420_60%)] shadow-[0_1px_0_rgb(0_0_0/0.2)] night:bg-[radial-gradient(circle_at_35%_30%,#fff3c9,#e3a21a_60%)]" />
      </div>
      <div
        className="absolute left-3 top-0 hidden transition-transform duration-700 ease-(--ease-settle) lg:block"
        style={{ transform: `translateY(calc(${(active / 7)} * (100vh - var(--header-h) - 3rem) - 50%))` }}
      >
        <span className="mono-label block whitespace-nowrap text-[0.625rem] text-brown [writing-mode:vertical-rl] night:text-paper/70">
          {stages[active].n} {stages[active].label}
        </span>
      </div>
    </div>
  );
}
