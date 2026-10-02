import { existsSync } from "node:fs";
import { join } from "node:path";
import { getProduct, products } from "@/data/products";
import { specSheetPdf } from "@/lib/specSheet";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** A one-page A4 specification sheet for each product, built at deploy time. */
export async function GET(_req: Request, { params }: RouteContext<"/products/[slug]/spec-sheet.pdf">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return new Response("Not found", { status: 404 });
  const photo = join(process.cwd(), "src/assets/photos", `${slug}.jpg`);
  const pdf = await specSheetPdf(product, existsSync(photo) ? photo : undefined);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="spiceman-exports-${slug}-spec-sheet.pdf"`,
    },
  });
}
