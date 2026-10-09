/**
 * 古いURLを、1回の308で正しいURLへ送るための対応表（Worker の入口 worker.ts で使う）。
 *
 * next.config.ts の redirects は元のクエリ（?category=…）を転送先に付け足してしまうため、
 * クエリを捨てたい転送はここで扱う。
 */

/** コラム（kind=column）の一覧 */
export const COLUMN_LIST_PATH = "/column";

/**
 * 記事をコラムの種類へ移したカテゴリのID（旧IDを含む）。
 * これらのカテゴリ一覧は /column にまとめた。
 */
export const COLUMN_CATEGORY_IDS: readonly string[] = ["column", "web-production", "c16e18cb62"];

export function isColumnCategoryId(id: string): boolean {
  return COLUMN_CATEGORY_IDS.includes(id);
}

/** 転送が必要なら転送先のパス（クエリなし）を返す。不要なら null */
export function legacyRedirectPath(url: URL): string | null {
  const path = url.pathname.replace(/\/+$/, "") || "/";

  // /news?category=ID → カテゴリ一覧（コラムのカテゴリは /column）。?category= は付けない
  if (path === "/news" && url.searchParams.has("category")) {
    const id = (url.searchParams.get("category") ?? "").trim();
    if (!id) return "/news";
    if (isColumnCategoryId(id)) return COLUMN_LIST_PATH;
    if (/^[a-z0-9-]+$/.test(id)) return `/news/category/${id}`;
    return "/news";
  }

  // /news/category/column と旧ID → /column
  const match = path.match(/^\/news\/category\/([^/]+)$/);
  if (match) {
    let id = match[1];
    try {
      id = decodeURIComponent(id);
    } catch {
      // そのまま
    }
    if (isColumnCategoryId(id)) return COLUMN_LIST_PATH;
  }

  return null;
}
