import type { Metadata } from "next";
import { site } from "@/config/site";

/** Title, description, canonical and matching Open Graph / Twitter tags for a page. */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const ogTitle = title ? `${title} · ${site.name}` : `${site.name}: ${site.tagline}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { title: ogTitle, description, url: path, siteName: site.name, locale: site.locale, type: "website" },
    twitter: { card: "summary_large_image", title: ogTitle, description },
  };
}
