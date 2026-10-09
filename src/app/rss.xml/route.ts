import { getColumnList, getNewsList, postHref } from "@/lib/cms";
import { absoluteUrl, buildArticleDescription, LEGAL_NAME } from "@/lib/seo";

/** CMS の記事を再デプロイなしで反映するため、/news と同じ60秒間隔で作り直す */
export const revalidate = 60;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  // お知らせとコラムを新しい順にまとめる
  const [{ contents: news }, { contents: columns }] = await Promise.all([
    getNewsList({ limit: 50 }),
    getColumnList({ limit: 50 }),
  ]);
  const contents = [...(news ?? []), ...(columns ?? [])]
    .sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt))
    .slice(0, 50);
  const items = contents
    .map((item) => {
      const url = absoluteUrl(postHref(item));
      const date = new Date(item.publishedAt ?? item.createdAt).toUTCString();
      return [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `<pubDate>${date}</pubDate>`,
        `<description>${escapeXml(buildArticleDescription(item))}</description>`,
        "</item>",
      ].join("");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(`お知らせ | ${LEGAL_NAME}`)}</title>
<link>${escapeXml(absoluteUrl("/news"))}</link>
<atom:link href="${escapeXml(absoluteUrl("/rss.xml"))}" rel="self" type="application/rss+xml"/>
<description>${escapeXml(`${LEGAL_NAME}のお知らせ・記事`)}</description>
<language>ja</language>
${items}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
