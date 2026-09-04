import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/event";

/**
 * The list of pages worth indexing.
 *
 * Search engines find a site by following links to it, and nothing links here
 * yet, so this exists to be handed to Google Search Console directly. /admin
 * is left out on purpose, and robots.txt blocks it as well.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/register`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
