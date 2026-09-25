import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import { ViewTransition } from "react";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RouteLine } from "@/components/layout/RouteLine";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { NavigationWatcher } from "@/components/motion/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

// Italic only styles single accent words, so it isn't preloaded.
const frauncesItalic = Fraunces({
  variable: "--font-fraunces-italic",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["italic"],
  display: "swap",
  preload: false,
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: spices and pulses, wholesale and export from Pondicherry`,
    template: `%s · ${site.name}`,
  },
  ...pageMeta({ description: site.description, path: "/" }),
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf7ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${schibsted.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh">
        <JsonLd />
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-sm bg-ink px-4 py-3 text-paper"
        >
          Skip to content
        </a>
        <NavigationWatcher />
        <MotionRoot />
        <SiteHeader />
        <RouteLine />
        <ViewTransition name="page" default="page-swap">
          {/* Clipped here rather than on body: body overflow propagates to the
              viewport and would not stop mobile browsers widening the page. */}
          <div className="overflow-x-clip">
            <main id="main" className="relative z-10">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ViewTransition>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
