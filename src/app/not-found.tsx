import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const WAYS = [
  { href: "/products", label: "Products", note: `All ${products.length}, each with a spec sheet` },
  { href: "/journey", label: "Journey", note: "From soil to shipment" },
  { href: "/contact", label: "Get a quote", note: "By WhatsApp or email" },
];

export default function NotFound() {
  return (
    <div className="page-enter wrap grid-12 gap-y-10 pb-10 pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+6rem)]">
      <div className="col-span-4 md:col-span-6 xl:col-span-7">
        <p className="mono-label flex items-center gap-3 text-brown">
          <span aria-hidden className="inline-block h-px w-8 bg-brown" />
          404
        </p>
        <h1 className="display-xl mt-6">
          This page is off the <em className="display-em">route</em>.
        </h1>
        <p className="body-l mt-6 max-w-[42ch] text-brown">
          The link may be old or mistyped. Start again from the home page, or go straight to one of these.
        </p>
        <Link
          href="/"
          data-cursor="Home"
          className="mono-label group mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 text-paper transition-colors hover:bg-green"
        >
          Back to the home page
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
      <ul className="col-span-4 self-end md:col-span-6 xl:col-span-4 xl:col-start-9">
        {WAYS.map((w) => (
          <li key={w.href} className="border-t border-rule last:border-b">
            <Link href={w.href} className="group flex items-baseline justify-between gap-4 py-5">
              <span>
                <span className="h3 block">{w.label}</span>
                <span className="mono-label mt-1 block text-[0.65rem] text-brown">{w.note}</span>
              </span>
              <span aria-hidden className="mono-label transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
