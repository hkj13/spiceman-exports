import Link from "next/link";
import { nav, site, whatsappLink } from "@/config/site";
import { LogoMark } from "@/components/brand/LogoMark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative z-10 mt-32 bg-green-900 text-paper">
      <div className="wrap grid-12 gap-y-14 pb-10 pt-20">
        <div className="col-span-4 md:col-span-5 xl:col-span-6">
          <p className="display-l max-w-[14ch]">
            Pure spices. <span className="display-em text-turmeric">Better tomorrow.</span>
          </p>
          <p className="mt-6 max-w-md text-paper/75">
            Wholesale trading and export of spices and pulses, from Lawspet, Pondicherry.
          </p>
        </div>

        <address className="col-span-2 not-italic md:col-span-3 xl:col-span-3 xl:col-start-8">
          <p className="mono-label mb-4 text-turmeric">Write or visit</p>
          <p className="leading-relaxed text-paper/85">
            {site.address.lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
            {site.address.locality} {site.address.postalCode}
            <br />
            {site.address.country}
          </p>
          <a href={`mailto:${site.email}`} className="link-draw mt-4 inline-block break-all">
            {site.email}
          </a>
        </address>

        <div className="col-span-2 md:col-span-3 md:col-start-6 xl:col-span-2 xl:col-start-11">
          <p className="mono-label mb-4 text-turmeric">Call or WhatsApp</p>
          <ul className="space-y-3">
            {site.phones.map((p) => (
              <li key={p.e164}>
                <a href={`tel:+${p.e164}`} className="link-draw whitespace-nowrap">
                  {p.display}
                </a>
                <a
                  href={whatsappLink(p)}
                  className="mono-label ml-0 mt-1 block text-[0.65rem] text-paper/70 hover:text-paper"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="col-span-4 md:col-span-8 xl:col-span-12">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-paper/15 pt-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="mono-label text-paper/80 hover:text-paper">
                  <span className="text-turmeric">{item.stage}</span> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-4 flex items-end justify-between gap-6 md:col-span-8 xl:col-span-12">
          <p className="mono-label text-[0.65rem] text-paper/60">
            © {year} {site.legalName} · Proprietor {site.proprietor.name}
          </p>
          <LogoMark className="h-14 w-14 opacity-90" />
        </div>
      </div>
    </footer>
  );
}
