"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { nav, site } from "@/config/site";
import { LogoMark } from "@/components/brand/LogoMark";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the sheet on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 [view-transition-name:site-header]"
      style={{ height: "var(--header-h)" }}
    >
      <div className="wrap flex h-full items-center justify-between gap-6">
        <Link
          href="/"
          className="group relative z-10 -ml-3 flex items-center gap-2.5 rounded-full bg-paper/80 py-1.5 pl-2 pr-4 backdrop-blur-md night:bg-green-900/70"
        >
          <LogoMark className="h-8 w-8 transition-transform duration-500 ease-(--ease-settle) group-hover:-rotate-6" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.2rem] font-semibold tracking-[-0.01em] [font-variation-settings:'opsz'_48]">
              Spiceman
            </span>
            <span className="mono-label mt-0.5 text-[0.6rem] text-brown night:text-turmeric">
              <span className="sr-only"> </span>Exports
            </span>
          </span>
          <span className="sr-only">, home</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full bg-paper/80 px-2 py-1.5 backdrop-blur-md night:bg-green-900/70">
            {nav.map((item) => {
              const active = isActive(item.href);
              const cta = item.href === "/contact";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "mono-label relative flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors duration-300",
                      cta
                        ? "bg-green text-paper hover:bg-green-900"
                        : active
                          ? "text-ink night:text-paper"
                          : "text-brown hover:text-ink night:text-paper/75 night:hover:text-paper",
                    ].join(" ")}
                  >
                    {active && !cta && (
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-chilli" />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="mono-label relative z-10 flex items-center gap-2 rounded-full bg-paper/85 px-4 py-2.5 text-ink backdrop-blur-md md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden className="relative block h-2.5 w-4">
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1 rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1 -rotate-45" : "top-2"}`}
            />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        id={menuId}
        hidden={!open}
        className="fixed inset-0 bg-paper px-[var(--margin)] pt-[calc(var(--header-h)+2rem)] md:hidden"
      >
        <nav aria-label="Mobile">
          <ol className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-rule">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-4"
                >
                  <span className="mono-label text-brown">{item.stage}</span>
                  <span className="display-l">{item.label}</span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mono-label mt-10 text-brown">
            {site.phones[0].display}
            <br />
            {site.email}
          </p>
        </nav>
      </div>
    </header>
  );
}
