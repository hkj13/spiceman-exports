import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PhotoFrame } from "@/components/art/PhotoFrame";
import { photos, type PhotoKey } from "@/data/photos";
import { Reveal } from "@/components/motion/Reveal";
import { Slot } from "@/components/placeholder/Slot";
import { ProcessArt } from "@/components/process/ProcessArt";
import { ProcessScroller } from "@/components/process/ProcessScroller";
import { site } from "@/config/site";
import { processStages } from "@/content/process";

export const metadata: Metadata = pageMeta({
  title: "Process and quality: from soil to shipment",
  description:
    "How spices, rice, pulses and onions move from the field to the port or airport: sourcing regions, harvest, drying, cleaning and grading, checking against your specification, packing, container loading and export documents.",
  path: "/process",
});

const STAGE_PHOTO: Record<string, PhotoKey> = {
  soil: "stage-soil",
  harvest: "stage-harvest",
  sun: "stage-sun",
  sort: "stage-sort",
  check: "black-pepper",
  pack: "stage-pack",
  container: "stage-container",
  port: "stage-port",
};

export default function ProcessPage() {
  return (
    <>
      <header className="page-enter wrap grid-12 gap-y-8 pb-20 pt-[calc(var(--header-h)+4rem)] md:pb-28">
        <div className="col-span-4 md:col-span-7 xl:col-span-8">
          <p className="mono-label flex items-center gap-3 text-brown">
            <span aria-hidden className="inline-block h-px w-8 bg-brown" />
            Process and quality
          </p>
          <Reveal as="h1" className="display-xl mt-6">
            From soil to shipment, in <em className="display-em">eight</em> stages.
          </Reveal>
        </div>
        <p className="body-l col-span-4 max-w-[42ch] self-end text-brown md:col-span-5 md:col-start-4 xl:col-span-4 xl:col-start-9">
          What happens to spices, rice, pulses and onions at each stage between the field and the port or airport, and what you can put
          in your specification along the way.
        </p>
      </header>

      <ProcessScroller
        stages={processStages.map((s) => ({
          id: s.id,
          n: s.n,
          label: s.label,
          scene: s.art,
          art: <ProcessArt kind={s.art} />,
        }))}
      >
        <ol>
          {processStages.map((s) => (
            <li key={s.id} id={s.id} data-rail={s.label} data-stage-article className="scroll-mt-28 border-t border-rule py-16 lg:min-h-[80svh] lg:py-24">
              <article aria-labelledby={`${s.id}-title`}>
                <p className="mono-label text-brown">
                  {s.n} · {s.label}
                </p>
                <Reveal as="h2" id={`${s.id}-title`} className="display-l mt-5">
                  {s.title}
                </Reveal>
                <div data-inline-anchor className="relative my-10 aspect-[4/3] w-full max-w-[440px] lg:hidden">
                  <ProcessArt kind={s.art} />
                </div>
                <div className="mt-8 grid max-w-[58ch] gap-8 lg:mt-10 lg:max-w-none lg:grid-cols-[minmax(0,58ch)_1fr] lg:items-start">
                  <div className="space-y-5 text-[1.0625rem]">
                    {s.body.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                  {s.id === "port" || s.id === "container" ? (
                    // These stages cover both ways out: sea and air
                    <div className="grid w-full max-w-[420px] grid-cols-2 gap-3 lg:grid-cols-1">
                      {(
                        [
                          [s.id === "container" ? "stage-container" : "stage-port", "By sea"],
                          [s.id === "container" ? "stage-air-cargo" : "stage-air", "By air"],
                        ] as const
                      ).map(([k, label]) => (
                        <figure key={k}>
                          <PhotoFrame photo={photos[k]} sizes="(min-width: 1024px) 18vw, 45vw" className="aspect-[4/3] w-full" />
                          <figcaption className="mono-label mt-2 text-brown">{label}</figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : (
                    <PhotoFrame
                      photo={photos[STAGE_PHOTO[s.id]]}
                      sizes="(min-width: 1024px) 18vw, 70vw"
                      className="aspect-[4/3] w-full max-w-[420px] lg:aspect-[4/5]"
                    />
                  )}
                </div>
                <div className="mt-10 max-w-[58ch] border-l-2 border-turmeric pl-5">
                  <p className="mono-label text-brown">You can specify</p>
                  <ul className="mt-3 space-y-1.5">
                    {s.specify.map((x) => (
                      <li key={x} className="flex gap-3">
                        <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 flex-none rounded-full bg-chilli" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                {s.id === "check" && (
                  <Slot
                    label="certifications and registrations"
                    source="site.certifications in src/config/site.ts"
                    items={site.certifications}
                  >
                    {(items) => (
                      <div className="mt-10">
                        <p className="mono-label text-brown">Registrations</p>
                        <ul className="mt-3 space-y-1.5">
                          {items.map((c) => (
                            <li key={c.name}>
                              {c.name}, {c.issuer}
                              {c.id ? ` (${c.id})` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Slot>
                )}
              </article>
            </li>
          ))}
        </ol>
      </ProcessScroller>

      <section aria-labelledby="process-cta" className="wrap grid-12 mt-24 gap-y-6">
        <h2 id="process-cta" className="display-l col-span-4 md:col-span-6 xl:col-span-7 xl:col-start-2">
          Have a specification ready? <em className="display-em text-green">Send it over.</em>
        </h2>
        <div className="col-span-4 self-end md:col-span-2 xl:col-span-3">
          <Link
            href="/contact"
            data-cursor="Quote"
            className="mono-label group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 text-paper transition-colors hover:bg-green"
          >
            Request a quote
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
