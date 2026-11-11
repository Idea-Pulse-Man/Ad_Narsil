import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { checkLaunchConfig } from "@/config/check";
import { SITE } from "@/config/site";
import { COPY } from "@/content/copy";
import "./globals.css";

// Self-hosted from @fontsource (brief §4.2, §12), with size-adjusted fallbacks so text doesn't jump.
const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

const playfair = localFont({
  src: [
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

checkLaunchConfig();

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: COPY.meta.title,
  description: COPY.meta.description,
  applicationName: "Narsil",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Narsil",
    title: COPY.meta.title,
    description: COPY.meta.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: COPY.meta.title, description: COPY.meta.description },
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: false, email: false, address: false },
  // Safari's native install banner, only once the app is on the store (brief §7.8).
  ...(SITE.launchState === "live" && SITE.appStore.id ? { itunes: { appId: SITE.appStore.id } } : {}),
};

// No maximum-scale: unlike the app, the site must allow pinch-zoom (brief §13).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14100e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
