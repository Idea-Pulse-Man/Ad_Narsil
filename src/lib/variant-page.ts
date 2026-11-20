import type { Metadata } from "next";

/** Metadata for a campaign variant (brief §8): its own title and share image, canonical pointing at "/". */
export function variantMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { type: "website", siteName: "Narsil", locale: "en_US", title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}
