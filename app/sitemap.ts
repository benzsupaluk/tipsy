import type { MetadataRoute } from "next";
import { GAME_IDS, SETUP_HREF } from "@/lib/games";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...GAME_IDS.map((game) => ({
      url: `${SITE_URL}${SETUP_HREF[game]}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
