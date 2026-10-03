import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { StageArt } from "@/components/art/StageArt";
import { SampleTag } from "@/components/art/SampleTag";
import { PhotoFrame } from "@/components/art/PhotoFrame";
import { ChapterLabel, StepNumber } from "@/components/home/ChapterLabel";
import { HorizontalChapters } from "@/components/home/HorizontalChapters";
import { QuoteStarter } from "@/components/home/QuoteStarter";
import { SceneSection } from "@/components/home/SceneSection";
import { PALETTE } from "@/components/home/palette";
import { Reveal } from "@/components/motion/Reveal";
import { Slot } from "@/components/placeholder/Slot";
import { site, whatsappLink } from "@/config/site";
import { photos } from "@/data/photos";
import { stages } from "@/config/site";

export const metadata: Metadata = pageMeta({
  title: "The journey: from soil to shipment",
  description:
    "Follow spices, rice, pulses and onions from the field to the port or airport: soil, harvest, sun-drying, sorting, checking against your specification, packing, container and shipment.",
  path: "/journey",
});

const SPEC_PARAMETERS = [
  ["Moisture", "% max"],
  ["Extraneous matter", "% max"],
  ["Grade or size", "e.g. 550 g/l, 8 mm"],
  ["Colour value", "ASTA, for chilli"],
  ["Curcumin", "%, for turmeric"],
  ["Broken grains", "%, for rice and pulses"],
  ["Bulb size", "mm, for onions"],
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
        className="page-enter wrap grid-12 relative items-end gap-y-12 pb-20 pt-[calc(var(--header-h)+4rem)] md:pb-28"
      >
        <div className="col-span-4 md:col-span-5 xl:col-span-7">
          <ChapterLabel label="The journey" />
          <h1 id="journey-title" className="display-xxl mt-6">
            From <em className="display-em text-green">soil</em> to shipment.
          </h1>
          <p className="body-l mt-8 max-w-[40ch] text-brown">
            Eight stops between a field in India and a port or airport abroad. Scroll to follow the goods along the way.
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
        rail="Soil"
        stage={0}
        id="soil"
        labelledBy="soil-title"
        className="wrap grid-12 relative scroll-mt-24 items-center gap-y-10 py-14 md:py-[clamp(6rem,16vh,12rem)]"
      >
        <div
          data-scene-anchor
          className="relative col-span-4 aspect-[4/3] md:col-span-5 xl:col-span-6 xl:-ml-[4vw]"
        >
          <StageArt kind="furrows" colors={PALETTE.soil} count={260} />
        </div>
        <div className="col-span-4 md:col-span-3 xl:col-span-5 xl:col-start-8">
          <StepNumber n="01" className="mb-3" />
          <ChapterLabel n="01" label="Soil" />
          <Reveal as="h2" id="soil-title" className="display-xl mt-6">
            It starts in the <em className="display-em">ground</em>.
          </Reveal>
          <Reveal as="p" by="fade" className="body-l mt-8 max-w-[46ch] text-brown">
            Pepper vines on the wet slopes of Wayanad and Kodagu. Turmeric in the red soils around Erode.
            Ponni rice in the Kaveri delta around Thanjavur. Each crop has a region it grows best in and a
            season when it is ready.
          </Reveal>
          <Reveal as="p" by="fade" delay={0.1} className="mt-5 max-w-[46ch] text-brown">
            Where a crop comes from is the first thing worth asking about, so every product page lists the
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
            body: "Pepper spikes are picked as the first berries on them turn red. Chillies are left on the plant to colour. Turmeric is lifted once its leaves dry back. Paddy is cut when the grain hardens, pulses when the pods dry, and onions once their tops fall over.",
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
            body: "Spread thin on drying yards, green pepper darkens and wrinkles over several days as the skin oxidises. Paddy, pulses and onions are dried and cured too. Drying brings moisture down far enough for the crop to keep through the journey.",
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
            body: "Stones, stalks and light berries come out. Seed spices are machine-cleaned or run through a sortex. Pepper is graded by density, cardamom by pod size, rice by grain length, pulses by size and onions by bulb diameter.",
            art: <StageArt kind="sieve" colors={PALETTE.dried} count={220} w={400} h={320} />,
            photo: photos["stage-sort"],
            aspect: "aspect-[40/32]",
          },
        ].map((c, i) => (
          <article
            key={c.scene}
            id={c.scene}
            data-panel
            data-rail={c.label}
            data-scene={c.scene}
            data-stage={c.stage}
            aria-labelledby={c.id}
            className="wrap grid-12 relative flex-none items-center gap-y-10 py-14 md:py-[clamp(5rem,12vh,9rem)] group-data-[hscroll=on]/h:h-full group-data-[hscroll=on]/h:w-[86vw] group-data-[hscroll=on]/h:max-w-none group-data-[hscroll=on]/h:py-0"
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

      {/* 05 Check */}
      <SceneSection
        flow
        scene="check"
        rail="Check"
        stage={4}
        id="check"
        labelledBy="check-title"
        className="wrap grid-12 relative scroll-mt-24 items-center gap-y-16 py-14 md:py-[clamp(6rem,16vh,12rem)]"
      >
        <div className="col-span-4 md:col-span-4 xl:col-span-5 xl:col-start-2">
          <StepNumber n="05" className="mb-3" />
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
          <SampleTag title="Specification · what you can set">
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
        rail="Pack"
        stage={5}
        id="pack"
        labelledBy="pack-title"
        className="wrap grid-12 relative items-center gap-y-12 py-14 md:py-[clamp(6rem,16vh,12rem)]"
      >
        <div className="col-span-4 md:col-span-5 xl:col-span-5 xl:col-start-2">
          <StepNumber n="06" className="mb-3" />
          <ChapterLabel n="06" label="Pack" />
          <Reveal as="h2" id="pack-title" className="display-xl mt-6">
            Bagged the way your market <em className="display-em">expects</em>.
          </Reveal>
          <Reveal as="p" by="fade" className="body-l mt-8 max-w-[44ch] text-brown">
            PP woven or jute bags for spices, rice and pulses, cartons with liners for cardamom, mesh bags
            for onions. Bag weight, marking and labels follow your instructions, and private label is
            available on request.
          </Reveal>
        </div>
        {/* Right: the sack the grains pour into, then the photograph of real sacks */}
        <div className="col-span-4 flex flex-col items-center gap-8 md:col-span-3 md:col-start-6 xl:col-span-5 xl:col-start-8">
          <div data-scene-anchor className="relative aspect-[100/120] w-[min(60vw,240px)] md:w-[42%]">
            <StageArt kind="sack" colors={["#5A2E1A", "#B99459"]} />
          </div>
          <PhotoFrame
            photo={photos["stage-pack"]}
            sizes="(min-width: 1280px) 34vw, 40vw"
            className="hidden aspect-[16/10] w-full md:block"
          />
        </div>
      </SceneSection>

      {/* 07 Container (night) */}
      <SceneSection
        flow
        scene="container"
        rail="Container"
        stage={6}
        id="container"
        night
        toneStart
        labelledBy="container-title"
        className="on-dark night-bg bg-green-900 wrap grid-12 relative gap-y-12 py-14 md:py-[clamp(4.5rem,11vh,8rem)] text-paper"
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
          <StepNumber n="07" dark className="mb-3" />
          <ChapterLabel n="07" label="Container" dark />
          <Reveal as="h2" id="container-title" className="display-xl mt-6">
            By the kilo, the tonne or the <em className="display-em text-turmeric">box</em>.
          </Reveal>
          <Reveal as="p" by="fade" className="body-l mt-8 max-w-[44ch] text-paper/80">
            Quote in kilograms, metric tonnes, bags, or a full 20 ft or 40 ft container by sea, or as air
            cargo for smaller and urgent lots. Tell us the port or airport it is going to and the incoterm you
            work with.
          </Reveal>
        </div>
      </SceneSection>

      {/* 08 Port (night) + quote: headline and contacts left, form right, ship across the foot */}
      <SceneSection
        flow
        scene="rail"
        rail="Port"
        stage={7}
        id="port"
        night
        labelledBy="port-title"
        className="on-dark night-bg bg-green-900 relative overflow-x-clip pb-0 pt-6 md:pt-[clamp(2rem,5vh,4rem)] text-paper"
      >
        <div className="wrap grid-12 items-start gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-6 xl:col-span-6">
            <StepNumber n="08" dark className="mb-3" />
          <ChapterLabel n="08" label="Port" dark />
            <Reveal as="h2" id="port-title" className="display-xxl mt-6">
              Tell us what you need to <em className="display-em text-turmeric">ship</em>.
            </Reveal>
            <div data-scene-anchor aria-hidden className="mt-10 h-3 w-full max-w-[520px]" />
            <div className="mt-8 grid gap-x-10 gap-y-6 text-paper/85 sm:grid-cols-2 lg:mt-10">
              <div>
                <p className="mono-label text-turmeric">WhatsApp or call</p>
                <ul className="mt-3 space-y-2">
                  {site.phones.map((p) => (
                    <li key={p.e164}>
                      <a href={whatsappLink(p)} target="_blank" rel="noopener noreferrer" className="link-draw text-xl">
                        {p.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mono-label text-turmeric">Email</p>
                <a href={`mailto:${site.email}`} className="link-draw mt-3 inline-block text-xl [overflow-wrap:anywhere]">
                  {site.email}
                </a>
              </div>
            </div>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-8 lg:pt-10">
            <div data-rv className="rounded-[4px] border border-paper/15 bg-green/15 p-6 md:p-8">
              <p className="mono-label text-turmeric">Start a quote</p>
              <div className="mt-6">
                <QuoteStarter tone="dark" />
              </div>
            </div>
          </div>
        </div>
        {/* By sea or by air: both ways a consignment can travel, side by side */}
        <div className="wrap mt-14 md:mt-20" data-rv-group>
          <div className="grid gap-4 md:grid-cols-[1.35fr_1fr] md:gap-6">
            {(
              [
                ["stage-port", "By sea", "Full 20 ft and 40 ft containers, for larger lots", "aspect-[16/9]"],
                ["stage-air", "By air", "Air cargo, for samples, smaller lots and urgent orders", "aspect-[16/9] md:aspect-auto md:h-full"],
              ] as const
            ).map(([key, label, note, aspect]) => (
              <figure key={key} className="group relative overflow-hidden rounded-[4px]">
                <PhotoFrame photo={photos[key]} sizes="(min-width: 768px) 55vw, 92vw" className={`w-full !rounded-none ${aspect}`} />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-900/85 via-green-900/15 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <p className="font-display text-[clamp(1.5rem,2.4vw,2.4rem)] leading-none text-[#fbf7ee] [font-variation-settings:'opsz'_72]">
                    {label}
                  </p>
                  <p className="mt-2 max-w-[38ch] text-sm text-[#fbf7ee]/85">{note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="h-14 md:h-20" />
      </SceneSection>
    </div>
  );
}
