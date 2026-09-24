import type { Metadata } from "next";
import { Suspense } from "react";
import { WhatsAppGlyph } from "@/components/brand/WhatsAppGlyph";
import { MapFacade } from "@/components/contact/MapFacade";
import { PrefilledQuoteForm } from "@/components/contact/PrefilledQuoteForm";
import { QuoteForm } from "@/components/contact/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import { site, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Get a quote",
  description:
    "Request a quote for spices and pulses from Spiceman Exports, Pondicherry. WhatsApp +91 98945 21812 or +91 87782 62010, or email spicemanexports@gmail.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <header className="wrap grid-12 gap-y-8 pb-14 pt-[calc(var(--header-h)+4rem)]">
        <div className="col-span-4 md:col-span-7 xl:col-span-8">
          <p className="mono-label flex items-center gap-3 text-brown">
            <span aria-hidden className="inline-block h-px w-8 bg-brown" />
            08 · Port
          </p>
          <Reveal as="h1" className="display-xl mt-6">
            Get a <em className="display-em">quote</em>.
          </Reveal>
        </div>
        <p className="body-l col-span-4 max-w-[40ch] self-end text-brown md:col-span-5 md:col-start-4 xl:col-span-4 xl:col-start-9">
          Fill in what you know. The more specific the product, quantity and port, the more useful the first reply.
        </p>
      </header>

      <div className="wrap grid-12 gap-y-20">
        <section aria-labelledby="form-title" className="col-span-4 md:col-span-8 xl:col-span-7">
          <h2 id="form-title" className="sr-only">
            Quote request
          </h2>
          <Suspense fallback={<QuoteForm />}>
            <PrefilledQuoteForm />
          </Suspense>
        </section>

        <aside aria-labelledby="direct-title" className="col-span-4 md:col-span-6 xl:col-span-4 xl:col-start-9">
          <h2 id="direct-title" className="h3">
            Or talk directly
          </h2>
          <ul className="mt-6 space-y-3">
            {site.phones.map((p) => (
              <li key={p.e164} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={whatsappLink(p, "Hello Spiceman Exports, I would like a quote.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Chat"
                  className="inline-flex items-center gap-2.5 rounded-full bg-green px-4 py-3 text-paper transition-colors hover:bg-green-900"
                >
                  <WhatsAppGlyph className="h-5 w-5" />
                  <span className="text-lg">{p.display}</span>
                </a>
                <a href={`tel:+${p.e164}`} className="mono-label link-draw text-brown">
                  Call
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <a href={`mailto:${site.email}`} className="link-draw break-all text-lg">
              {site.email}
            </a>
          </p>

          <address className="mt-10 not-italic">
            <p className="mono-label text-brown">Address</p>
            <p className="mt-3 leading-relaxed">
              {site.name}
              <br />
              {site.address.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              {site.address.locality} {site.address.postalCode}, {site.address.country}
            </p>
          </address>

          <div className="mt-10">
            <MapFacade />
          </div>
        </aside>
      </div>
    </>
  );
}
