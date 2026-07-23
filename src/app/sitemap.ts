import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/microcms";
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
  const staticPaths = ["", ...SERVICE_PATHS, "/faq", "/news", "/contact"] as const;

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
              : path === "/faq"
                ? 0.8
                : 0.7,
    };
  });

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
