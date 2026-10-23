import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
import { siteUrl, indexable } from "@/lib/config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: indexable
      ? {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/admin",
            "/api",
            "/danke",
            "/einwilligung",
            "/einstellungen",
            "/*?",
          ],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
