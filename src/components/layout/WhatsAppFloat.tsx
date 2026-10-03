"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { WhatsAppGlyph } from "@/components/brand/WhatsAppGlyph";
import { site, whatsappLink } from "@/config/site";

/**
 * A small WhatsApp disc in the corner. It opens to show both numbers, and
 * steps aside on the contact page, which has its own buttons.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [open]);

  // On small screens the button steps aside while a form field is being
  // typed in, and while the page is scrolling, so it never covers something
  // the visitor is about to tap.
  const [aside, setAside] = useState(false);
  useEffect(() => {
    let t = 0;
    let typing = false;
    const small = () => window.innerWidth < 1024;
    const update = (v: boolean) => setAside(v && small());
    const onScroll = () => {
      update(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => update(typing), 650);
    };
    const onFocus = (e: FocusEvent) => {
      typing = !!(e.target as Element | null)?.closest?.("input, select, textarea");
      update(typing);
    };
    const onBlur = () => {
      typing = false;
      update(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  if (pathname === "/contact") return null;

  return (
    <div
      ref={root}
      data-aside={aside && !open}
      style={{ "--d": 850 } as React.CSSProperties}
      className="enter-fade transition-[opacity,transform] duration-300 data-[aside=true]:pointer-events-none data-[aside=true]:translate-y-3 data-[aside=true]:opacity-0 fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex flex-col items-end gap-2 [view-transition-name:whatsapp]"
    >
      <div
        id={panelId}
        hidden={!open}
        className="w-64 rounded-[4px] bg-paper p-4 shadow-[0_18px_50px_-20px_rgb(42_24_16/0.45),0_0_0_1px_rgb(42_24_16/0.08)]"
      >
        <p className="mono-label text-brown">WhatsApp</p>
        <ul className="mt-3 space-y-2">
          {site.phones.map((p) => (
            <li key={p.e164}>
              <a
                href={whatsappLink(p, "Hello Spiceman Exports, I would like a quote.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-[3px] px-2 py-2 text-ink hover:bg-paper-2"
              >
                {p.display}
                <span aria-hidden className="text-green">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Chat on WhatsApp"
        onClick={() => setOpen((v) => !v)}
        data-cursor="Chat"
        className="grid h-11 w-11 place-items-center rounded-full md:h-12 md:w-12 bg-green text-paper shadow-[0_10px_30px_-10px_rgb(18_54_28/0.7),0_0_0_3px_rgb(251_247_238/0.9)] transition-transform duration-300 ease-(--ease-settle) hover:-translate-y-0.5"
      >
        <WhatsAppGlyph className="h-6 w-6" />
      </button>
    </div>
  );
}
