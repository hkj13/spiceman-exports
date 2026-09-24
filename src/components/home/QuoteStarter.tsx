import { products, productUnits } from "@/data/products";

/**
 * Three questions that start a quote. A plain GET form to /contact, so it
 * works without JavaScript; the contact form picks the values up.
 */
export function QuoteStarter({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const field = `w-full appearance-none rounded-none border-0 border-b bg-transparent py-3 text-lg outline-none transition-colors ${
    dark
      ? "border-paper/35 text-paper placeholder:text-paper/45 focus:border-turmeric"
      : "border-ink/30 text-ink placeholder:text-brown/60 focus:border-green"
  }`;
  const label = `mono-label mb-1 block ${dark ? "text-turmeric" : "text-brown"}`;
  const option = dark ? "bg-green-900 text-paper" : "";

  return (
    <form action="/contact" method="get" className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="qs-product" className={label}>
          01 · Product
        </label>
        <select id="qs-product" name="product" defaultValue="" className={field}>
          <option value="" className={option}>
            Choose a product
          </option>
          <optgroup label="Spices" className={option}>
            {products
              .filter((p) => p.category === "spice")
              .map((p) => (
                <option key={p.slug} value={p.slug} className={option}>
                  {p.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Pulses" className={option}>
            {products
              .filter((p) => p.category === "pulse")
              .map((p) => (
                <option key={p.slug} value={p.slug} className={option}>
                  {p.name}
                </option>
              ))}
          </optgroup>
        </select>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div>
          <label htmlFor="qs-qty" className={label}>
            02 · Quantity
          </label>
          <input id="qs-qty" name="quantity" inputMode="decimal" placeholder="e.g. 18" className={field} />
        </div>
        <div>
          <label htmlFor="qs-unit" className={label}>
            Unit
          </label>
          <select id="qs-unit" name="unit" defaultValue="MT" className={field}>
            {productUnits.map((u) => (
              <option key={u} value={u} className={option}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="qs-port" className={label}>
          03 · Destination port
        </label>
        <input id="qs-port" name="port" placeholder="e.g. Jebel Ali" className={field} />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          data-cursor="Next"
          className={`mono-label group inline-flex items-center gap-3 rounded-full px-6 py-4 transition-colors ${
            dark ? "bg-turmeric text-ink hover:bg-paper" : "bg-ink text-paper hover:bg-green"
          }`}
        >
          Continue to the quote
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
