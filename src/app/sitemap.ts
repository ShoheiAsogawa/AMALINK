import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/microcms";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/news", "/contact"] as const;

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const { contents } = await getNewsList({ limit: 100 });
    const newsEntries: MetadataRoute.Sitemap = contents.map((item) => ({
      url: absoluteUrl(`/news/${item.slug ?? item.id}`),
      lastModified: new Date(item.updatedAt ?? item.publishedAt ?? item.createdAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
    return [...staticEntries, ...newsEntries];
  } catch {
    return staticEntries;
  }
}
