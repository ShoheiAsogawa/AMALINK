/**
 * 本番では .env に NEXT_PUBLIC_SITE_URL（末尾スラッシュなし）を必ず設定してください。
 * 例: https://www.example.com
 */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const origin = getSiteOrigin();
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${prefix}${p}`;
}

export function stripHtmlToDescription(html: string, maxLen = 160): string {
  const text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
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
  "合同会社AMALINK（AMALINK）は、鹿児島県奄美大島を拠点にホームページ制作・システム開発・デザイン・GEO対策を行うデジタル支援会社です。島内外・全国の事業者向けに、AIに引用されやすいWeb設計と伴走型サポートを提供します。";

export const DEFAULT_TITLE = `${LEGAL_NAME}（${SITE_NAME}）｜奄美大島のウェブ制作・システム開発・GEO対策`;
