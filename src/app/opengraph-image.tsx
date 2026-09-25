import { ogSize, renderOg } from "@/og/render";

export const alt = "Spiceman Exports: pure spices, from the soil to the ship";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Wholesale trade and export · Spices and pulses", title: "Pure spices, from the soil to the", accent: "ship." });
}
