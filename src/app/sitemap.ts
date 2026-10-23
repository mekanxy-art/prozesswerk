import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
import { pages, articles } from "@/lib/content";
import { siteUrl, indexable } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return indexable
    ? [
        "",
        ...Object.keys(pages),
        "kontakt",
        "termin",
        "faq",
        "wissen",
        ...articles.map((a) => `wissen/${a.slug}`),
      ].map((p) => ({
        url: new URL(`/${p}`, siteUrl).href,
        ...(p.startsWith("wissen/") ? { lastModified: "2026-10-17" } : {}),
      }))
    : [];
}
