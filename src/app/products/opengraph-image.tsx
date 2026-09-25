import { ogSize, renderOg } from "@/og/render";

export const alt = "Products · Spiceman Exports";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Products", title: "The sorting", accent: "table.", color: "#B3201B" });
}
