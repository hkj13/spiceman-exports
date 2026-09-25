import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoFrame } from "@/components/art/PhotoFrame";
import { ProductArt } from "@/components/art/ProductArt";
import { productPhoto } from "@/data/photos";
import { ProductStage } from "@/components/products/ProductStage";
import { QuoteForProduct } from "@/components/products/QuoteForProduct";
import { Reveal } from "@/components/motion/Reveal";
import { getProduct, products } from "@/data/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return pageMeta({
    title: `${p.name}: wholesale and export`,
    description: `${p.name} (${p.botanical}) from India. ${p.summary} Grades: ${p.grades.join(", ")}. Packing and MOQ on request.`,
    path: `/products/${p.slug}`,
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const i = products.indexOf(product);
  const photo = productPhoto(product.slug);
  const prev = products[(i - 1 + products.length) % products.length];
  const next = products[(i + 1) % products.length];

  const rows: [string, string][] = [
    ["Also known as", product.alsoKnownAs.join(", ")],
    ["Botanical name", product.botanical],
    ["Colour", product.colour],
    [product.category === "pulse" ? "Character" : "Aroma", product.aroma.join(", ")],
    ["Origin", product.origin.join("; ")],
    ["Forms", product.forms.join(", ")],
    ["Grades", product.grades.join(", ")],
    ["Packing", product.packaging.join("; ")],
    ["Minimum order", product.moq],
  ];
  if (product.hsCode) rows.push(["HS code", product.hsCode]);

  return (
    <article className="overflow-x-clip" style={{ "--accent": product.accent, "--accent-ink": product.ink } as React.CSSProperties}>
      <div className="wrap pt-[calc(var(--header-h)+3rem)]">
        <nav aria-label="Breadcrumb">
          {/* One line always, so the label font arriving can't reflow the page below */}
          <ol className="mono-label flex min-w-0 flex-nowrap gap-2 whitespace-nowrap text-brown">
            <li>
              <Link href="/products" className="link-draw">
                Products
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>{product.category === "spice" ? "Spices" : "Pulses"}</li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="min-w-0 truncate text-ink">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Name bleeding off the left edge, silhouette beside it */}
      <header className="relative mt-6">
        <h1
          className="font-display -ml-[0.06em] whitespace-nowrap pl-[var(--margin)] leading-[0.85] tracking-[-0.045em] text-[var(--accent-ink)] [font-variation-settings:'opsz'_144]"
          // Size to the name so long names still fit the width.
          style={{ fontSize: `clamp(2.75rem, ${Math.min(15, 160 / product.name.length).toFixed(2)}vw, 15rem)` }}
        >
          {product.name}
        </h1>
        <div className="wrap grid-12 mt-8 items-end gap-y-10">
          <div className="col-span-4 md:col-span-4 xl:col-span-5 xl:self-center">
            <p className="font-display text-2xl italic text-brown [font-variation-settings:'opsz'_36]">
              {product.botanical}
            </p>
            <Reveal as="p" by="fade" className="body-l mt-4 max-w-[38ch]">
              {product.summary}
            </Reveal>
          </div>
          {/* The goods photographed, with the drawn silhouette the particles form beside it */}
          <div className="relative col-span-4 aspect-[6/5] w-full md:col-span-4 md:col-start-5 xl:col-span-6 xl:col-start-7">
            {photo && (
              <PhotoFrame
                photo={photo}
                priority
                sizes="(min-width: 1280px) 34vw, (min-width: 768px) 38vw, 64vw"
                className="absolute right-0 top-0 h-full w-[58%]"
              />
            )}
            <ProductStage
              slug={product.slug}
              silhouette={product.silhouette}
              accent={product.accent}
              className="absolute bottom-0 left-0 aspect-square w-[36%]"
            >
              <ProductArt product={product} className="h-full w-full" />
            </ProductStage>
          </div>
        </div>
      </header>

      <div className="wrap grid-12 mt-20 gap-y-14">
        <section aria-labelledby="spec-title" className="col-span-4 md:col-span-8 xl:col-span-7">
          <h2 id="spec-title" className="mono-label flex items-center gap-3 text-brown">
            <span aria-hidden className="inline-block h-px w-8 bg-brown" />
            Specification sheet
          </h2>
          <dl className="mt-6 border-t border-ink">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 gap-1 border-b border-rule py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="mono-label pt-1 text-brown">{k}</dt>
                <dd className="text-[1.0625rem]">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-brown">
            Grades, packing and minimum order are confirmed at the time of quoting. Send your own specification
            if you buy to one.
          </p>
        </section>

        <aside aria-labelledby="quote-title" className="col-span-4 md:col-span-6 xl:col-span-4 xl:col-start-9">
          <div className="xl:sticky xl:top-28">
            <h2 id="quote-title" className="display-l">
              Quote this <em className="display-em text-[var(--accent-ink)]">{product.name.toLowerCase()}</em>.
            </h2>
            <div className="mt-8">
              <QuoteForProduct slug={product.slug} name={product.name} packaging={product.packaging} />
            </div>
          </div>
        </aside>
      </div>

      <nav aria-label="More products" className="wrap mt-28 flex items-stretch justify-between gap-6 border-t border-rule pt-8">
        <Link href={`/products/${prev.slug}`} className="group flex max-w-[45%] flex-col" data-cursor="Prev">
          <span className="mono-label text-brown">← Previous</span>
          <span className="h3 mt-2 transition-colors group-hover:text-[var(--hover)]" style={{ "--hover": prev.ink } as React.CSSProperties}>
            {prev.name}
          </span>
        </Link>
        <Link href={`/products/${next.slug}`} className="group flex max-w-[45%] flex-col items-end text-right" data-cursor="Next">
          <span className="mono-label text-brown">Next →</span>
          <span className="h3 mt-2 transition-colors group-hover:text-[var(--hover)]" style={{ "--hover": next.ink } as React.CSSProperties}>
            {next.name}
          </span>
        </Link>
      </nav>
    </article>
  );
}
