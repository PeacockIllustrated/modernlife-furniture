import type { MetadataRoute } from "next";
import { rooms } from "@/content/landing";
import { staticPieces } from "@/content/pieces";

const BASE = "https://modernlifefurniture.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/collection",
    "/restoration",
    "/sell",
    "/enquire",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date("2026-07-05"),
  }));

  const categories = rooms
    .filter((r) => r.slug !== "restoration")
    .map((r) => ({
      url: `${BASE}/collection/${r.slug}`,
      lastModified: new Date("2026-07-05"),
    }));

  const pieces = staticPieces.map((p) => ({
    url: `${BASE}/piece/${p.slug}`,
    lastModified: new Date("2026-07-05"),
  }));

  return [...routes, ...categories, ...pieces];
}
