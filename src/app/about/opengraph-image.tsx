import { ogSize, renderOg } from "@/og/render";

export const alt = "About · Spiceman Exports";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "About", title: "Traded from", accent: "Pondicherry.", color: "#1D6A2C" });
}
