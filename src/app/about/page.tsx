import type { Metadata } from "next";
import Link from "next/link";
import { LeafStage } from "@/components/about/LeafStage";
import { Reveal } from "@/components/motion/Reveal";
import { Slot } from "@/components/placeholder/Slot";
import { site, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "About: Shanthi Krishnamurthy, Lawspet, Pondicherry",
  description:
    "Spiceman Exports is a proprietorship run by Shanthi Krishnamurthy from Lawspet, Pondicherry, trading spices and pulses wholesale and for export.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { proprietor, address } = site;
  const monogram = proprietor.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <>
      <header className="wrap grid-12 gap-y-8 pb-16 pt-[calc(var(--header-h)+4rem)]">
        <div className="col-span-4 md:col-span-7 xl:col-span-8">
          <p className="mono-label flex items-center gap-3 text-brown">
            <span aria-hidden className="inline-block h-px w-8 bg-brown" />
            About
          </p>
          <Reveal as="h1" className="display-xl mt-6">
            Spices and pulses, traded from <em className="display-em">Pondicherry</em>.
          </Reveal>
        </div>
      </header>

      {/* Proprietor */}
      <section aria-labelledby="proprietor" className="wrap grid-12 items-center gap-y-12 py-12 md:py-20">
        <div className="col-span-3 md:col-span-3 xl:col-span-4 xl:col-start-2">
          <LeafStage monogram={monogram} />
        </div>
        <div className="col-span-4 md:col-span-5 md:col-start-4 xl:col-span-5 xl:col-start-7">
          <p className="mono-label text-brown">{proprietor.role}</p>
          <h2 id="proprietor" className="display-l mt-4">
            {proprietor.name}
          </h2>
          <div className="body-l mt-8 max-w-[44ch] space-y-5 text-ink">
            <p>
              Spiceman Exports is a proprietorship run by {proprietor.name}. The business buys and sells spices and
              pulses in wholesale quantities and prepares them for export.
            </p>
            <p>
              Inquiries go straight to the proprietor, by phone, WhatsApp or email. Say what you buy, the
              specification you buy to and where it needs to go, and you will get a straight answer on what can be
              supplied.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            <a
              href={whatsappLink(site.phones[0])}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label link-draw text-green"
            >
              WhatsApp {site.phones[0].display} ↗
            </a>
            <a href={`mailto:${site.email}`} className="mono-label link-draw text-green">
              {site.email}
            </a>
          </div>
        </div>
      </section>

      {/* Tagline as a typographic moment */}
      <section aria-label="Tagline" className="wrap py-24 md:py-36">
        <p className="display-xxl max-w-[12ch] md:ml-[12%]">
          Pure spices<span className="text-turmeric">.</span>
          <br />
          <em className="display-em text-green">Better tomorrow.</em>
        </p>
      </section>

      {/* Pondicherry */}
      <section aria-labelledby="base" className="wrap grid-12 items-end gap-y-12 py-12 md:py-20">
        <div className="col-span-4 md:col-span-4 xl:col-span-5 xl:col-start-2">
          <p className="mono-label text-brown">The base</p>
          <h2 id="base" className="display-l mt-4">
            Lawspet, on the north-west side of Pondicherry.
          </h2>
          <div className="mt-8 max-w-[46ch] space-y-5 text-[1.0625rem]">
            <p>
              The office is at {address.lines.join(", ")}, {address.locality} {address.postalCode}. Pondicherry sits
              on the Coromandel Coast of south India, about 150 km south of Chennai.
            </p>
            <p>If you would like to visit, call ahead first.</p>
          </div>
          <Link href="/contact" className="mono-label link-draw mt-8 inline-block text-green">
            Address, map and phone numbers →
          </Link>
        </div>

        {/* A stylised stretch of the coast: Chennai to Pondicherry */}
        <figure className="col-span-4 md:col-span-3 md:col-start-6 xl:col-span-4 xl:col-start-8">
          <svg viewBox="0 0 240 320" className="w-full" role="img" aria-labelledby="coast-title">
            <title id="coast-title">Pondicherry lies on the Coromandel Coast, about 150 km south of Chennai</title>
            <rect x="150" y="0" width="90" height="320" fill="#1D6A2C" opacity=".06" />
            <path
              d="M150 0c-8 30 6 52-2 84s-18 44-10 78 16 52 4 88-10 46-4 70"
              fill="none"
              stroke="#5A2E1A"
              strokeWidth="1.5"
            />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <path
                key={i}
                d={`M${172 + (i % 2) * 18} ${24 + i * 38}q6 -4 12 0t12 0`}
                fill="none"
                stroke="#1D6A2C"
                strokeWidth="1"
                opacity=".35"
              />
            ))}
            <circle cx="144" cy="44" r="4" fill="#5A2E1A" />
            <text x="130" y="48" textAnchor="end" className="font-mono" fontSize="10" fill="#5A2E1A" letterSpacing="1">
              CHENNAI
            </text>
            <path d="M144 52v196" stroke="#5A2E1A" strokeWidth="1" strokeDasharray="2 5" />
            <text x="132" y="152" textAnchor="end" className="font-mono" fontSize="10" fill="#5A2E1A">
              ~150 km
            </text>
            <circle cx="140" cy="256" r="7" fill="#BF201B" />
            <circle cx="140" cy="256" r="13" fill="none" stroke="#BF201B" strokeWidth="1" opacity=".4" />
            <text x="124" y="260" textAnchor="end" className="font-mono" fontSize="10" fill="#2A1810" letterSpacing="1">
              PONDICHERRY
            </text>
            <text x="200" y="300" textAnchor="middle" className="font-display" fontSize="11" fontStyle="italic" fill="#1D6A2C">
              Bay of Bengal
            </text>
          </svg>
        </figure>
      </section>

      <div className="wrap">
        <Slot label="testimonials" source="site.testimonials in src/config/site.ts" items={site.testimonials}>
          {(items) => (
            <section aria-label="What buyers say" className="grid gap-10 py-16 md:grid-cols-2">
              {items.map((t) => (
                <figure key={t.quote}>
                  <blockquote className="h3">“{t.quote}”</blockquote>
                  <figcaption className="mono-label mt-4 text-brown">
                    {t.name}, {t.company}, {t.country}
                  </figcaption>
                </figure>
              ))}
            </section>
          )}
        </Slot>
        <Slot label="clients" source="site.clients in src/config/site.ts" items={site.clients}>
          {(items) => (
            <section aria-label="Buyers" className="py-12">
              <ul className="flex flex-wrap gap-x-10 gap-y-4">
                {items.map((c) => (
                  <li key={c.name} className="mono-label text-brown">
                    {c.name} · {c.country}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Slot>
      </div>
    </>
  );
}
