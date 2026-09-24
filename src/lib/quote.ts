import { z } from "zod";
import { productUnits, products } from "@/data/products";

const slugs = products.map((p) => p.slug) as [string, ...string[]];

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  company: z.string().trim().max(120).optional().default(""),
  country: z.string().trim().min(2, "Which country are you buying for?"),
  products: z.array(z.enum(slugs)).min(1, "Choose at least one product."),
  quantity: z
    .string()
    .trim()
    .min(1, "Roughly how much do you need?")
    .regex(/^\d+([.,]\d+)?$/, "Enter a number, e.g. 18 or 2.5."),
  unit: z.enum(productUnits),
  port: z.string().trim().max(120).optional().default(""),
  packaging: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
});

export type QuoteInput = z.input<typeof quoteSchema>;
export type Quote = z.output<typeof quoteSchema>;

/** The inquiry as plain text, ready for WhatsApp or an email body. */
export function quoteMessage(q: Quote) {
  const names = q.products.map((s) => products.find((p) => p.slug === s)?.name ?? s).join(", ");
  const lines = ["Hello Spiceman Exports,", "", "I would like a quote for:", `Product(s): ${names}`];
  lines.push(`Quantity: ${q.quantity} ${q.unit}`);
  if (q.packaging) lines.push(`Packing: ${q.packaging}`);
  if (q.port) lines.push(`Destination port: ${q.port}`);
  if (q.message) lines.push("", q.message);
  lines.push("", `Name: ${q.name}`);
  if (q.company) lines.push(`Company: ${q.company}`);
  lines.push(`Country: ${q.country}`);
  return lines.join("\n");
}

export const quoteSubject = (q: Quote) => {
  const first = products.find((p) => p.slug === q.products[0])?.name ?? "spices";
  const more = q.products.length > 1 ? ` and ${q.products.length - 1} more` : "";
  return `Quote request: ${first}${more}, ${q.quantity} ${q.unit}`;
};
