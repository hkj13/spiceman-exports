"use client";

import { useSearchParams } from "next/navigation";
import { QuoteForm } from "./QuoteForm";

/** Reads ?product=&quantity=&unit=&port=&packaging= left by the product pages and the home page. */
export function PrefilledQuoteForm() {
  const params = useSearchParams();
  const product = params.getAll("product").filter(Boolean);
  return (
    <QuoteForm
      initial={{
        products: product,
        quantity: params.get("quantity") ?? undefined,
        unit: params.get("unit") ?? undefined,
        port: params.get("port") ?? undefined,
        packaging: params.get("packaging") ?? undefined,
      }}
    />
  );
}
