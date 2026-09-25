"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { StageArt } from "@/components/art/StageArt";
import { play, whenReady } from "@/components/motion/bus";
import { loadGsap } from "@/components/motion/gsap";
import { mouth } from "@/components/motion/particles/shapes";
import { setStage } from "@/lib/journey";
import { PALETTE } from "./palette";
import { homeScenes } from "./scenes";

const SEEN_KEY = "spiceman:intro";

/**
 * The first screen. The headline is server-rendered and never waits for
 * animation. On a first visit the mortar grinds and the ground spice rises
 * out of the bowl to become the particle field, which settles into a heap.
 */
export function Opening() {
  const section = useRef<HTMLElement>(null);
  const mortar = useRef<HTMLDivElement>(null);
  const bowl = useRef<HTMLDivElement>(null);
  const pile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let revert = () => {};
    setStage(0);

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable: play the intro */
    }

    whenReady().then(async (engine) => {
      if (cancelled || !engine) return;
      const heapScene = homeScenes.heap(pile.current);
      // Only grind if the reader is still at the top of the page.
      if (seen || window.scrollY > 40) {
        play(heapScene);
        return;
      }
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const pestle = mortar.current?.querySelector(".pestle");
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        if (pestle) {
          tl.to(pestle, {
            rotation: -16,
            x: -5,
            y: 2,
            svgOrigin: "74 62",
            duration: 0.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 5,
          });
        }
        tl.call(
          () =>
            play({
              ...heapScene,
              from: { anchor: bowl.current, shape: mouth(), colors: PALETTE.spice },
              duration: 1700,
              scatter: 70,
            }),
          undefined,
          0.55,
        );
        tl.fromTo(
          mortar.current,
          { y: 0 },
          { y: -6, duration: 0.18, yoyo: true, repeat: 3, ease: "sine.inOut" },
          0,
        );
      });
      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  // Returning to the top of the page re-forms the heap.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let kill = () => {};
    let cancelled = false;
    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom 45%",
        onEnterBack: () => {
          setStage(0);
          play(homeScenes.heap(pile.current));
        },
      });
      kill = () => st.kill();
    });
    return () => {
      cancelled = true;
      kill();
    };
  }, []);

  return (
    <section
      ref={section}
      aria-labelledby="home-title"
      className="relative flex min-h-[100svh] flex-col overflow-x-clip pt-[calc(var(--header-h)+2.5rem)] lg:block"
    >
      <div className="wrap grid-12 relative z-10 lg:min-h-[calc(100svh-var(--header-h)-2.5rem)]">
        <p className="body-l col-span-4 max-w-[30ch] text-brown md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10">
          Wholesale trade and export of spices and pulses, from Lawspet in Pondicherry to ports abroad.
        </p>

        <h1
          id="home-title"
          className="display-xxl col-span-4 mt-10 md:col-span-8 lg:absolute lg:bottom-[12vh] lg:left-[var(--margin)] lg:mt-0"
        >
          Pure spices, <span className="lg:block">
            from the <em className="display-em text-green">soil</em>
          </span>{" "}
          <span className="lg:block">to the ship.</span>
        </h1>

        <div className="col-span-4 mt-8 flex items-center gap-6 md:col-span-4 lg:absolute lg:bottom-[5vh] lg:left-[var(--margin)] lg:mt-0">
          <Link
            href="/contact"
            className="mono-label group inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-ink px-5 py-3.5 text-paper transition-colors hover:bg-green"
            data-cursor="Quote"
          >
            Request a quote
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link href="/journey" className="mono-label link-draw whitespace-nowrap text-brown" data-cursor="Go">
            Follow the route
          </Link>
        </div>
      </div>

      {/* The pile, and the mortar it came from */}
      <div className="relative mt-8 h-[36svh] w-full flex-none lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:h-[52svh] lg:w-[58vw]">
        <div ref={pile} data-scene-anchor className="absolute inset-x-[4%] bottom-0 top-[18%]">
          <StageArt kind="heap" colors={PALETTE.spice} count={420} w={600} h={300} />
        </div>
        <div
          ref={mortar}
          className="absolute right-[max(var(--margin),6%)] top-0 w-[22vw] max-w-[190px] min-w-[96px] lg:right-[8%] lg:top-[-6%]"
        >
          <LogoMark compact className="w-full" />
          <div ref={bowl} aria-hidden className="absolute left-[16%] top-[45%] h-[8%] w-[68%]" />
        </div>
      </div>
    </section>
  );
}
