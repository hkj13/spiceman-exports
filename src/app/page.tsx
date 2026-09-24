import Link from "next/link";

export default function Home() {
  return (
    <section className="wrap grid-12 min-h-dvh items-end pb-24 pt-40">
      <h1 className="display-xxl col-span-4 md:col-span-7 xl:col-span-9">
        Pure spices, from the <span className="display-em text-green">soil</span> to the ship.
      </h1>
      <div className="col-span-4 mt-10 md:col-span-3 md:col-start-6 xl:col-span-3 xl:col-start-10">
        <p className="body-l text-brown">
          Wholesale trade and export of spices and pulses. Pondicherry, India.
        </p>
        <Link href="/contact" className="mono-label link-draw mt-6 inline-block text-green">
          Request a quote →
        </Link>
      </div>
    </section>
  );
}
