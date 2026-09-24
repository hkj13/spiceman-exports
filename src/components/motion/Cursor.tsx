"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], label, select, summary, [data-cursor]";
const TEXT_ENTRY = "input:not([type='checkbox']):not([type='radio']):not([type='submit']), textarea";

/**
 * A peppercorn that follows the pointer and opens into a ring over anything
 * clickable, with an optional label from `data-cursor`. Mouse only; the
 * native cursor comes back over text fields.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = dot.current;
    const lbl = label.current;
    if (!el || !lbl) return;
    document.documentElement.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;
    let visible = false;

    const loop = () => {
      cx += (x - cx) * 0.28;
      cy += (y - cy) * 0.28;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cx = x;
        cy = y;
        el.dataset.visible = "true";
      }
      const target = e.target as Element | null;
      const text = target?.closest(TEXT_ENTRY);
      const hit = text ? null : target?.closest(INTERACTIVE);
      el.dataset.state = text ? "text" : hit ? "hover" : "idle";
      const name = hit?.getAttribute("data-cursor") ?? "";
      if (lbl.textContent !== name) lbl.textContent = name;
      el.dataset.label = name ? "true" : "false";
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      visible = false;
      el.dataset.visible = "false";
    };
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={dot} aria-hidden className="cursor" data-visible="false" data-state="idle">
      <span className="cursor-ring" />
      <span className="cursor-dot" />
      <span ref={label} className="cursor-label mono-label" />
    </div>
  );
}
