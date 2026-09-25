"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Photo } from "@/data/photos";
import { PhotoFrame } from "./PhotoFrame";

export type SlideItem = {
  key: string;
  photo: Photo;
  title: string;
  /** Small label above the title, e.g. "01" or "Spice" */
  eyebrow?: string;
  /** Small line under the title */
  meta?: string;
  href?: string;
};

type Props = {
  items: SlideItem[];
  /** Accessible name for the carousel */
  label: string;
  /** Aspect ratio class for each photo */
  aspect?: string;
  /** Width classes for each slide (mobile first) */
  slideWidth?: string;
  /** Light text for dark sections */
  tone?: "light" | "dark";
};

/**
 * A plain photo slider: swipe (or scroll) on phones, arrow buttons on larger
 * screens, a counter and a progress bar. Native scroll-snap does the work, so
 * it stays smooth on low-end phones and never traps the page scroll.
 */
export function PhotoSlider({
  items,
  label,
  aspect = "aspect-[4/5]",
  slideWidth = "w-[76vw] sm:w-[44vw] lg:w-[30vw] xl:w-[24vw]",
  tone = "light",
}: Props) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const id = useId();
  const dark = tone === "dark";

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft > max - 4);
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : 1;
    // At the far end several slides may be in view; count the last one as current.
    setIndex(el.scrollLeft > max - 4 ? items.length - 1 : Math.min(items.length - 1, Math.round(el.scrollLeft / step)));
  }, [items.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  const button = `grid h-11 w-11 place-items-center rounded-full border transition-colors disabled:opacity-30 ${
    dark
      ? "border-paper/40 text-paper hover:bg-paper hover:text-ink"
      : "border-ink/40 text-ink hover:bg-ink hover:text-paper"
  }`;

  return (
    <section aria-roledescription="carousel" aria-label={label} className="relative">
      <ul
        ref={track}
        id={id}
        className="flex snap-x snap-mandatory scroll-px-[var(--margin)] gap-4 overflow-x-auto px-[var(--margin)] pb-2 [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const body = (
            <>
              <PhotoFrame
                photo={item.photo}
                sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 76vw"
                className={`w-full ${aspect}`}
              />
              <span className="mt-4 block">
                {item.eyebrow && (
                  <span className={`mono-label block ${dark ? "text-turmeric" : "text-chilli"}`}>{item.eyebrow}</span>
                )}
                <span className="mt-1 flex items-baseline justify-between gap-3">
                  <span className="h3">{item.title}</span>
                  {item.href && (
                    <span aria-hidden className="mono-label transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </span>
                {item.meta && (
                  <span className={`mono-label mt-1 block text-[0.65rem] ${dark ? "text-paper/70" : "text-brown"}`}>
                    {item.meta}
                  </span>
                )}
              </span>
            </>
          );
          return (
            <li
              key={item.key}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}: ${item.title}`}
              className={`flex-none snap-start ${slideWidth}`}
            >
              {item.href ? (
                <Link href={item.href} className="group block" data-cursor="Open">
                  {body}
                </Link>
              ) : (
                <div className="group">{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Counter, progress bar and arrows */}
      <div className="wrap mt-6 flex items-center gap-5">
        <p className={`mono-label w-16 flex-none ${dark ? "text-paper/80" : "text-brown"}`}>
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <div aria-hidden className={`relative h-px flex-1 ${dark ? "bg-paper/25" : "bg-rule"}`}>
          <span
            className={`absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full ${dark ? "bg-turmeric" : "bg-ink"}`}
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
        <div className="flex flex-none gap-2">
          <button type="button" className={button} onClick={() => go(-1)} disabled={atStart} aria-controls={id} aria-label="Previous">
            <span aria-hidden>←</span>
          </button>
          <button type="button" className={button} onClick={() => go(1)} disabled={atEnd} aria-controls={id} aria-label="Next">
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
