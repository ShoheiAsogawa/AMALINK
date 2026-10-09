import type { MetadataRoute } from "next";
import { getColumnList, getNewsList } from "@/lib/cms";
import { absoluteUrl } from "@/lib/seo";

const SERVICE_PATHS = [
  "/ai-consulting",
  "/system-development",
  "/web-production",
  "/design",
  "/geo-seo",
  "/ai-avatar-chatbot",
] as const;

const HIGH_PRIORITY = new Set<string>([
  "",
  "/ai-consulting",
  "/web-production",
  "/design",
  "/geo-seo",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = ["", ...SERVICE_PATHS, "/about", "/faq", "/news", "/column", "/contact"] as const;

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => {
    const isHome = path === "";
    const isHigh = HIGH_PRIORITY.has(path);
    return {
      url: absoluteUrl(path || "/"),
      lastModified: now,
      changeFrequency: isHome || isHigh ? "weekly" : "monthly",
      priority: isHome
        ? 1
        : path === "/ai-consulting"
          ? 0.98
          : isHigh
            ? 0.95
            : (SERVICE_PATHS as readonly string[]).includes(path)
              ? 0.9
              : path === "/about" || path === "/faq"
                ? 0.8
                : 0.7,
    };
  });

  const newsEntries: MetadataRoute.Sitemap = [];

  try {
    const [{ contents }, { contents: columns }] = await Promise.all([
      getNewsList({ limit: 100 }),
      getColumnList({ limit: 100 }),
    ]);
    newsEntries.push(
      ...(contents ?? []).map((item) => ({
        url: absoluteUrl(`/news/${item.slug ?? item.id}`),
        lastModified: new Date(item.updatedAt ?? item.publishedAt ?? item.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...(columns ?? []).map((item) => ({
        url: absoluteUrl(`/column/${item.slug ?? item.id}`),
        lastModified: new Date(item.updatedAt ?? item.publishedAt ?? item.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    );
  } catch {
    // news API 未接続
  }

  return [...staticEntries, ...newsEntries];
}
