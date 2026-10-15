/**
 * Worker の入口。OpenNext が作る .open-next/worker.js の前に、古いURLの転送（308・1回）を挟む。
 * wrangler.jsonc の main がこのファイルを指す。
 */
import { legacyRedirectPath } from "./src/lib/legacy-redirects";
import { addHreflangToJa, handleLocalized, type I18nEnv } from "./src/lib/i18n-worker";
import { isTranslatablePath, splitLocalePath } from "./src/lib/i18n-config";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- ビルド前は無いファイルなので expect-error は使えない
// @ts-ignore -- opennextjs-cloudflare build で生成されるファイル
import { default as handler } from "./.open-next/worker.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- 同上（Durable Object のクラスをそのまま出す）
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

type FetchHandler = { fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> };

const worker = {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    if (request.method === "GET" || request.method === "HEAD") {
      const url = new URL(request.url);
      const to = legacyRedirectPath(url);
      if (to) {
        return new Response(null, {
          status: 308,
          headers: { Location: new URL(to, url.origin).toString() },
        });
      }
    }
    const next = (req: Request) => (handler as FetchHandler).fetch(req, env, ctx);
    if (request.method === "GET" || request.method === "HEAD") {
      const localized = await handleLocalized(request, env as I18nEnv, ctx as { waitUntil(p: Promise<unknown>): void }, next);
      if (localized) return localized;
      const url = new URL(request.url);
      const res = await next(request);
      const isRsc = request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
      if (!isRsc && !splitLocalePath(url.pathname).locale && isTranslatablePath(url.pathname) && (res.headers.get("Content-Type") ?? "").includes("text/html")) {
        return addHreflangToJa(res, url.hostname.endsWith("amalink.co.jp") ? "https://amalink.co.jp" : url.origin, url.pathname);
      }
      return res;
    }
    return next(request);
  },
};

export default worker;
