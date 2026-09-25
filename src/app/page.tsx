import type { Metadata } from "next";
import Link from "next/link";
import { PhotoSlider, type SlideItem } from "@/components/art/PhotoSlider";
import { StageArt } from "@/components/art/StageArt";
import { ChapterLabel } from "@/components/home/ChapterLabel";
import { Opening } from "@/components/home/Opening";
import { QuoteStarter } from "@/components/home/QuoteStarter";
import { SceneSection } from "@/components/home/SceneSection";
import { Reveal } from "@/components/motion/Reveal";
import { site, stages, whatsappLink } from "@/config/site";
import { photos, type PhotoKey } from "@/data/photos";
import { products, pulses, spices } from "@/data/products";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ description: site.description, path: "/" });

/** Every product, as slides for the "up close" slider. */
const PRODUCT_SLIDES: SlideItem[] = products.map((p) => ({
  key: p.slug,
  photo: photos[p.slug as PhotoKey],
  title: p.name,
  eyebrow: p.category === "spice" ? "Spice" : "Pulse",
  meta: p.origin[0].split(" (")[0],
  href: `/products/${p.slug}`,
}));

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

/** The eight stops on the route, as slides. */
const STOP_SLIDES: SlideItem[] = stages.map((st) => ({
  key: st.id,
  photo: photos[STOP_PHOTO[st.id]],
  title: st.label,
  eyebrow: st.n,
  href: `/journey#${st.id}`,
}));

export default function Home() {
  return (
    <>
      <Opening />

      {/* What we do, in one sentence */}
      <section aria-labelledby="intro-title" className="relative py-[clamp(5rem,14vh,11rem)]">
        <div className="wrap grid-12 relative gap-y-12">
          <div className="col-span-4 md:col-span-8 xl:col-span-10 xl:col-start-2">
            <ChapterLabel label="What we do" />
            <h2 id="intro-title" className="display-l mt-8 max-w-[22ch] leading-[1.12]">
              We trade spices and pulses in wholesale lots, and prepare them for buyers{" "}
              <em className="display-em text-green">abroad</em>.
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

      {/* From the table: every product, in a slider */}
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

        <div className="mt-12 md:mt-16">
          <PhotoSlider items={PRODUCT_SLIDES} label="Products, up close" />
        </div>
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

        <div className="wrap mt-10">
          <div data-scene-anchor aria-hidden className="h-3 w-full" />
        </div>
        <div className="mt-8">
          <PhotoSlider
            items={STOP_SLIDES}
            label="Stops on the journey"
            aspect="aspect-[4/3]"
            slideWidth="w-[62vw] sm:w-[36vw] lg:w-[24vw] xl:w-[19vw]"
          />
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
