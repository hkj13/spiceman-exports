import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { LazyPour } from "@/components/products/LazyPour";
import { CatalogueDownload } from "@/components/products/CatalogueDownload";
import { SortingTable } from "@/components/products/SortingTable";
import { Reveal } from "@/components/motion/Reveal";
import { products } from "@/data/products";

export const metadata: Metadata = pageMeta({
  title: "Products: spices, rice, pulses and onions",
  description:
    "Turmeric, Guntur red chilli, black pepper, green cardamom, coriander, cumin, fenugreek and mustard; basmati and Tanjore ponni rice; toor, masoor, urad and moong dal; small and big onions. Origins, grades, packing and MOQ for each.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <div data-rail="Sorting table">
      <header className="wrap grid-12 gap-y-8 pb-12 pt-[calc(var(--header-h)+4rem)] md:pb-16">
        <div className="col-span-4 md:col-span-6 xl:col-span-7">
          <p className="mono-label flex items-center gap-3 text-brown">
            <span aria-hidden className="inline-block h-px w-8 bg-brown" />
            Products
          </p>
          <Reveal as="h1" className="display-xl mt-6">
            The sorting <em className="display-em">table</em>.
          </Reveal>
        </div>
        <p className="body-l col-span-4 max-w-[40ch] self-end text-brown md:col-span-4 md:col-start-5 xl:col-span-4 xl:col-start-9">
          Spices, rice, pulses and onions. Hover or tap a heap to read its sample tag: colour, character,
          where it grows, grades, packing and minimum order.
        </p>
      </header>

      <div className="mb-10">
        <CatalogueDownload />
      </div>

      <SortingTable products={products} />
      </div>

      <section aria-labelledby="pour-title" data-rail="Pulses and rice" className="wrap grid-12 mt-32 gap-y-10">
        <div className="col-span-4 md:col-span-3 xl:col-span-4">
          <p className="mono-label text-brown">Pulses and rice</p>
          <h2 id="pour-title" className="display-l mt-4">
            Grain by grain, <em className="display-em">by the scoop</em>.
          </h2>
          <p className="mt-6 max-w-[36ch] text-brown">
            Toor, moong, white and black urad and masoor, and basmati and ponni rice. Press and hold on the tray to pour, or use
            the button. It won&apos;t fill a container, but it is a fair way to see the difference in size and
            colour.
          </p>
          <p className="mt-8 max-w-[36ch] text-brown">
            Looking for something that isn&apos;t listed?{" "}
            <Link href="/contact" className="link-draw text-green">
              Ask
            </Link>
            , and you will get a plain answer on whether it can be supplied.
          </p>
        </div>
        <div className="col-span-4 md:col-span-5 xl:col-span-7 xl:col-start-6">
          <LazyPour />
        </div>
      </section>
    </>
  );
}
