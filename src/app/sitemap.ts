import type { MetadataRoute } from "next";
import { getNewsList, getArticlesList } from "@/lib/microcms";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/faq", "/articles", "/news", "/contact"] as const;

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path === "/faq"
          ? 0.9
          : path === "/articles"
            ? 0.85
            : 0.7,
  }));

  const newsEntries: MetadataRoute.Sitemap = [];
  const articleEntries: MetadataRoute.Sitemap = [];

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

  try {
    const { contents } = await getArticlesList({ limit: 100 });
    articleEntries.push(
      ...(contents ?? []).map((item) => ({
        url: absoluteUrl(`/articles/${item.slug ?? item.id}`),
        lastModified: new Date(item.updatedAt ?? item.publishedAt ?? item.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    );
  } catch {
    // articles API 未作成
  }

  return [...staticEntries, ...articleEntries, ...newsEntries];
}
