import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: "", priority: 1 },
    { path: "/journey", priority: 0.8 },
    { path: "/products", priority: 0.9 },
    { path: "/process", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
  ];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p.path}`, lastModified: now, changeFrequency: "monthly" as const, priority: p.priority })),
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
