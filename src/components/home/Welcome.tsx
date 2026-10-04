import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { photos } from "@/data/photos";

/**
 * The landing banner: the brand over a container ship at sea, with the quote
 * button front and centre. The mortar-and-heap opening follows below it.
 */
export function Welcome() {
  const ship = photos["stage-port"];
  return (
    <section
      aria-labelledby="welcome-title"
      data-rail="Welcome"
      className="on-dark relative isolate flex min-h-[92svh] items-center overflow-hidden bg-green-900 text-paper md:min-h-[100svh]"
    >
      <Image
        src={ship.src}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        className="photo-grade -z-20 object-cover"
        style={{ objectPosition: "26% 62%" }}
      />
      {/* Green wash, darker at the foot, so the type reads on any part of the photo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(18_54_28/0.62)_0%,rgb(18_54_28/0.5)_42%,rgb(18_54_28/0.84)_100%)]"
      />

      <div className="wrap relative w-full pb-16 pt-[calc(var(--header-h)+3rem)] text-center">
        <p
          className="enter mono-label flex items-center justify-center gap-3 text-paper"
          style={{ "--d": 80 } as React.CSSProperties}
        >
          <span aria-hidden className="inline-block h-px w-8 bg-turmeric" />
          Welcome to
          <span aria-hidden className="inline-block h-px w-8 bg-turmeric" />
        </p>
        <h1
          id="welcome-title"
          className="enter mx-auto mt-6 font-display text-[clamp(3rem,9.5vw,10rem)] leading-[0.92] tracking-[-0.035em] [font-variation-settings:'opsz'_144]"
          style={{ "--d": 160 } as React.CSSProperties}
        >
          {site.name}
        </h1>
        <p
          className="enter mx-auto mt-6 font-display text-[clamp(1.6rem,3.4vw,3.25rem)] italic leading-[1.1] text-turmeric [font-variation-settings:'opsz'_72]"
          style={{ "--d": 260 } as React.CSSProperties}
        >
          Pure spices. Better tomorrow.
        </p>
        <p
          className="enter body-l mx-auto mt-6 max-w-[46ch] text-paper/85"
          style={{ "--d": 340 } as React.CSSProperties}
        >
          Spices, rice, pulses and onions, traded wholesale and exported from Pondicherry, India, by sea and air cargo.
        </p>
        <div
          className="enter mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4"
          style={{ "--d": 420 } as React.CSSProperties}
        >
          <Link
            href="/contact"
            data-cursor="Quote"
            className="mono-label group inline-flex items-center gap-3 rounded-full bg-turmeric px-6 py-4 text-ink transition-colors hover:bg-paper"
          >
            Get a quote
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link href="/products" data-cursor="Open" className="mono-label link-draw text-paper">
            See the products
          </Link>
        </div>
      </div>
    </section>
  );
}
