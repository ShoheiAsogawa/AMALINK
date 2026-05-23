import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/microcms";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/faq", "/news", "/contact"] as const;

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/faq" ? 0.9 : 0.7,
  }));

  const newsEntries: MetadataRoute.Sitemap = [];

  try {
    const { contents } = await getNewsList({ limit: 100 });
    newsEntries.push(
      ...(contents ?? []).map((item) => ({
        url: absoluteUrl(`/news/${item.slug ?? item.id}`),
        lastModified: new Date(item.updatedAt ?? item.publishedAt ?? item.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    );
  } catch {
    // news API 未接続
  }

  return [...staticEntries, ...newsEntries];
}
