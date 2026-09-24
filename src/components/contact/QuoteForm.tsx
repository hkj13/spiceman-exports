"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { mailtoLink, site, whatsappLink, type Phone } from "@/config/site";
import { productUnits, products } from "@/data/products";
import { quoteMessage, quoteSchema, quoteSubject, type Quote } from "@/lib/quote";
import { WhatsAppGlyph } from "@/components/brand/WhatsAppGlyph";

export type QuoteInitial = Partial<{
  products: string[];
  quantity: string;
  unit: string;
  port: string;
  packaging: string;
}>;

type Values = {
  name: string;
  company: string;
  country: string;
  products: string[];
  quantity: string;
  unit: string;
  port: string;
  packaging: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const FIELD_ORDER: (keyof Values)[] = ["name", "company", "country", "products", "quantity", "unit", "port", "message"];

/**
 * The quote request, laid out like a bill of lading. Nothing is sent to a
 * server: once the fields check out, the message opens in WhatsApp (either
 * number) or the visitor's email app, and can always be copied as text.
 * Without JavaScript the form posts to a mailto: address instead.
 */
export function QuoteForm({ initial = {} }: { initial?: QuoteInitial }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(() => ({
    name: "",
    company: "",
    country: "",
    products: (initial.products ?? []).filter((s) => products.some((p) => p.slug === s)),
    quantity: initial.quantity ?? "",
    unit: productUnits.includes(initial.unit as (typeof productUnits)[number]) ? (initial.unit as string) : "MT",
    port: initial.port ?? "",
    packaging: initial.packaging ?? "",
    message: "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState<{ quote: Quote; via: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const validate = (): Quote | null => {
    const parsed = quoteSchema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return parsed.data;
    }
    const next: Errors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof Values;
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    // Focus the first field with a problem.
    const first = FIELD_ORDER.find((k) => next[k]);
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
      el?.focus();
    }
    return null;
  };

  const send = (channel: "email" | Phone) => {
    const quote = validate();
    if (!quote) return;
    const text = quoteMessage(quote);
    if (channel === "email") {
      window.location.assign(mailtoLink(quoteSubject(quote), text));
      setReady({ quote, via: "your email app" });
    } else {
      window.open(whatsappLink(channel, text), "_blank", "noopener,noreferrer");
      setReady({ quote, via: `WhatsApp (${channel.display})` });
    }
  };

  const copy = async () => {
    if (!ready) return;
    try {
      await navigator.clipboard.writeText(quoteMessage(ready.quote));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const id = (k: string) => `${uid}-${k}`;
  const err = (k: keyof Values) =>
    errors[k] ? (
      <p id={id(`${k}-error`)} className="mt-2 text-sm text-chilli">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: keyof Values) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? id(`${k}-error`) : undefined,
    "data-field": k,
  });

  const input =
    "mt-1 w-full border-0 bg-transparent p-0 text-lg text-ink outline-none placeholder:text-brown/50 focus-visible:outline-none";

  return (
    <form
      ref={formRef}
      noValidate
      action={`mailto:${site.email}`}
      method="post"
      encType="text/plain"
      onSubmit={(e) => {
        e.preventDefault();
        send(site.phones[0]);
      }}
      className="keep-tone"
      aria-describedby={id("intro")}
    >
      <p id={id("intro")} className="sr-only">
        Fields marked required must be filled. Sending opens WhatsApp or your email app with the message ready.
      </p>

      <div className="grid grid-cols-1 border-l border-t border-ink/70 bg-[#fcf8f0] sm:grid-cols-6">
        <Cell n="01" label="Your name" htmlFor={id("name")} required className="sm:col-span-3">
          <input
            id={id("name")}
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className={input}
            {...a11y("name")}
          />
          {err("name")}
        </Cell>
        <Cell n="02" label="Company" htmlFor={id("company")} className="sm:col-span-3">
          <input
            id={id("company")}
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            className={input}
            {...a11y("company")}
          />
        </Cell>
        <Cell n="03" label="Country" htmlFor={id("country")} required className="sm:col-span-2">
          <input
            id={id("country")}
            name="country"
            autoComplete="country-name"
            required
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
            className={input}
            {...a11y("country")}
          />
          {err("country")}
        </Cell>
        <Cell n="04" label="Quantity" htmlFor={id("quantity")} required className="sm:col-span-2">
          <input
            id={id("quantity")}
            name="quantity"
            inputMode="decimal"
            required
            placeholder="e.g. 18"
            value={values.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            className={input}
            {...a11y("quantity")}
          />
          {err("quantity")}
        </Cell>
        <Cell n="05" label="Unit" htmlFor={id("unit")} className="sm:col-span-2">
          <select
            id={id("unit")}
            name="unit"
            value={values.unit}
            onChange={(e) => set("unit", e.target.value)}
            className={`${input} appearance-none`}
            {...a11y("unit")}
          >
            {productUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </Cell>

        <fieldset
          className="border-b border-r border-ink/70 px-4 pb-5 pt-3 sm:col-span-6"
          aria-describedby={errors.products ? id("products-error") : undefined}
        >
          <legend className="sr-only">Products (required)</legend>
          <p aria-hidden className="mono-label text-brown">
            06 · Product(s) <span className="text-chilli">*</span>
          </p>
          {(["spice", "pulse"] as const).map((cat, ci) => (
            <div key={cat} className="mt-3">
              <p className="mono-label mb-2 text-[0.65rem] text-brown/80">{cat === "spice" ? "Spices" : "Pulses"}</p>
              <div className="flex flex-wrap gap-2">
                {products
                  .filter((p) => p.category === cat)
                  .map((p, i) => {
                    const checked = values.products.includes(p.slug);
                    return (
                      <label
                        key={p.slug}
                        className="flex cursor-pointer items-center gap-2 rounded-full border border-rule bg-paper px-3 py-1.5 text-sm transition-colors has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-green"
                      >
                        <input
                          type="checkbox"
                          name="products"
                          value={p.slug}
                          checked={checked}
                          onChange={() =>
                            set(
                              "products",
                              checked ? values.products.filter((s) => s !== p.slug) : [...values.products, p.slug],
                            )
                          }
                          className="sr-only"
                          {...(ci === 0 && i === 0 ? { "data-field": "products" } : {})}
                        />
                        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: p.accent }} />
                        {p.name}
                      </label>
                    );
                  })}
              </div>
            </div>
          ))}
          {err("products")}
        </fieldset>

        <Cell n="07" label="Destination port" htmlFor={id("port")} className="sm:col-span-3">
          <input
            id={id("port")}
            name="port"
            placeholder="e.g. Jebel Ali, Rotterdam"
            value={values.port}
            onChange={(e) => set("port", e.target.value)}
            className={input}
            {...a11y("port")}
          />
        </Cell>
        <Cell n="08" label="Packing" htmlFor={id("packaging")} className="sm:col-span-3">
          <input
            id={id("packaging")}
            name="packaging"
            placeholder="e.g. 25 kg PP bags"
            value={values.packaging}
            onChange={(e) => set("packaging", e.target.value)}
            className={input}
            {...a11y("packaging")}
          />
        </Cell>
        <Cell n="09" label="Message: grades, specification, timing" htmlFor={id("message")} className="sm:col-span-6">
          <textarea
            id={id("message")}
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            className={`${input} resize-y`}
            {...a11y("message")}
          />
        </Cell>
      </div>

      <p className="mt-4 text-sm text-brown">
        <span className="text-chilli">*</span> Required. Nothing is stored on this site: your message opens in
        WhatsApp or your email app, ready to send.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {site.phones.map((p, i) => (
          <button
            key={p.e164}
            type={i === 0 ? "submit" : "button"}
            onClick={i === 0 ? undefined : () => send(p)}
            data-cursor="Send"
            className={`mono-label inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 transition-colors ${
              i === 0 ? "bg-green text-paper hover:bg-green-900" : "border border-green text-green hover:bg-green hover:text-paper"
            }`}
          >
            <WhatsAppGlyph />
            Send on WhatsApp · {p.display}
          </button>
        ))}
        <button
          type="button"
          onClick={() => send("email")}
          data-cursor="Send"
          className="mono-label inline-flex items-center gap-2.5 rounded-full border border-ink px-5 py-3.5 text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Send by email
        </button>
      </div>

      <div aria-live="polite">
        {ready && (
          <div className="mt-8 rounded-[3px] border border-rule bg-paper-2 p-5">
            <p className="font-medium">Your message has been opened in {ready.via}.</p>
            <p className="mt-1 text-sm text-brown">
              If nothing opened, copy the text below and send it to {site.email} or either number.
            </p>
            <pre className="mt-4 max-h-56 overflow-auto whitespace-pre-wrap font-mono text-[0.8rem] leading-relaxed">
              {quoteMessage(ready.quote)}
            </pre>
            <button type="button" onClick={copy} className="mono-label link-draw mt-4 text-green">
              {copied ? "Copied" : "Copy message"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

function Cell({
  n,
  label,
  htmlFor,
  required,
  className = "",
  children,
}: {
  n: string;
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`border-b border-r border-ink/70 px-4 pb-3 pt-3 transition-colors focus-within:bg-paper has-[[aria-invalid=true]]:bg-chilli/5 ${className}`}
    >
      <label htmlFor={htmlFor} className="mono-label block text-brown">
        {n} · {label} {required && <span className="text-chilli">*</span>}
      </label>
      {children}
    </div>
  );
}
