import type { Metadata } from "next";
import Image from "next/image";
import { photos, type Photo } from "@/data/photos";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Photo credits",
    description: "Credits and licences for the photographs used on the Spiceman Exports website.",
    path: "/credits",
  }),
  robots: { index: false, follow: true },
};

export default function CreditsPage() {
  const list = Object.entries(photos) as [string, Photo][];
  return (
    <div className="wrap pb-10 pt-[calc(var(--header-h)+4rem)]">
      <p className="mono-label flex items-center gap-3 text-brown">
        <span aria-hidden className="inline-block h-px w-8 bg-brown" />
        Credits
      </p>
      <h1 className="display-l mt-6">Photo credits</h1>
      <p className="body-l mt-6 max-w-[56ch] text-brown">
        Photographs on this site are openly licensed and used with thanks to their authors. They illustrate the goods
        and the trade in general; they are not photographs of Spiceman Exports&apos; own stock or premises. Each has
        been resized, cropped and lightly colour-graded.
      </p>
      <ul className="mt-12 grid gap-x-10 gap-y-6 md:grid-cols-2">
        {list.map(([key, p]) => (
          <li key={key} className="flex gap-4 border-t border-rule pt-5">
            <span className="relative h-16 w-16 flex-none overflow-hidden rounded-[4px] bg-paper-2">
              <Image src={p.src} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-medium">{p.alt}</p>
              <p className="mt-1 text-brown">
                <a href={p.credit.source} className="link-draw break-words" target="_blank" rel="noopener noreferrer">
                  {p.credit.title.length > 80 ? `${p.credit.title.slice(0, 77)}…` : p.credit.title}
                </a>{" "}
                by {p.credit.author},{" "}
                {p.credit.license_url ? (
                  <a href={p.credit.license_url} className="link-draw" target="_blank" rel="noopener noreferrer license">
                    {p.credit.license}
                  </a>
                ) : (
                  p.credit.license
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
