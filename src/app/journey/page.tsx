import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { StageArt } from "@/components/art/StageArt";
import { SampleTag } from "@/components/art/SampleTag";
import { PhotoFrame } from "@/components/art/PhotoFrame";
import { ChapterLabel } from "@/components/home/ChapterLabel";
import { HorizontalChapters } from "@/components/home/HorizontalChapters";
import { QuoteStarter } from "@/components/home/QuoteStarter";
import { SceneSection } from "@/components/home/SceneSection";
import { PALETTE } from "@/components/home/palette";
import { Reveal } from "@/components/motion/Reveal";
import { Slot } from "@/components/placeholder/Slot";
import { site, whatsappLink } from "@/config/site";
import { photos } from "@/data/photos";
import { products } from "@/data/products";
import { stages } from "@/config/site";

export const metadata: Metadata = pageMeta({
  title: "The journey: from soil to ship",
  description:
    "Follow a spice from the field to the port: soil, harvest, sun-drying, sorting, checking against your specification, packing, container and shipment.",
  path: "/journey",
});

const SPEC_PARAMETERS = [
  ["Moisture", "% max"],
  ["Extraneous matter", "% max"],
  ["Grade or size", "e.g. 550 g/l, 8 mm"],
  ["Colour value", "ASTA, for chilli"],
  ["Curcumin", "%, for turmeric"],
  ["Volatile oil", "ml/100 g"],
  ["Packing and marking", "bag, weight, label"],
] as const;

export default function JourneyPage() {
  return (
    <div className="journey-flow">
      {/* Opening: title, the eight stops, and two scenes from the road */}
      <SceneSection
        flow
        scene="rail"
        stage={0}
        labelledBy="journey-title"
        className="wrap grid-12 relative items-end gap-y-12 pb-20 pt-[calc(var(--header-h)+4rem)] md:pb-28"
      >
        <div className="col-span-4 md:col-span-5 xl:col-span-7">
          <ChapterLabel label="The journey" />
          <h1 id="journey-title" className="display-xxl mt-6">
            From <em className="display-em text-green">soil</em> to ship.
          </h1>
          <p className="body-l mt-8 max-w-[40ch] text-brown">
            Eight stops between a field in India and a port abroad. Scroll to follow a spice along the way.
          </p>
          <nav aria-label="Stops on the journey" className="mt-10">
            {/* A fixed grid on phones: its height can't change when the label font arrives */}
            <ol className="grid grid-cols-2 gap-x-5 gap-y-2 md:flex md:flex-wrap">
              {stages.map((st) => (
                <li key={st.id}>
                  <a href={`#${st.id}`} className="mono-label link-draw text-brown hover:text-ink">
                    <span className="text-chilli">{st.n}</span> {st.label}
                  </a>
                </li>
              ))}
            </ol>
            <div data-scene-anchor aria-hidden className="mt-6 h-3 w-full max-w-[640px]" />
          </nav>
        </div>
        {/* Photos are for larger screens; on phones the journey is text and particles */}
        <div className="hidden md:col-span-3 md:block xl:col-span-5">
          <PhotoFrame
            photo={photos["stage-harvest"]}
            priority
            sizes="(min-width: 1280px) 38vw, (min-width: 768px) 36vw, 92vw"
            className="hidden md:block aspect-[4/3] w-full md:aspect-[4/5]"
          />
          <p className="mono-label mt-3 text-[0.65rem] text-brown">Pepper spikes on the vine</p>
        </div>
      </SceneSection>

      {/* 01 Soil */}
      <SceneSection
        flow
        scene="soil"
        stage={0}
        id="soil"
        labelledBy="soil-title"
        className="wrap grid-12 relative scroll-mt-24 items-center gap-y-10 py-[clamp(6rem,16vh,12rem)]"
      >
        <div
          data-scene-anchor
          className="relative col-span-4 aspect-[4/3] md:col-span-5 xl:col-span-6 xl:-ml-[4vw]"
        >
          <StageArt kind="furrows" colors={PALETTE.soil} count={260} />
        </div>
        <div className="col-span-4 md:col-span-3 xl:col-span-5 xl:col-start-8">
          <ChapterLabel n="01" label="Soil" />
          <Reveal as="h2" id="soil-title" className="display-xl mt-6">
            It starts in the <em className="display-em">ground</em>.
          </Reveal>
          <Reveal as="p" by="fade" className="body-l mt-8 max-w-[46ch] text-brown">
            Pepper vines on the wet slopes of Wayanad and Kodagu. Turmeric in the red soils around Erode.
            Cumin in the dry fields of north Gujarat. Each crop has a region it grows best in and a season
            when it is ready.
          </Reveal>
          <Reveal as="p" by="fade" delay={0.1} className="mt-5 max-w-[46ch] text-brown">
            Where a spice comes from is the first thing worth asking about, so every product page lists the
            regions it is sourced from.
          </Reveal>
          <PhotoFrame
            photo={photos["stage-soil"]}
            sizes="(min-width: 1280px) 22vw, 60vw"
            className="hidden md:block mt-12 aspect-[4/5] w-[min(62%,320px)] md:ml-[18%]"
          />
        </div>
      </SceneSection>

      {/* 02–04 Harvest, Sun, Sort */}
      <HorizontalChapters labelledBy="harvest-title">
        {[
          {
            scene: "harvest",
            stage: 1,
            n: "02",
            label: "Harvest",
            id: "harvest-title",
            title: (
              <>
                Picked when it is <em className="display-em">ready</em>.
              </>
            ),
            body: "Pepper spikes are picked as the first berries on them turn red. Chillies are left on the plant to colour. Turmeric is lifted once its leaves dry back, eight or nine months after planting.",
            art: <StageArt kind="strands" colors={PALETTE.vine} count={220} w={400} h={420} />,
            photo: photos["stage-harvest"],
            aspect: "aspect-[40/42]",
          },
          {
            scene: "sun",
            stage: 2,
            n: "03",
            label: "Sun",
            id: "sun-title",
            title: (
              <>
                Green turns <em className="display-em">black</em> in the sun.
              </>
            ),
            body: "Spread thin on drying yards, green pepper darkens and wrinkles over several days as the skin oxidises. Drying brings moisture down far enough for the crop to keep through a sea voyage.",
            art: <StageArt kind="bed" colors={PALETTE.dried} count={240} w={480} h={300} />,
            photo: photos["stage-sun"],
            aspect: "aspect-[48/30]",
          },
          {
            scene: "sort",
            stage: 3,
            n: "04",
            label: "Sort",
            id: "sort-title",
            title: (
              <>
                Sieved, cleaned, <em className="display-em">graded</em>.
              </>
            ),
            body: "Stones, stalks and light berries come out. Seed spices are machine-cleaned or run through a sortex. Pepper is graded by density in grams per litre, cardamom by pod size in millimetres.",
            art: <StageArt kind="sieve" colors={PALETTE.dried} count={220} w={400} h={320} />,
            photo: photos["stage-sort"],
            aspect: "aspect-[40/32]",
          },
        ].map((c, i) => (
          <article
            key={c.scene}
            id={c.scene}
            data-panel
            data-scene={c.scene}
            data-stage={c.stage}
            aria-labelledby={c.id}
            className="wrap grid-12 relative flex-none items-center gap-y-10 py-[clamp(5rem,12vh,9rem)] group-data-[hscroll=on]/h:h-full group-data-[hscroll=on]/h:w-[86vw] group-data-[hscroll=on]/h:max-w-none group-data-[hscroll=on]/h:py-0"
          >
            <div
              className={`col-span-4 md:col-span-4 xl:col-span-5 ${i % 2 ? "md:order-2 md:col-start-5 xl:col-start-7" : ""}`}
            >
              <div className="flex items-end gap-5">
                <p aria-hidden data-n={c.n} className="display-xxl text-rule before:content-[attr(data-n)]" />
                <PhotoFrame
                  photo={c.photo}
                  sizes="(min-width: 1024px) 14vw, 36vw"
                  className="hidden md:block mb-3 aspect-[5/4] w-[clamp(120px,14vw,220px)]"
                />
              </div>
              <ChapterLabel n={c.n} label={c.label} />
              <h2 id={c.id} className="display-l mt-5 max-w-[14ch]">
                {c.title}
              </h2>
              <p className="mt-6 max-w-[44ch] text-brown">{c.body}</p>
            </div>
            <div
              data-scene-anchor
              className={`relative col-span-4 w-full ${c.aspect} md:col-span-4 xl:col-span-6 ${i % 2 ? "md:order-1 xl:col-start-1" : "xl:col-start-7"}`}
            >
              {c.art}
            </div>
          </article>
        ))}
      </HorizontalChapters>

      {/* The table: what is traded */}
      <section aria-labelledby="table-title" className="relative py-[clamp(6rem,18vh,14rem)]">
        <div className="wrap grid-12 relative">
          <div className="col-span-4 md:col-span-7 xl:col-span-10 xl:col-start-2">
            <ChapterLabel label="What we trade" />
            <Reveal as="h2" id="table-title" className="display-l mt-6 max-w-[18ch]">
              Ten spices and five pulses, traded whole, split or ground.
            </Reveal>
            <ul className="mt-12 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-[clamp(1.75rem,4.2vw,4rem)] leading-[1.12] tracking-[-0.02em] [font-variation-settings:'opsz'_120]">
              {products.map((p, i) => (
                <li key={p.slug} className="flex items-baseline gap-2">
                  <Link
                    href={`/products/${p.slug}`}
                    className="group relative inline-flex items-baseline gap-2 transition-colors duration-300 hover:text-[var(--ink)] focus-visible:text-[var(--ink)]"
                    style={{ "--ink": p.ink } as React.CSSProperties}
                    data-cursor="Open"
                  >
                    <span
                      aria-hidden
                      className="inline-block h-[0.32em] w-[0.32em] -translate-y-[0.12em] rounded-full transition-transform duration-500 ease-(--ease-settle) group-hover:scale-150"
                      style={{ background: p.accent }}
                    />
                    {p.name}
                  </Link>
                  {i < products.length - 1 && (
                    <span aria-hidden className="text-rule before:content-['/']" />
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className="mono-label link-draw mt-12 inline-block text-green"
              data-cursor="Open"
            >
              Open the sorting table →
            </Link>
          </div>
        </div>
      </section>

      {/* 05 Check */}
      <SceneSection
        flow
        scene="check"
        stage={4}
        id="check"
        labelledBy="check-title"
        className="wrap grid-12 relative scroll-mt-24 items-center gap-y-16 py-[clamp(6rem,16vh,12rem)]"
      >
        <div className="col-span-4 md:col-span-4 xl:col-span-5 xl:col-start-2">
          <ChapterLabel n="05" label="Check" />
          <Reveal as="h2" id="check-title" className="display-xl mt-6">
            Your spec, <em className="display-em">written down</em>.
          </Reveal>
          <Reveal as="p" by="fade" className="body-l mt-8 max-w-[42ch] text-brown">
            Buyers in different markets ask for different limits. Send the specification you buy to, and the
            quote is made against it, parameter by parameter.
          </Reveal>
          <div className="mt-10 flex items-end gap-6">
            <div data-scene-anchor className="relative aspect-square w-[min(58vw,340px)] flex-none">
              <StageArt kind="loupe" colors={PALETTE.dried} count={200} w={300} h={300} />
            </div>
            <PhotoFrame
              photo={photos["black-pepper"]}
              sizes="160px"
              className="hidden md:block mb-4 aspect-square w-[clamp(84px,10vw,150px)]"
            />
          </div>
        </div>
        <div className="col-span-4 md:col-span-4 md:col-start-5 xl:col-span-4 xl:col-start-8">
          <SampleTag title="Specification · to be filled by the buyer">
            <dl className="divide-y divide-rule font-mono text-[0.8125rem]">
              {SPEC_PARAMETERS.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-2.5">
                  <dt>{k}</dt>
                  <dd className="text-right text-brown">{v}</dd>
                </div>
              ))}
            </dl>
          </SampleTag>
          <Slot label="certifications" source="site.certifications in src/config/site.ts" items={site.certifications}>
            {(items) => (
              <ul className="mt-10 space-y-2">
                {items.map((c) => (
                  <li key={c.name} className="mono-label text-brown">
                    {c.name} · {c.issuer}
                  </li>
                ))}
              </ul>
            )}
          </Slot>
        </div>
      </SceneSection>

      {/* 06 Pack */}
      <SceneSection
        flow
        scene="pack"
        stage={5}
        id="pack"
        labelledBy="pack-title"
        className="wrap grid-12 relative items-end gap-y-12 py-[clamp(6rem,16vh,12rem)]"
      >
        <div className="col-span-4 md:col-span-5 xl:col-span-5 xl:col-start-3">
          <ChapterLabel n="06" label="Pack" />
          <Reveal as="h2" id="pack-title" className="display-xl mt-6">
            Bagged the way your market <em className="display-em">expects</em>.
          </Reveal>
          <Reveal as="p" by="fade" className="body-l mt-8 max-w-[44ch] text-brown">
            PP woven or jute bags for most spices and pulses, cartons with liners for cardamom and cinnamon.
            Bag weight, marking and labels follow your instructions, and private label is available on
            request.
          </Reveal>
          <PhotoFrame
            photo={photos["stage-pack"]}
            sizes="(min-width: 1280px) 26vw, 70vw"
            className="hidden md:block mt-12 aspect-[5/4] w-[min(80%,380px)]"
          />
        </div>
        <div
          data-scene-anchor
          className="relative col-span-3 aspect-[100/120] w-full max-w-[320px] md:col-span-3 md:col-start-6 xl:col-span-3 xl:col-start-9"
        >
          <StageArt kind="sack" colors={["#5A2E1A", "#B99459"]} />
        </div>
      </SceneSection>

      {/* 07 Container (night) */}
      <SceneSection
        flow
        scene="container"
        stage={6}
        id="container"
        night
        labelledBy="container-title"
        className="on-dark night-bg bg-green-900 wrap grid-12 relative gap-y-12 py-[clamp(7rem,20vh,14rem)] text-paper"
      >
        <div
          data-scene-anchor
          className="relative col-span-4 aspect-[200/90] w-full md:col-span-8 xl:col-span-9"
        >
          <StageArt kind="container" colors={["#E3A21A", "#FBF7EE"]} />
        </div>
        <PhotoFrame
          photo={photos["stage-container"]}
          sizes="(min-width: 1280px) 24vw, (min-width: 768px) 30vw, 70vw"
          className="hidden md:block col-span-3 aspect-[4/5] w-full max-w-[340px] md:col-span-3 xl:col-span-4 xl:col-start-1 xl:max-w-[360px]"
        />
        <div className="col-span-4 self-end md:col-span-5 md:col-start-4 xl:col-span-5 xl:col-start-6">
          <ChapterLabel n="07" label="Container" dark />
          <Reveal as="h2" id="container-title" className="display-xl mt-6">
            By the kilo, the tonne or the <em className="display-em text-turmeric">box</em>.
          </Reveal>
          <Reveal as="p" by="fade" className="body-l mt-8 max-w-[44ch] text-paper/80">
            Quote in kilograms, metric tonnes, bags, or a full 20 ft or 40 ft container. Tell us the port it is
            going to and the incoterm you work with.
          </Reveal>
        </div>
      </SceneSection>

      {/* 08 Port (night) + quote */}
      <SceneSection
        flow
        scene="port"
        stage={7}
        id="port"
        night
        labelledBy="port-title"
        className="on-dark night-bg bg-green-900 relative overflow-x-clip pb-10 pt-[clamp(6rem,14vh,10rem)] text-paper"
      >
        <div className="wrap relative">
          <div data-scene-extra aria-hidden className="absolute inset-x-0 top-[clamp(9rem,26vw,22rem)] h-4" />
          <div data-scene-anchor className="relative ml-auto aspect-[240/100] w-[min(92%,760px)]">
            <StageArt kind="ship" colors={["#E3A21A", "#FBF7EE"]} />
          </div>
        </div>
        <div className="wrap grid-12 mt-16 gap-y-14">
          <div className="col-span-4 md:col-span-8 xl:col-span-6">
            <ChapterLabel n="08" label="Port" dark />
            <Reveal as="h2" id="port-title" className="display-xxl mt-6">
              Tell us what you need to <em className="display-em text-turmeric">ship</em>.
            </Reveal>
            <PhotoFrame
              photo={photos["stage-port"]}
              sizes="(min-width: 1280px) 22vw, 60vw"
              className="hidden md:block mt-12 aspect-[3/2] w-[min(80%,380px)]"
            />
            <div className="mt-12 space-y-3 text-paper/85">
              <p className="mono-label text-turmeric">Or talk to us directly</p>
              {site.phones.map((p) => (
                <p key={p.e164} className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <a href={whatsappLink(p)} target="_blank" rel="noopener noreferrer" className="link-draw text-xl">
                    WhatsApp {p.display}
                  </a>
                </p>
              ))}
              <p>
                <a href={`mailto:${site.email}`} className="link-draw text-xl [overflow-wrap:anywhere]">
                  {site.email}
                </a>
              </p>
            </div>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-2 xl:col-span-5 xl:col-start-8 xl:pt-24">
            <QuoteStarter tone="dark" />
          </div>
        </div>
      </SceneSection>
    </div>
  );
}
