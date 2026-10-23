import type { MetadataRoute } from "next";
import { categoryPath, getCategoryIndex, getColumnList, getNewsList } from "@/lib/cms";
import { absoluteUrl, CONTENT_UPDATED } from "@/lib/seo";
import { isColumnCategoryId } from "@/lib/legacy-redirects";
import { DEFAULT_LOCALE, LOCALES, localizedPath } from "@/lib/i18n-config";

/**
 * CMS（amalink-cms）に記事が増えたら再デプロイなしで載るよう、ISR で定期的に作り直す。
 * 再生成は open-next.config.ts の memoryQueue（WORKER_SELF_REFERENCE）経由で行われる。
 */
export const revalidate = 60;

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
  const revised = new Date(CONTENT_UPDATED);
  const staticPaths = ["", ...SERVICE_PATHS, "/about", "/faq", "/news", "/column", "/contact"] as const;

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => {
    const isHome = path === "";
    const isHigh = HIGH_PRIORITY.has(path);
    return {
      url: absoluteUrl(path || "/"),
      lastModified: revised,
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

  const categoryEntries: MetadataRoute.Sitemap = [];
  try {
    const { categories } = await getCategoryIndex();
    categoryEntries.push(
      ...categories.filter((category) => !isColumnCategoryId(category.id)).map((category) => ({
        url: absoluteUrl(categoryPath(category.id)),
        lastModified: revised,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      })),
    );
  } catch {
    // categories API 未接続
  }

  return withLocales([...staticEntries, ...newsEntries, ...categoryEntries]);
}

/** 各URLに hreflang の対応先を付け、各言語版（/en/... など）のURLも足す。 */
function withLocales(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const origin = absoluteUrl("/").replace(/\/$/, "");
  const out: MetadataRoute.Sitemap = [];
  const localized: MetadataRoute.Sitemap = [];
  for (const e of entries) {
    const base = e.url.slice(origin.length) || "/";
    const languages: Record<string, string> = {
      [DEFAULT_LOCALE.hreflang]: absoluteUrl(base),
      "x-default": absoluteUrl(base),
    };
    for (const l of LOCALES) languages[l.hreflang] = absoluteUrl(localizedPath(base, l.code));
    out.push({ ...e, alternates: { languages } });
    for (const l of LOCALES) {
      localized.push({
        ...e,
        url: absoluteUrl(localizedPath(base, l.code)),
        priority: Math.max(0.1, Math.round(((e.priority ?? 0.5) - 0.2) * 100) / 100),
        alternates: { languages },
      });
    }
  }
  return [...out, ...localized];
}
