import { ogSize, renderOg } from "@/og/render";

export const alt = "The journey · Spiceman Exports";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "The journey", title: "From soil to", accent: "ship.", color: "#1D6A2C" });
}
