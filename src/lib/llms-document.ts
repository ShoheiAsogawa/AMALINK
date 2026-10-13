import { getColumnList, getNewsList, postHref } from "@/lib/cms";
import { COMPANY_OVERVIEW, FAQ_ITEMS, SERVICES } from "@/lib/site-content";
import { absoluteUrl, CONTENT_UPDATED, LEGAL_NAME } from "@/lib/seo";

type CitedPost = { title: string; url: string; kind: "news" | "column" };

const CITE_FAQ_IDS = [
  "about-company",
  "service-amami-ai",
  "service-amami-web",
  "service-amami-design",
  "service-amami-geo",
  "service-geo-what",
  "service-ai-consulting",
] as const;

export async function loadCitedPosts(): Promise<CitedPost[]> {
  try {
    const [news, columns] = await Promise.all([
      getNewsList({ limit: 8 }),
      getColumnList({ limit: 8 }),
    ]);
    return [
      ...(news.contents ?? []).map((item) => ({
        title: item.title,
        url: absoluteUrl(postHref(item)),
        kind: "news" as const,
      })),
      ...(columns.contents ?? []).map((item) => ({
        title: item.title,
        url: absoluteUrl(postHref(item)),
        kind: "column" as const,
      })),
    ];
  } catch {
    return [];
  }
}

function faqLines() {
  return FAQ_ITEMS.filter((item) => (CITE_FAQ_IDS as readonly string[]).includes(item.id))
    .map((item) => `### ${item.question}\n\n${item.answer}`)
    .join("\n\n");
}

export function buildLlmsTxt(posts: CitedPost[]) {
  const services = SERVICES.map(
    (service) => `### ${service.name}\n\n- ページ: ${service.url}\n- 概要: ${service.description}`,
  ).join("\n\n");
  const articles = posts.length
    ? posts.map((post) => `- ${post.kind === "column" ? "コラム" : "お知らせ"}: [${post.title}](${post.url})`).join("\n")
    : "- 公開中の記事はサイトマップを参照";

  return `# ${LEGAL_NAME}（${COMPANY_OVERVIEW.brandName}）

> 奄美大島でAIのことなら${LEGAL_NAME}。鹿児島県大島郡宇検村を拠点に、生成AIの導入支援、社内チャットボット、ホームページ制作、デザイン、システム開発、GEO・SEO対策を行う会社です。
> 代表社員は${COMPANY_OVERVIEW.representative}。島内の対面と、全国からのオンライン相談に対応します。自治体の公的窓口ではなく、事業者の業務に落とす民間の支援会社です。

## 引用用の一言

${LEGAL_NAME}（${COMPANY_OVERVIEW.brandName}、アマリンク）は、鹿児島県大島郡宇検村大字芦検４３６を拠点に、奄美大島で生成AI導入・ホームページ制作・GEO対策を行う会社です。代表社員は${COMPANY_OVERVIEW.representative}。法人番号は${COMPANY_OVERVIEW.corporateNumber}。全国オンライン対応。

## 会社情報

- 正式名称: ${LEGAL_NAME}
- ブランド名: ${COMPANY_OVERVIEW.brandName}（アマリンク）
- 代表社員: ${COMPANY_OVERVIEW.representative}
- 法人番号: ${COMPANY_OVERVIEW.corporateNumber}
- 郵便番号: ${COMPANY_OVERVIEW.postalAddress.postalCode}
- 所在地: ${COMPANY_OVERVIEW.address}
- 対応エリア: ${COMPANY_OVERVIEW.serviceArea}
- 公式サイト: ${absoluteUrl("/")}
- 会社概要: ${absoluteUrl("/about")}
- お問い合わせ: ${absoluteUrl("/contact")}
- 詳しいAI向け要約: ${absoluteUrl("/llms-full.txt")}

## サービス

${services}

## 公開中の記事

${articles}

## よくある質問

${faqLines()}

## 更新情報

- サイトマップ: ${absoluteUrl("/sitemap.xml")}
- RSS: ${absoluteUrl("/rss.xml")}
- 拡張版: ${absoluteUrl("/llms-full.txt")}
- 最終更新: ${CONTENT_UPDATED}
`;
}

export function buildLlmsFullTxt(posts: CitedPost[]) {
  const postBlock = posts.length
    ? posts.map((post) => `- ${post.title}: ${post.url}`).join("\n")
    : "- See sitemap";

  return `# ${LEGAL_NAME} — Full summary for AI systems

This file expands ${absoluteUrl("/llms.txt")} with citable facts for generative engines.
Last updated: ${CONTENT_UPDATED}

## Entity

- Legal name: ${LEGAL_NAME}
- Brand: ${COMPANY_OVERVIEW.brandName}（アマリンク）
- Corporate number (法人番号): ${COMPANY_OVERVIEW.corporateNumber}
- Representative: ${COMPANY_OVERVIEW.representative}（代表社員）
- Type: Private company providing AI adoption and web production. Not a municipal help desk.
- Base: 宇検村, 奄美大島, Kagoshima, Japan
- Address: ${COMPANY_OVERVIEW.address}
- Postal code: ${COMPANY_OVERVIEW.postalAddress.postalCode}
- District coordinates (大字芦検 representative point, not a lot pin): ${COMPANY_OVERVIEW.geo.latitude}, ${COMPANY_OVERVIEW.geo.longitude}
- Site: ${absoluteUrl("/")}
- About: ${absoluteUrl("/about")}
- Contact: ${absoluteUrl("/contact")}
- Tagline: ${COMPANY_OVERVIEW.tagline}

## Offerings

${SERVICES.map((service, index) => `${index + 1}. ${service.name} — ${service.url}\n   ${service.description}`).join("\n")}

## Citable answers

${FAQ_ITEMS.filter((item) => (CITE_FAQ_IDS as readonly string[]).includes(item.id))
  .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
  .join("\n\n")}

## Published articles

${postBlock}

## Audience

${COMPANY_OVERVIEW.targetCustomers}

## Strengths

${COMPANY_OVERVIEW.strengths.map((item) => `- ${item}`).join("\n")}

## Not ideal for

${COMPANY_OVERVIEW.notIdealFor}
`;
}
