import { createClient } from "microcms-js-sdk";
import type { MicroCMSListContent, MicroCMSQueries } from "microcms-js-sdk";

export type Category = {
  title: string;
} & MicroCMSListContent;

export type News = {
  title: string;
  content: string;
  category: Category | Category[];
  /** microCMS のカスタムフィールド（任意。未設定時は URL に id を使う） */
  slug?: string;
} & MicroCMSListContent;

/**
 * GEO向け記事（microCMS API: articles）
 * 管理画面で API「articles」を作成し、title / content / slug / description / category を設定してください。
 * description … メタ・冒頭要約（40〜60語推奨）。未設定時は本文から自動生成します。
 */
export type Article = {
  title: string;
  content: string;
  /** GEO向け：メタ description 兼 冒頭の核心回答 */
  description?: string;
  category?: Category | Category[];
  slug?: string;
} & MicroCMSListContent;

export function getContentCategories(
  category: Category | Category[] | undefined,
): Category[] {
  if (!category) return [];
  return Array.isArray(category) ? category : [category];
}

export function formatMicroCmsDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getClient() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) {
    return null;
  }

  return createClient({ serviceDomain, apiKey });
}

const EMPTY_LIST = { contents: [] as News[], totalCount: 0, offset: 0, limit: 0 };
const EMPTY_ARTICLE_LIST = {
  contents: [] as Article[],
  totalCount: 0,
  offset: 0,
  limit: 0,
};

export async function getNewsList(queries?: MicroCMSQueries) {
  const client = getClient();
  if (!client) return EMPTY_LIST;

  try {
    const result = await client.getList<News>({
      endpoint: "news",
      queries: { orders: "-publishedAt", ...queries },
    });
    return { ...result, contents: result.contents ?? [] };
  } catch {
    return EMPTY_LIST;
  }
}

export async function getNewsDetail(id: string, queries?: MicroCMSQueries) {
  const client = getClient();
  if (!client) throw new Error("microCMS is not configured");

  return client.getListDetail<News>({
    endpoint: "news",
    contentId: id,
    queries,
  });
}

/** URL セグメントが slug か id かに応じて1件取得（slug フィールド未設定APIでも id でフォールバック） */
export async function getNewsEntry(slugOrId: string, queries?: MicroCMSQueries) {
  const client = getClient();
  if (!client) throw new Error("microCMS is not configured");

  try {
    const bySlug = await client.getList<News>({
      endpoint: "news",
      queries: {
        filters: `slug[equals]${slugOrId}`,
        limit: 1,
        ...queries,
      },
    });
    const hit = bySlug.contents[0];
    if (hit) return hit;
  } catch {
    // slug フィールドが無い・フィルタ非対応など
  }

  return client.getListDetail<News>({
    endpoint: "news",
    contentId: slugOrId,
    queries,
  });
}

export async function getArticlesList(queries?: MicroCMSQueries) {
  const client = getClient();
  if (!client) return EMPTY_ARTICLE_LIST;

  try {
    const result = await client.getList<Article>({
      endpoint: "articles",
      queries: { orders: "-publishedAt", ...queries },
    });
    return { ...result, contents: result.contents ?? [] };
  } catch {
    return EMPTY_ARTICLE_LIST;
  }
}

export async function getArticleEntry(slugOrId: string, queries?: MicroCMSQueries) {
  const client = getClient();
  if (!client) throw new Error("microCMS is not configured");

  try {
    const bySlug = await client.getList<Article>({
      endpoint: "articles",
      queries: {
        filters: `slug[equals]${slugOrId}`,
        limit: 1,
        ...queries,
      },
    });
    const hit = bySlug.contents[0];
    if (hit) return hit;
  } catch {
    // slug フィールドが無い・フィルタ非対応など
  }

  return client.getListDetail<Article>({
    endpoint: "articles",
    contentId: slugOrId,
    queries,
  });
}
