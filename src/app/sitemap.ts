import type { MetadataRoute } from "next";
import { OPPORTUNITIES } from "@/data/opportunities";
import { slugify } from "@/lib/slug";

const BASE_URL = "https://theblueprintproject.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/mission`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const opportunityPages: MetadataRoute.Sitemap = OPPORTUNITIES.map((o) => ({
    url: `${BASE_URL}/opportunity/${slugify(o.name)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...opportunityPages];
}
