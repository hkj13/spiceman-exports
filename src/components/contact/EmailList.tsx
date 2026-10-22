import { site } from "@/config/site";

/**
 * Every department inbox as a labelled list: a small mono label above each
 * address. Lay it out with `className` (e.g. a responsive grid); each item is
 * self-contained, so it stacks cleanly at phone width.
 */
export function EmailList({
  tone = "light",
  size = "base",
  className = "",
}: {
  tone?: "light" | "dark";
  size?: "base" | "lg";
  className?: string;
}) {
  return (
    <ul className={className}>
      {site.emails.map((e) => (
        <li key={e.address}>
          <p className={`mono-label text-[0.65rem] ${tone === "dark" ? "text-paper/60" : "text-brown"}`}>{e.label}</p>
          <a
            href={`mailto:${e.address}`}
            className={`link-draw mt-1.5 inline-block [overflow-wrap:anywhere] ${size === "lg" ? "text-lg" : ""}`}
          >
            {e.address}
          </a>
        </li>
      ))}
    </ul>
  );
}
