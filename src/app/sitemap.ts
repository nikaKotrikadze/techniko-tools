import type { MetadataRoute } from "next";
import { getCategories, getPublishedTools } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, categories] = await Promise.all([getPublishedTools(), getCategories()]);
  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...categories.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...tools.map((t) => ({ url: `${SITE_URL}/tools/${t.slug}`, lastModified: t.created_at, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${SITE_URL}/submit`, priority: 0.3 },
    { url: `${SITE_URL}/advertise`, priority: 0.3 },
  ];
}
