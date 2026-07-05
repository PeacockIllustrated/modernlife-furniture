import type { MetadataRoute } from "next";

const BASE = "https://modernlifefurniture.co.uk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
