import { getProduct, products } from "@/data/products";
import { ogSize, renderOg } from "@/og/render";

export const alt = "Product from Spiceman Exports";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  return renderOg({
    eyebrow: `${p?.category === "pulse" ? "Pulses" : "Spices"} · Wholesale and export`,
    title: p?.name ?? "Spices and pulses",
    accent: p?.botanical,
    color: p?.ink ?? "#1D6A2C",
  });
}
