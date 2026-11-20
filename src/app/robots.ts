import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/** /admin is never indexed (admin brief §4.4); it also sends noindex itself. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    host: SITE.url,
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
