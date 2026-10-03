import type { Metadata } from "next";
import Link from "next/link";
import { PhotoSlider, type SlideItem } from "@/components/art/PhotoSlider";
import { ChapterLabel } from "@/components/home/ChapterLabel";
import { Opening } from "@/components/home/Opening";
import { QuoteStarter } from "@/components/home/QuoteStarter";
import { NightZone } from "@/components/home/NightZone";
import { SceneSection } from "@/components/home/SceneSection";
import { CatalogueDownload } from "@/components/products/CatalogueDownload";
import { Reveal } from "@/components/motion/Reveal";
import { site, stages, whatsappLink } from "@/config/site";
import { photos, type PhotoKey } from "@/data/photos";
import { CATEGORIES, categoryLabel, products } from "@/data/products";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ description: site.description, path: "/" });

/** Every product, as slides for the "up close" slider. */
const PRODUCT_SLIDES: SlideItem[] = products.map((p) => ({
  key: p.slug,
  photo: photos[p.slug as PhotoKey],
  title: p.name,
  eyebrow: categoryLabel(p.category),
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
  // the last two stops cover both ways out, so they show sea and air together
  pair:
    st.id === "container" || st.id === "port"
      ? st.id === "container"
        ? { photo: photos["stage-air-cargo"], captions: ["By sea", "By air"] as [string, string] }
        : { photo: photos["stage-air"], captions: ["By sea", "By air"] as [string, string], position: "50% 74%" }
      : undefined,
  title: st.label,
  eyebrow: st.n,
  meta: st.id === "container" ? "Containers by sea, or air cargo" : st.id === "port" ? "Sea freight and air cargo" : undefined,
  href: `/journey#${st.id}`,
}));

export default function Home() {
  return (
    <>
      <Opening />

      {/* What we do: one sentence, then the four categories across the full width */}
      <section aria-labelledby="intro-title" data-rail="What we do" className="relative pb-6 pt-14 md:pb-8 md:pt-[clamp(4rem,10vh,8rem)]">
        <div className="wrap">
          <ChapterLabel label="What we do" />
          <h2 id="intro-title" className="display-l mt-8 max-w-[24ch] leading-[1.12]">
            We trade spices, rice, pulses and onions in wholesale lots, and prepare them for buyers{" "}
            <em className="display-em text-green">abroad</em>.
          </h2>
          <ul data-rv-group className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {CATEGORIES.map((c) => {
              const items = products.filter((p) => p.category === c.id);
              return (
                <li key={c.id}>
                  <p className="mono-label flex items-baseline justify-between text-brown">
                    {c.many}
                    <span className="text-[0.65rem]">{String(items.length).padStart(2, "0")}</span>
                  </p>
                  <ul className="mt-4 space-y-1">
                    {items.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}`}
                          className="group flex items-baseline gap-2.5 font-display text-[clamp(1.35rem,1.9vw,2.15rem)] leading-[1.15] tracking-[-0.015em] text-ink transition-colors [font-variation-settings:'opsz'_72] hover:text-[var(--ink)]"
                          style={{ "--ink": p.ink } as React.CSSProperties}
                          data-cursor="Open"
                        >
                          <span
                            aria-hidden
                            className="inline-block h-[0.3em] w-[0.3em] flex-none -translate-y-[0.08em] rounded-full transition-transform duration-500 ease-(--ease-settle) group-hover:scale-150"
                            style={{ background: p.accent }}
                          />
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-brown">
            Each with its own downloadable spec sheet.
            <Link href="/products" className="mono-label link-draw text-green" data-cursor="Open">
              Open the sorting table →
            </Link>
            <CatalogueDownload variant="link" />
          </p>
        </div>
      </section>

      {/* From the table: every product, in a slider */}
      <section aria-labelledby="table-title" data-rail="Products" className="relative py-14 md:py-[clamp(4rem,10vh,8rem)]">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <div>
            <ChapterLabel label="From the table" />
            <Reveal as="h2" id="table-title" className="display-xl mt-6">
              The goods, <em className="display-em">up close</em>.
            </Reveal>
          </div>
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
        rail="The journey"
        className="relative py-14 md:py-[clamp(6rem,16vh,12rem)]"
      >
        <div className="wrap grid-12 gap-y-8">
          <div className="col-span-4 md:col-span-5 xl:col-span-6">
            <ChapterLabel label="The journey" />
            <Reveal as="h2" id="route-title" className="display-xl mt-6">
              The route, in <em className="display-em">eight</em> stops.
            </Reveal>
          </div>
          <p className="col-span-4 max-w-[40ch] self-end text-brown md:col-span-3 md:col-start-6 xl:col-span-4 xl:col-start-9">
            From a field in India to a port or airport abroad: what happens to the goods at each stop, and what you can ask
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

      {/* A word from Pondicherry: the green block of the page starts here */}
      <NightZone toneStart labelledBy="note-title" rail="About us" className="on-dark night-bg bg-green-900 text-paper">
        <div className="wrap grid-12 gap-y-10 pb-6 pt-14 md:pb-10 md:pt-[clamp(5rem,14vh,10rem)]">
          <div className="col-span-4 md:col-span-3 xl:col-span-3 xl:col-start-2">
            <p className="mono-label text-turmeric">Pondicherry, India</p>
            <p className="mt-4 font-display text-2xl italic text-turmeric [font-variation-settings:'opsz'_36]">
              {site.tagline.replace("|", "·")}
            </p>
          </div>
          <div className="col-span-4 md:col-span-5 md:col-start-4 xl:col-span-6 xl:col-start-6">
            <h2 id="note-title" className="display-l">
              Run by {site.proprietor.name}, and answered directly.
            </h2>
            <p className="body-l mt-6 max-w-[48ch] text-paper/80">
              Spiceman Exports is a proprietorship. Inquiries go straight to the proprietor by phone, WhatsApp or
              email, with a straight answer on what can be supplied.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/about" className="mono-label link-draw text-turmeric">
                About the business →
              </Link>
              <Link href="/process" className="mono-label link-draw text-turmeric">
                How quality is specified →
              </Link>
            </div>
          </div>
        </div>
      </NightZone>

      {/* Quote (night) */}
      <SceneSection
        scene="rail"
        stage={7}
        night
        labelledBy="quote-title"
        rail="Get a quote"
        className="on-dark night-bg bg-green-900 relative overflow-x-clip py-14 md:py-[clamp(6rem,16vh,12rem)] text-paper"
      >
        <div className="wrap grid-12 items-center gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <ChapterLabel label="Get a quote" dark />
            <Reveal as="h2" id="quote-title" className="display-xxl mt-6">
              Tell us what you need to <em className="display-em text-turmeric">ship</em>.
            </Reveal>
            <div data-scene-anchor aria-hidden className="mt-10 h-3 w-full max-w-[520px]" />
            <div className="mt-8 grid gap-x-10 gap-y-6 text-paper/85 sm:grid-cols-2 lg:mt-10">
              <div>
                <p className="mono-label text-turmeric">WhatsApp or call</p>
                <ul className="mt-3 space-y-2">
                  {site.phones.map((p) => (
                    <li key={p.e164}>
                      <a href={whatsappLink(p)} target="_blank" rel="noopener noreferrer" className="link-draw text-lg">
                        {p.display}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mono-label text-turmeric">Email</p>
                <a href={`mailto:${site.email}`} className="link-draw mt-3 inline-block break-words text-lg">
                  {site.email}
                </a>
              </div>
            </div>
          </div>
          <div className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-8">
            <div data-rv className="rounded-[4px] border border-paper/15 bg-green/15 p-6 md:p-8">
              <p className="mono-label text-turmeric">Start a quote</p>
              <div className="mt-6">
                <QuoteStarter tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </SceneSection>
    </>
  );
}
