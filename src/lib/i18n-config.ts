/**
 * 多言語対応の設定。言語を増やすときは LOCALES に1行足すだけでよい。
 * 例: { code: "zh-hans", htmlLang: "zh-Hans", hreflang: "zh-Hans", label: "简体中文", promptName: "Simplified Chinese" }
 *     { code: "zh-hant", htmlLang: "zh-Hant", hreflang: "zh-Hant", label: "繁體中文", promptName: "Traditional Chinese (Taiwan)" }
 *     { code: "ko", htmlLang: "ko", hreflang: "ko", label: "한국어", promptName: "Korean" }
 * 日本語（元の文章）は / 、各言語は /<code>/<同じパス> で配信する。訳は Worker（src/lib/i18n-worker.ts）が DeepSeek で作り、KV に保存する。
 */
export type LocaleDef = {
  code: string;
  htmlLang: string;
  hreflang: string;
  label: string;
  promptName: string;
};

export const DEFAULT_LOCALE = { code: "ja", htmlLang: "ja", hreflang: "ja", label: "日本語" } as const;

export const LOCALES: readonly LocaleDef[] = [
  { code: "en", htmlLang: "en", hreflang: "en", label: "English", promptName: "English" },
];

/** 固有名詞の決まった訳（DeepSeek に必ず守らせる）。言語ごとに上書きしたいときは byLocale に足す。 */
export const GLOSSARY: { ja: string; default: string; byLocale?: Record<string, string> }[] = [
  { ja: "合同会社AMALINK", default: "AMALINK LLC" },
  { ja: "AMALINK", default: "AMALINK" },
  { ja: "奄美大島", default: "Amami Oshima" },
  { ja: "奄美群島", default: "Amami Islands" },
  { ja: "奄美市", default: "Amami City" },
  { ja: "奄美", default: "Amami" },
  { ja: "鹿児島県", default: "Kagoshima Prefecture" },
  { ja: "鹿児島", default: "Kagoshima" },
  { ja: "宇検村", default: "Uken Village" },
  { ja: "名瀬", default: "Naze" },
  { ja: "瀬戸内町", default: "Setouchi Town" },
  { ja: "龍郷町", default: "Tatsugo Town" },
  { ja: "くろうさ", default: "Kurousa" },
  { ja: "公式LINE", default: "LINE Official Account" },
  { ja: "GEO対策", default: "GEO (Generative Engine Optimization)" },
];

/** 訳さないパス（API・静的ファイルなど） */
export function isTranslatablePath(path: string): boolean {
  if (path.startsWith("/api") || path.startsWith("/_next") || path.startsWith("/cdn-cgi")) return false;
  if (/\.(xml|txt|json|png|jpe?g|webp|svg|ico|mp4|css|js|map|woff2?)$/i.test(path)) return false;
  return true;
}

/** "/en/about" → { locale: "en", basePath: "/about" }。日本語なら locale は null。 */
export function splitLocalePath(pathname: string): { locale: LocaleDef | null; basePath: string } {
  for (const l of LOCALES) {
    const p = `/${l.code}`;
    if (pathname === p || pathname.startsWith(`${p}/`)) {
      return { locale: l, basePath: pathname.slice(p.length) || "/" };
    }
  }
  return { locale: null, basePath: pathname };
}

export function localizedPath(basePath: string, code: string): string {
  if (code === DEFAULT_LOCALE.code) return basePath || "/";
  return basePath === "/" || basePath === "" ? `/${code}` : `/${code}${basePath}`;
}
