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

function getClient() {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) {
    return null;
  }

  return createClient({ serviceDomain, apiKey });
}

const EMPTY_LIST = { contents: [] as News[], totalCount: 0, offset: 0, limit: 0 };

export async function getNewsList(queries?: MicroCMSQueries) {
  const client = getClient();
  if (!client) return EMPTY_LIST;

  return client.getList<News>({
    endpoint: "news",
    queries: { orders: "-publishedAt", ...queries },
  });
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
