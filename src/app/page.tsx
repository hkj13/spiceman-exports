import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MaskedPhoto, type MaskShape } from "@/components/art/MaskedPhoto";
import { StageArt } from "@/components/art/StageArt";
import { ChapterLabel } from "@/components/home/ChapterLabel";
import { Opening } from "@/components/home/Opening";
import { QuoteStarter } from "@/components/home/QuoteStarter";
import { SceneSection } from "@/components/home/SceneSection";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { site, stages, whatsappLink } from "@/config/site";
import { photos, type Photo, type PhotoKey } from "@/data/photos";
import { getProduct, products, pulses, spices } from "@/data/products";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ description: site.description, path: "/" });

/** A photo set inline with display type, like a word. */
function Pill({ photo, shape = "pebble" }: { photo: Photo; shape?: MaskShape }) {
  return (
    <span
      aria-hidden
      className={`mask-${shape} relative mx-[0.12em] inline-block h-[0.74em] w-[1.7em] -translate-y-[0.06em] overflow-hidden align-baseline`}
    >
      <Image src={photo.src} alt="" fill sizes="160px" className="photo-grade object-cover" />
    </span>
  );
}

/** The collage: placement, shape and drift for each featured product. */
const FEATURED: { slug: string; shape: MaskShape; box: string; aspect: string; speed: number; echo?: string }[] = [
  { slug: "black-pepper", shape: "seed", box: "col-span-4 md:col-span-4 xl:col-span-4 xl:col-start-1", aspect: "aspect-[4/5]", speed: 0.4, echo: "#5A2E1A" },
  { slug: "turmeric", shape: "pod", box: "col-span-2 md:col-span-2 md:mt-40 xl:col-span-2 xl:col-start-6", aspect: "aspect-[3/5]", speed: -0.5 },
  { slug: "red-chilli", shape: "pebble", box: "col-span-2 mt-16 md:col-span-2 md:mt-10 xl:col-span-3 xl:col-start-9", aspect: "aspect-[5/4]", speed: 0.7, echo: "#E3A21A" },
  { slug: "cardamom", shape: "circle", box: "col-span-2 md:col-span-2 md:col-start-2 xl:col-span-2 xl:col-start-2", aspect: "aspect-square", speed: -0.3 },
  { slug: "cumin", shape: "leaf", box: "col-span-2 mt-10 md:col-span-2 md:mt-24 xl:col-span-3 xl:col-start-5", aspect: "aspect-[4/5]", speed: 0.5, echo: "#B99459" },
  { slug: "masoor", shape: "arch", box: "col-span-4 md:col-span-3 md:col-start-6 xl:col-span-3 xl:col-start-10", aspect: "aspect-[5/4]", speed: -0.6 },
];

/** A photograph for each stop on the route (Check shows a close-up under inspection). */
const STOP_PHOTO: Record<string, PhotoKey> = {
  soil: "stage-soil",
  harvest: "stage-harvest",
  sun: "stage-sun",
  sort: "stage-sort",
  check: "black-pepper",
  pack: "stage-pack",
  container: "stage-container",
  port: "stage-port",
};

export default function Home() {
  return (
    <>
      <Opening />

      {/* What we do, in one sentence with the goods set into it */}
      <section aria-labelledby="intro-title" className="relative py-[clamp(5rem,14vh,11rem)]">
        <div className="wrap grid-12 relative gap-y-12">
          <div className="col-span-4 md:col-span-8 xl:col-span-10 xl:col-start-2">
            <ChapterLabel label="What we do" />
            <h2 id="intro-title" className="display-l mt-8 max-w-[22ch] leading-[1.12]">
              {/* Each photo is bound to a word so it can never wrap onto a line of its own */}
              <span className="whitespace-nowrap">
                We trade <Pill photo={photos["black-pepper"]} />
              </span>{" "}
              <span className="whitespace-nowrap">
                spices and <Pill photo={photos.moong} shape="seed" />
              </span>{" "}
              pulses in wholesale lots, and prepare them for buyers{" "}
              <span className="whitespace-nowrap">
                <em className="display-em text-green">abroad</em>
                <Pill photo={photos["stage-port"]} shape="arch" />.
              </span>
            </h2>
          </div>
          <div className="col-span-4 md:col-span-4 md:col-start-5 xl:col-span-4 xl:col-start-8">
            <p className="text-brown">
              {spices.map((p) => p.name).join(", ")}. {pulses.map((p) => p.name).join(", ")}. Whole, split or
              ground, each with its own spec sheet.
            </p>
            <Link href="/products" className="mono-label link-draw mt-6 inline-block text-green" data-cursor="Open">
              Open the sorting table →
            </Link>
          </div>
        </div>
      </section>

      {/* From the table: a collage of the goods themselves */}
      <section aria-labelledby="table-title" className="relative py-[clamp(4rem,10vh,8rem)]">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <div>
            <ChapterLabel label="From the table" />
            <Reveal as="h2" id="table-title" className="display-xl mt-6">
              The goods, <em className="display-em">up close</em>.
            </Reveal>
          </div>
          <Link href="/products" className="mono-label link-draw text-green" data-cursor="Open">
            All {products.length} products →
          </Link>
        </div>

        <Parallax className="wrap grid-12 mt-16 items-start gap-y-14 md:mt-24">
          {FEATURED.map((f) => {
            const p = getProduct(f.slug)!;
            return (
              <Link
                key={f.slug}
                href={`/products/${p.slug}`}
                data-speed={f.speed}
                data-cursor="Open"
                className={`group block ${f.box}`}
              >
                <MaskedPhoto
                  photo={photos[f.slug as PhotoKey]}
                  shape={f.shape}
                  echo={f.echo}
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 40vw, 50vw"
                  className={`w-full ${f.aspect}`}
                />
                <span className="mt-4 flex items-baseline justify-between gap-3">
                  <span className="h3 transition-colors duration-300 group-hover:text-[var(--ink)]" style={{ "--ink": p.ink } as React.CSSProperties}>
                    {p.name}
                  </span>
                  <span aria-hidden className="mono-label text-brown transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span className="mono-label mt-1 block text-[0.65rem] text-brown">
                  {p.category === "spice" ? "Spice" : "Pulse"} · {p.origin[0].split(" (")[0]}
                </span>
              </Link>
            );
          })}
        </Parallax>
      </section>

      {/* The route, in eight stops: a teaser for the journey page */}
      <SceneSection
        scene="rail"
        stage={3}
        labelledBy="route-title"
        className="relative py-[clamp(6rem,16vh,12rem)]"
      >
        <div className="wrap grid-12 gap-y-8">
          <div className="col-span-4 md:col-span-5 xl:col-span-6">
            <ChapterLabel label="The journey" />
            <Reveal as="h2" id="route-title" className="display-xl mt-6">
              The route, in <em className="display-em">eight</em> stops.
            </Reveal>
          </div>
          <p className="col-span-4 max-w-[40ch] self-end text-brown md:col-span-3 md:col-start-6 xl:col-span-4 xl:col-start-9">
            From a field in India to a port abroad: what happens to a spice at each stop, and what you can ask
            for along the way.
          </p>
        </div>

        <div className="relative mt-16">
          <div data-scene-anchor aria-hidden className="absolute inset-x-0 top-[calc(clamp(88px,9vw,132px)/2)] h-3" />
          <span aria-hidden className="absolute inset-x-0 top-[calc(clamp(88px,9vw,132px)/2)] h-px bg-rule" />
          <ol
            className="wrap relative flex snap-x snap-mandatory scroll-px-[var(--margin)] gap-6 overflow-x-auto pb-4 [scrollbar-width:none] lg:grid lg:grid-cols-8 lg:overflow-visible"
            aria-label="Stops on the journey"
          >
            {stages.map((st) => (
              <li key={st.id} className="w-[clamp(88px,9vw,132px)] flex-none snap-start lg:w-auto">
                <Link href={`/journey#${st.id}`} className="group block" data-cursor="Go">
                  <MaskedPhoto
                    photo={photos[STOP_PHOTO[st.id]]}
                    shape="circle"
                    decorative
                    sizes="140px"
                    className="aspect-square w-[clamp(88px,9vw,132px)] ring-0"
                  />
                  <span className="mono-label mt-4 block text-chilli">{st.n}</span>
                  <span className="h3 mt-1 block transition-colors group-hover:text-green">{st.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="wrap mt-14">
          <Link
            href="/journey"
            data-cursor="Go"
            className="mono-label group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 text-paper transition-colors hover:bg-green"
          >
            Follow the whole route
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </SceneSection>

      {/* A word from Pondicherry */}
      <section aria-labelledby="note-title" className="wrap grid-12 gap-y-10 py-[clamp(5rem,14vh,10rem)]">
        <div className="col-span-4 md:col-span-3 xl:col-span-3 xl:col-start-2">
          <p className="mono-label text-brown">From Lawspet, Pondicherry</p>
          <p className="mt-4 font-display text-2xl italic text-green [font-variation-settings:'opsz'_36]">
            {site.tagline.replace("|", "·")}
          </p>
        </div>
        <div className="col-span-4 md:col-span-5 md:col-start-4 xl:col-span-6 xl:col-start-6">
          <h2 id="note-title" className="display-l">
            Run by {site.proprietor.name}, and answered directly.
          </h2>
          <p className="body-l mt-6 max-w-[48ch] text-brown">
            Spiceman Exports is a proprietorship. Inquiries go straight to the proprietor by phone, WhatsApp or
            email, with a straight answer on what can be supplied.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/about" className="mono-label link-draw text-green">
              About the business →
            </Link>
            <Link href="/process" className="mono-label link-draw text-green">
              How quality is specified →
            </Link>
          </div>
        </div>
      </section>

      {/* Quote (night) */}
      <SceneSection
        scene="pack"
        stage={7}
        night
        nightPalette
        labelledBy="quote-title"
        className="on-dark night-bg bg-green-900 relative overflow-x-clip py-[clamp(6rem,16vh,12rem)] text-paper"
      >
        <div className="wrap grid-12 gap-y-14">
          <div className="col-span-4 md:col-span-8 xl:col-span-6">
            <ChapterLabel label="Get a quote" dark />
            <Reveal as="h2" id="quote-title" className="display-xxl mt-6">
              Tell us what you need to <em className="display-em text-turmeric">ship</em>.
            </Reveal>
            <div className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-end">
              <div data-scene-anchor className="relative aspect-[100/120] w-[min(34vw,180px)] flex-none">
                <StageArt kind="sack" colors={["#E3A21A", "#FBF7EE"]} />
              </div>
              <div className="space-y-3 text-paper/85">
                <p className="mono-label text-turmeric">Or talk directly</p>
                {site.phones.map((p) => (
                  <p key={p.e164}>
                    <a href={whatsappLink(p)} target="_blank" rel="noopener noreferrer" className="link-draw text-lg">
                      WhatsApp {p.display}
                    </a>
                  </p>
                ))}
                <p>
                  <a href={`mailto:${site.email}`} className="link-draw break-words text-lg">
                    {site.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-2 xl:col-span-5 xl:col-start-8 xl:pt-24">
            <QuoteStarter tone="dark" />
          </div>
        </div>
      </SceneSection>
    </>
  );
}
