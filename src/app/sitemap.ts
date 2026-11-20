import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/** Home, support and credits (brief §14). The campaign variants point their canonical at "/", so they're left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/support`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/credits`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
