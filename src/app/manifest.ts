import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Spiceman",
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#FBF7EE",
    theme_color: "#1D6A2C",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
