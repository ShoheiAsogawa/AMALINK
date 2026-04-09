import { createClient } from "microcms-js-sdk";
import type { MicroCMSListContent, MicroCMSQueries } from "microcms-js-sdk";

export type News = {
  title: string;
  content: string;
  category: string[];
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
