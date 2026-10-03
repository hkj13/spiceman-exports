import { products } from "@/data/products";

const icon = (
  <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 2v8m0 0 3.5-3.5M8 10 4.5 6.5M2.5 13.5h11" />
  </svg>
);

/** The all-products catalogue (every spec sheet in one PDF). */
export function CatalogueDownload({ variant = "band" }: { variant?: "band" | "link" | "dark-link" }) {
  if (variant !== "band") {
    return (
      <a
        href="/catalogue.pdf"
        download="spiceman-exports-product-catalogue.pdf"
        data-cursor="Save"
        className={`mono-label link-draw inline-flex items-center gap-2 ${variant === "dark-link" ? "text-turmeric" : "text-green"}`}
      >
        {icon}
        All {products.length} spec sheets (PDF)
      </a>
    );
  }
  return (
    <div className="wrap" data-rv>
      <div className="flex flex-col gap-5 rounded-[4px] bg-green-900 px-6 py-6 text-paper sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div>
          <p className="mono-label text-turmeric">Product catalogue</p>
          <p className="mt-2 font-display text-[clamp(1.35rem,2vw,1.9rem)] leading-tight [font-variation-settings:'opsz'_72]">
            Every spec sheet, <em className="display-em text-turmeric">one PDF</em>.
          </p>
          <p className="mt-1 text-sm text-paper/75">
            All {products.length} products: origin, forms, grades, packing and minimum order.
          </p>
        </div>
        <a
          href="/catalogue.pdf"
          download="spiceman-exports-product-catalogue.pdf"
          data-cursor="Save"
          className="mono-label inline-flex flex-none items-center gap-2.5 self-start rounded-full bg-turmeric px-5 py-3.5 text-ink transition-colors hover:bg-paper sm:self-auto"
        >
          {icon}
          Download the catalogue
        </a>
      </div>
    </div>
  );
}
