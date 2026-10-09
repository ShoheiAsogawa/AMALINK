/** 本番の正規URL（末尾スラッシュなし） */
export const PRODUCTION_SITE_ORIGIN = "https://amalink.co.jp";

/**
 * NEXT_PUBLIC_SITE_URL（末尾スラッシュなし）があればそれを使う。
 * 未設定のまま本番ビルドしても sitemap / robots / canonical が localhost にならないよう、
 * production では PRODUCTION_SITE_ORIGIN にフォールバックする。
 */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") return PRODUCTION_SITE_ORIGIN;
  return "http://localhost:3000";
}

export function absoluteCover(coverUrl?: string | null): string | undefined {
  const value = coverUrl?.trim();
  if (!value) return undefined;
  if (value.startsWith("https://") || value.startsWith("http://")) return value;
  return absoluteUrl(value.startsWith("/") ? value : `/${value}`);
}

export function absoluteUrl(path: string): string {
  const origin = getSiteOrigin();
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${prefix}${p}`;
}

function decodeBasicEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export function htmlToPlainText(html: string): string {
  return decodeBasicEntities(
    html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<\/(p|h[1-6]|li|div|br)>|<br\s*\/?>/gi, "$& ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

export function stripHtmlToDescription(html: string, maxLen = 160): string {
  return truncate(htmlToPlainText(html), maxLen);
}

/** 本文の最初の n 文（。！？!? で区切る）。maxLen を超えたら切る */
export function firstSentences(html: string, count = 2, maxLen = 160): string {
  const text = htmlToPlainText(html);
  const sentences = text.match(/[^。！？!?]+[。！？!?]+|[^。！？!?]+$/g) ?? [];
  const picked = sentences
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, count)
    .join("");
  return truncate(picked || text, maxLen);
}

/**
 * 記事の meta description:
 * 1) CMS に description（手入力）があればそれを使う
 * 2) 無ければ本文の最初の2文（160字まで）
 */
export function buildArticleDescription(article: {
  description?: string | null;
  content: string;
  title: string;
}): string {
  const manual = article.description?.trim();
  if (manual) return truncate(manual, 160);
  return firstSentences(article.content, 2, 160) || article.title;
}

export const SITE_NAME = "AMALINK";
export const LEGAL_NAME = "合同会社AMALINK";
export const TAGLINE = "島のリズムで、未来をつくる。";

/** 公式LINEの友だち追加URL。`NEXT_PUBLIC_OFFICIAL_LINE_URL` が無いときはデフォルトを使う */
export function getOfficialLineAddFriendUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_OFFICIAL_LINE_URL?.trim();
  if (fromEnv) return fromEnv;
  return "https://lin.ee/Sr8rTSa";
}

export const DEFAULT_DESCRIPTION =
  "奄美大島でAIのことなら合同会社AMALINK（AMALINK）へ。生成AIの活用支援・社内チャットボット・AIコンサルティングから、ホームページ制作・システム開発・デザイン・GEO対策まで伴走します。鹿児島県奄美大島拠点・全国オンライン対応。";

export const DEFAULT_TITLE = `${LEGAL_NAME}（${SITE_NAME}）｜奄美大島でAIのことなら。ウェブ制作・導入支援`;
