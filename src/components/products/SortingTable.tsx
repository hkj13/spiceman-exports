"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MaskedPhoto } from "@/components/art/MaskedPhoto";
import { ProductHeapArt } from "@/components/art/ProductArt";
import { productPhoto } from "@/data/photos";
import { SampleTag } from "@/components/art/SampleTag";
import { particlesLive, play } from "@/components/motion/bus";
import { heap } from "@/components/motion/particles/shapes";
import type { Category, Product } from "@/data/products";
import { accentPalette } from "@/lib/color";

type Filter = "all" | Category;
type View = "table" | "list";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "spice", label: "Spices" },
  { id: "pulse", label: "Pulses" },
];

const COLS = 5;
const ROW_H = 300;

/** Deterministic, slightly irregular placement: a grid that looks hand-set. */
function layout(items: Product[]) {
  return items.map((p, i) => {
    let h = 0;
    for (const c of p.slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const jx = ((h % 100) / 100 - 0.5) * 5; // ±2.5%
    const jy = (((h >> 7) % 100) / 100 - 0.5) * 36; // ±18px
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const inRow = Math.min(COLS, items.length - row * COLS);
    const offset = ((COLS - inRow) / COLS) * 50; // centre short rows
    return {
      x: offset + ((col + 0.5) / COLS) * 100 + jx,
      y: row * ROW_H + (col % 2 ? 56 : 0) + jy + 64,
      scale: 0.86 + ((h >> 3) % 30) / 100,
      right: col >= 3,
    };
  });
}

export function SortingTable({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("table");
  const [open, setOpen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(() => !particlesLive());
  const arts = useRef(new Map<string, HTMLElement>());

  const visible = useMemo(
    () => products.filter((p) => filter === "all" || p.category === filter),
    [products, filter],
  );
  const positions = useMemo(() => {
    const map = new Map<string, ReturnType<typeof layout>[number]>();
    layout(visible).forEach((pos, i) => map.set(visible[i].slug, pos));
    return map;
  }, [visible]);
  const home = useMemo(() => {
    const map = new Map<string, ReturnType<typeof layout>[number]>();
    layout(products).forEach((pos, i) => map.set(products[i].slug, pos));
    return map;
  }, [products]);
  const rows = Math.ceil(visible.length / COLS);

  // Pour the particles into the heaps, then hand off to the drawn heaps.
  const pour = useCallback(
    (items: Product[], key: string) => {
      if (view !== "table") return;
      play({
        id: `products-${key}`,
        parts: items.slice(0, 16).map((p) => ({
          anchor: arts.current.get(p.slug) ?? null,
          shape: heap(0.95, 1.4),
          colors: accentPalette(p.accent),
          size: 0.9,
        })),
        handoff: true,
        duration: 1300,
        scatter: 70,
        onSettled: () => setRevealed(true),
      });
    },
    [view],
  );

  useEffect(() => {
    // Wait a frame so heaps have moved to their new places before measuring.
    const id = requestAnimationFrame(() => pour(visible, `${filter}-${view}`));
    return () => cancelAnimationFrame(id);
  }, [pour, visible, filter, view]);

  const choose = (f: Filter) => {
    if (f === filter) return;
    if (particlesLive()) setRevealed(false);
    setOpen(null);
    setFilter(f);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      {/* Controls */}
      <div className="wrap flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter products" className="flex rounded-full bg-paper-2 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => choose(f.id)}
              className="mono-label rounded-full px-4 py-2.5 text-brown transition-colors duration-300 aria-pressed:bg-ink aria-pressed:text-paper hover:text-ink aria-pressed:hover:text-paper"
            >
              {f.label}
              <span className="ml-1.5">
                {f.id === "all" ? products.length : products.filter((p) => p.category === f.id).length}
              </span>
            </button>
          ))}
        </div>
        <div role="group" aria-label="Display" className="flex items-center gap-4">
          {(["table", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="mono-label text-brown underline-offset-4 aria-pressed:text-ink aria-pressed:underline"
            >
              {v === "table" ? "Sorting table" : "Spec list"}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {filter === "all" ? "products" : filter === "spice" ? "spices" : "pulses"}.
      </p>

      {view === "table" ? (
        <div className="wrap mt-10">
          <ul
            className="relative md:h-[var(--table-h)] md:rounded-[4px] md:bg-paper-2 md:shadow-[inset_0_0_0_1px_rgb(90_46_26/0.06)] md:transition-[height] md:duration-700 md:ease-(--ease-settle) md:[background-image:repeating-linear-gradient(90deg,rgb(90_46_26/0.035)_0_2px,transparent_2px_6px),repeating-linear-gradient(0deg,rgb(90_46_26/0.03)_0_2px,transparent_2px_7px)]"
            style={{ "--table-h": `${rows * ROW_H + 140}px` } as React.CSSProperties}
          >
            {products.map((p) => {
              const out = !positions.has(p.slug);
              // Items filtered out keep their last place while they slide away.
              const pos = positions.get(p.slug) ?? home.get(p.slug);
              const isOpen = open === p.slug;
              const tagId = `tag-${p.slug}`;
              return (
                <li
                  key={p.slug}
                  data-out={out}
                  data-open={isOpen}
                  className="group relative border-b border-rule data-[out=true]:hidden md:absolute md:left-[clamp(100px,var(--x),calc(100%-100px))] md:top-[var(--y)] md:w-[200px] md:-translate-x-1/2 md:border-0 md:transition-[left,top,opacity,transform] md:duration-700 md:ease-(--ease-settle) md:data-[out=true]:invisible md:data-[out=true]:block md:data-[out=true]:translate-x-[40vw] md:data-[out=true]:opacity-0 md:data-[open=true]:z-20 md:hover:z-20 md:focus-within:z-20"
                  style={{ "--x": `${pos?.x}%`, "--y": `${pos?.y}px`, "--s": pos?.scale } as React.CSSProperties}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={tagId}
                    onClick={() => setOpen(isOpen ? null : p.slug)}
                    data-cursor="Sample"
                    className="flex w-full items-center gap-4 py-4 text-left md:flex-col md:gap-2 md:py-0 md:text-center"
                  >
                    <span
                      ref={(el) => {
                        if (el) arts.current.set(p.slug, el);
                        else arts.current.delete(p.slug);
                      }}
                      className="block w-20 flex-none transition-[transform,opacity] duration-500 ease-(--ease-settle) group-hover:-translate-y-1.5 group-focus-within:-translate-y-1.5 md:w-[calc(190px*var(--s,1))]"
                      style={{ opacity: revealed ? 1 : 0 }}
                    >
                      <ProductHeapArt product={p} className="w-full" />
                    </span>
                    <span className="flex flex-1 flex-col md:items-center">
                      <span className="h3">{p.name}</span>
                      <span className="mono-label mt-1 text-[0.65rem] text-brown">
                        {p.category === "spice" ? "Spice" : "Pulse"} · {p.forms.slice(0, 2).join(", ")}
                      </span>
                    </span>
                    <span aria-hidden className="mono-label text-brown md:hidden">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {/* Sample tag: inline on phones, a hanging popover on the table */}
                  <div
                    id={tagId}
                    className={`pb-6 md:pointer-events-none md:absolute md:top-2 md:w-[300px] md:pb-0 md:opacity-0 md:transition-[opacity,transform] md:duration-300 md:ease-(--ease-settle) md:group-hover:pointer-events-auto md:group-hover:opacity-100 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100 md:group-data-[open=true]:pointer-events-auto md:group-data-[open=true]:opacity-100 ${
                      pos?.right ? "md:right-[calc(100%-10px)]" : "md:left-[calc(100%-10px)]"
                    } ${isOpen ? "block" : "hidden md:block"}`}
                  >
                    <SampleTag title={`${p.name} · ${p.botanical}`} swing={false} className="md:pt-12">
                      {productPhoto(p.slug) && (
                        <MaskedPhoto
                          photo={productPhoto(p.slug)!}
                          shape="circle"
                          decorative
                          sizes="72px"
                          className="absolute right-4 top-4 aspect-square w-14"
                        />
                      )}
                      <dl className="space-y-2 text-[0.8125rem]">
                        <div className="flex items-center gap-2">
                          <dt className="sr-only">Colour</dt>
                          <span aria-hidden className="h-3 w-3 flex-none rounded-full" style={{ background: p.accent }} />
                          <dd>{p.colour}</dd>
                        </div>
                        <TagRow k="Aroma" v={p.aroma.join(", ")} />
                        <TagRow k="Origin" v={p.origin.join("; ")} />
                        <TagRow k="Grades" v={p.grades.join(", ")} />
                        <TagRow k="Packing" v={p.packaging.slice(0, 3).join(", ")} />
                        <TagRow k="MOQ" v={p.moq} />
                      </dl>
                      <Link
                        href={`/products/${p.slug}`}
                        className="mono-label link-draw mt-5 inline-block text-green"
                        data-cursor="Open"
                      >
                        Full spec and quote →
                      </Link>
                    </SampleTag>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="wrap mt-10 overflow-x-auto" tabIndex={0} role="region" aria-label="Product specifications">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <caption className="sr-only">Product specifications</caption>
            <thead>
              <tr className="mono-label border-b border-ink text-brown">
                <th scope="col" className="py-3 pr-4 font-normal">Product</th>
                <th scope="col" className="py-3 pr-4 font-normal">Forms</th>
                <th scope="col" className="py-3 pr-4 font-normal">Grades</th>
                <th scope="col" className="py-3 pr-4 font-normal">Origin</th>
                <th scope="col" className="py-3 pr-4 font-normal">Packing</th>
                <th scope="col" className="py-3 font-normal">MOQ</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.slug} className="border-b border-rule align-top">
                  <th scope="row" className="py-4 pr-4 font-normal">
                    <Link href={`/products/${p.slug}`} className="flex items-center gap-2.5 font-display text-lg hover:text-green">
                      <span aria-hidden className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: p.accent }} />
                      {p.name}
                    </Link>
                  </th>
                  <td className="py-4 pr-4">{p.forms.join(", ")}</td>
                  <td className="py-4 pr-4 font-mono text-[0.8rem]">{p.grades.join(", ")}</td>
                  <td className="py-4 pr-4">{p.origin.join("; ")}</td>
                  <td className="py-4 pr-4">{p.packaging.slice(0, 3).join(", ")}</td>
                  <td className="py-4">{p.moq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TagRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-2">
      <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-brown">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
