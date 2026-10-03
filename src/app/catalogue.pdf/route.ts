import { existsSync } from "node:fs";
import { join } from "node:path";
import { cataloguePdf } from "@/lib/specSheet";

export const dynamic = "force-static";

/** All products' spec sheets in one PDF, built at deploy time. */
export async function GET() {
  const photoFor = (slug: string) => {
    const f = join(process.cwd(), "src/assets/photos", `${slug}.jpg`);
    return existsSync(f) ? f : undefined;
  };
  const pdf = await cataloguePdf(photoFor);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="spiceman-exports-product-catalogue.pdf"',
    },
  });
}
