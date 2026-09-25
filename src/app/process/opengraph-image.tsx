import { ogSize, renderOg } from "@/og/render";

export const alt = "Process and quality · Spiceman Exports";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ eyebrow: "Process and quality", title: "From soil to", accent: "shipment.", color: "#1D6A2C" });
}
