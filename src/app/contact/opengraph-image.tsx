import { ogSize, renderOg } from "@/og/render";

export const alt = "Get a quote · Spiceman Exports";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Get a quote", title: "Tell us what you need to", accent: "ship.", color: "#BF201B" });
}
