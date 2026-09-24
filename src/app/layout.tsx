import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import { ViewTransition } from "react";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RouteLine } from "@/components/layout/RouteLine";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
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
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
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
      className={`${fraunces.variable} ${schibsted.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-sm bg-ink px-4 py-3 text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <RouteLine />
        <ViewTransition name="page" default="page-swap">
          <div>
            <main id="main" className="relative z-10">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ViewTransition>
      </body>
    </html>
  );
}
