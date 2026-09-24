"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { site, whatsappLink } from "@/config/site";

/** Packing choice plus the two ways to ask for a quote, both carrying the product. */
export function QuoteForProduct({ slug, name, packaging }: { slug: string; name: string; packaging: string[] }) {
  const [pack, setPack] = useState(packaging[0]);
  const group = useId();
  const params = new URLSearchParams({ product: slug, packaging: pack });
  const message = `Hello Spiceman Exports, I would like a quote for ${name} (packing: ${pack}).`;

  return (
    <div>
      <fieldset>
        <legend className="mono-label text-brown">Packing</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {packaging.map((p) => (
            <label
              key={p}
              className="mono-label flex cursor-pointer items-center rounded-full border border-rule px-3.5 py-2 text-[0.7rem] normal-case tracking-normal text-brown transition-colors has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-green"
            >
              <input
                type="radio"
                name={group}
                value={p}
                checked={pack === p}
                onChange={() => setPack(p)}
                className="sr-only"
              />
              {p}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Link
          href={`/contact?${params.toString()}`}
          data-cursor="Quote"
          className="mono-label group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 text-paper transition-colors hover:bg-green"
        >
          Request a quote for {name}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
        <a
          href={whatsappLink(site.phones[0], message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mono-label link-draw text-green"
        >
          Ask on WhatsApp ↗
        </a>
      </div>
    </div>
  );
}
