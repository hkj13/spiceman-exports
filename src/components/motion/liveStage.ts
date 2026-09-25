"use client";

/**
 * Which section the particles are currently drawing. Its static still
 * (`.stage-art`) hides only once the particles have settled into it, and
 * reappears the moment they leave for another section, so a drawn shape is
 * never left blank on screen.
 */
let current: HTMLElement | null = null;

/** Mark `el` as the particles' destination; call the returned function when they settle. */
export function claimStage(el: HTMLElement) {
  if (current && current !== el) current.dataset.live = "false";
  current = el;
  el.dataset.live = "pending";
  return () => {
    if (current === el) el.dataset.live = "true";
  };
}

/** Release every section (e.g. when a page with its own handoff takes over). */
export function releaseStage() {
  if (current) current.dataset.live = "false";
  current = null;
}
