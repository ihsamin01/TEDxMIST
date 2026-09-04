import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/event";

/**
 * Keeps the registrations table out of search results, and points crawlers at
 * the sitemap so they do not have to guess what exists.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
