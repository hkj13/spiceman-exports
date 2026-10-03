import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoFrame } from "@/components/art/PhotoFrame";
import { ProductArt } from "@/components/art/ProductArt";
import { productPhoto } from "@/data/photos";
import { CatalogueDownload } from "@/components/products/CatalogueDownload";
import { ProductStage } from "@/components/products/ProductStage";
import { QuoteForProduct } from "@/components/products/QuoteForProduct";
import { Reveal } from "@/components/motion/Reveal";
import { categoryPlural, getProduct, products } from "@/data/products";

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
    [product.category === "spice" ? "Aroma" : "Character", product.aroma.join(", ")],
    ["Origin", product.origin.join("; ")],
    ["Forms", product.forms.join(", ")],
    ["Grades", product.grades.join(", ")],
    ["Packing", product.packaging.join("; ")],
    ["Minimum order", product.moq],
  ];
  if (product.hsCode) rows.push(["HS code", product.hsCode]);

  return (
    <article className="overflow-x-clip" style={{ "--accent": product.accent, "--accent-ink": product.ink } as React.CSSProperties}>
      <div className="enter wrap pt-[calc(var(--header-h)+3rem)]">
        <nav aria-label="Breadcrumb">
          {/* One line always, so the label font arriving can't reflow the page below */}
          <ol className="mono-label flex min-w-0 flex-nowrap gap-2 whitespace-nowrap text-brown">
            <li>
              <Link href="/products" className="link-draw">
                Products
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>{categoryPlural(product.category)}</li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="min-w-0 truncate text-ink">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Name bleeding off the left edge, silhouette beside it */}
      <header className="page-enter relative mt-6" data-rail="Overview">
        <h1
          className="font-display -ml-[0.06em] pl-[var(--margin)] pr-[var(--margin)] leading-[0.9] md:whitespace-nowrap md:pr-0 md:leading-[0.85] tracking-[-0.045em] text-[var(--accent-ink)] [font-variation-settings:'opsz'_144]"
          // Size to the name so long names still fit the width.
          style={{ fontSize: `clamp(2.75rem, ${Math.min(15, 160 / product.name.length).toFixed(2)}vw, 15rem)` }}
        >
          {product.name}
        </h1>
        <div className="wrap grid-12 mt-8 items-start gap-y-10">
          <div className="col-span-4 md:col-span-4 xl:col-span-5">
            <p className="font-display text-2xl italic text-brown [font-variation-settings:'opsz'_36]">
              {product.botanical}
            </p>
            <Reveal as="p" by="fade" className="body-l mt-4 max-w-[38ch]">
              {product.summary}
            </Reveal>
            {/* At a glance: the facts buyers look for first, plus the sheet itself */}
            <dl className="mt-8 grid max-w-[460px] grid-cols-2 gap-x-6 gap-y-4 border-t border-rule pt-6">
              {(
                [
                  ["Origin", product.origin[0]],
                  ["Forms", product.forms.slice(0, 3).join(", ")],
                  ["Packing", product.packaging[0]],
                  ["Minimum order", product.moq],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="mono-label text-[0.65rem] text-brown">{k}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={`/products/${product.slug}/spec-sheet.pdf`}
                download={`spiceman-exports-${product.slug}-spec-sheet.pdf`}
                data-cursor="Save"
                className="mono-label inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-3.5 text-paper transition-colors hover:bg-green"
              >
                <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 2v8m0 0 3.5-3.5M8 10 4.5 6.5M2.5 13.5h11" />
                </svg>
                Spec sheet (PDF)
              </a>
              <a href="#quote-title" className="mono-label link-draw text-green">
                Request a quote ↓
              </a>
            </div>
          </div>
          {/* The goods, photographed */}
          {photo && (
            <PhotoFrame
              photo={photo}
              priority
              sizes="(min-width: 1280px) 40vw, (min-width: 768px) 46vw, 92vw"
              className="col-span-4 aspect-[5/4] w-full md:col-span-4 md:col-start-5 xl:col-span-6 xl:col-start-7"
            />
          )}
        </div>
      </header>

      <div className="wrap grid-12 mt-20 gap-y-14" data-rail="Specification">
        <section aria-labelledby="spec-title" className="col-span-4 md:col-span-8 xl:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="spec-title" className="mono-label flex items-center gap-3 text-brown">
              <span aria-hidden className="inline-block h-px w-8 bg-brown" />
              Specification sheet
            </h2>
          </div>
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
          <div className="mt-6">
            <CatalogueDownload variant="link" />
          </div>
        </section>

        <aside aria-labelledby="quote-title" className="col-span-4 md:col-span-6 xl:col-span-4 xl:col-start-9">
          <div className="xl:sticky xl:top-28">
            <div className="flex items-end justify-between gap-4">
              <h2 id="quote-title" className="display-l">
                Quote this <em className="display-em text-[var(--accent-ink)]">{product.name.toLowerCase()}</em>.
              </h2>
              {/* the product's grains settle here */}
              <ProductStage
                slug={product.slug}
                silhouette={product.silhouette}
                accent={product.accent}
                className="aspect-square w-[clamp(84px,9vw,140px)] flex-none"
              >
                <ProductArt product={product} className="h-full w-full" />
              </ProductStage>
            </div>
            <div className="mt-8">
              <QuoteForProduct slug={product.slug} name={product.name} packaging={product.packaging} />
            </div>
          </div>
        </aside>
      </div>

      <nav aria-label="More products" data-rail="More products" className="wrap mt-28 flex items-stretch justify-between gap-6 border-t border-rule pt-8">
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
