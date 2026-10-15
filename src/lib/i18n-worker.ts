/**
 * 多言語ページを Worker で作る。/en/<path> へのアクセスでは、日本語の <path> を内部で作り、
 * 文章・alt・title・meta を D1 にある訳で置き換えて返す。訳がまだ無い文章は日本語のまま出し、
 * 裏（waitUntil）で DeepSeek に訳させて D1 に保存する。キーは元の文章の SHA-256 なので、
 * 元の文章が変われば自動で訳し直しになる。
 */
import { DEFAULT_LOCALE, GLOSSARY, LOCALES, isTranslatablePath, localizedPath, splitLocalePath, type LocaleDef } from "./i18n-config";


/* Workers ランタイムの HTMLRewriter（Next の型チェック用の最小限の宣言） */
type HrEl = {
  getAttribute(n: string): string | null;
  setAttribute(n: string, v: string): void;
  remove(): void;
  append(c: string, o?: { html: boolean }): void;
  onEndTag(f: () => void): void;
};
type HrText = { text: string; lastInTextNode: boolean; remove(): void; replace(c: string, o?: { html: boolean }): void };
type HrHandlers = { element?: (e: HrEl) => void; text?: (t: HrText) => void };
declare class HTMLRewriter {
  on(sel: string, h: HrHandlers): HTMLRewriter;
  onDocument(h: { text?: (t: HrText) => void }): HTMLRewriter;
  transform(r: Response): Response;
}

type D1Stmt = { bind(...v: unknown[]): D1Stmt; all<T>(): Promise<{ results: T[] }>; run(): Promise<unknown> };
type D1 = { prepare(q: string): D1Stmt; batch(s: D1Stmt[]): Promise<unknown> };
export type I18nEnv = { I18N_DB?: D1; DEEPSEEK_API_KEY?: string };
type Ctx = { waitUntil(p: Promise<unknown>): void };
type Fetcher = (req: Request) => Promise<Response>;

const JP = /[\u3040-\u30ff\u3400-\u9fff\uff01-\uff60]/;
const ATTRS = ["alt", "title", "aria-label", "placeholder"] as const;
const META_SEL =
  'meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"], meta[property="og:site_name"]';
const SKIP_SEL = "script, style, noscript, template, [data-no-translate]";
const MEM = new Map<string, string>(); // isolate 内の小さなキャッシュ

function decode(s: string): string {
  return s
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function split(s: string): [string, string, string] {
  const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  return [m[1], m[2], m[3]];
}
async function hash(text: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function ensureSchema(db: D1) {
  await db.batch([
    db.prepare(
      "CREATE TABLE IF NOT EXISTS i18n_translations (locale TEXT NOT NULL, hash TEXT NOT NULL, src TEXT NOT NULL, tr TEXT NOT NULL, updated_at INTEGER NOT NULL, PRIMARY KEY (locale, hash))",
    ),
    db.prepare("CREATE TABLE IF NOT EXISTS i18n_locks (k TEXT PRIMARY KEY, at INTEGER NOT NULL)"),
  ]);
}

async function lookup(db: D1 | undefined, locale: string, texts: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const need: { t: string; h: string }[] = [];
  for (const t of new Set(texts)) {
    const m = MEM.get(`${locale}\u0000${t}`);
    if (m) out.set(t, m);
    else need.push({ t, h: await hash(t) });
  }
  if (!db || need.length === 0) return out;
  const byHash = new Map(need.map((n) => [n.h, n.t]));
  const hashes = [...byHash.keys()];
  const chunks: string[][] = [];
  for (let i = 0; i < hashes.length; i += 90) chunks.push(hashes.slice(i, i + 90));
  try {
    const res = await Promise.all(
      chunks.map((c) =>
        db
          .prepare(`SELECT hash, tr FROM i18n_translations WHERE locale = ? AND hash IN (${c.map(() => "?").join(",")})`)
          .bind(locale, ...c)
          .all<{ hash: string; tr: string }>(),
      ),
    );
    for (const r of res)
      for (const row of r.results) {
        const t = byHash.get(row.hash);
        if (t) {
          out.set(t, row.tr);
          if (MEM.size > 8000) MEM.clear();
          MEM.set(`${locale}\u0000${t}`, row.tr);
        }
      }
  } catch {
    // テーブルがまだ無いなど。日本語のまま出す。
  }
  return out;
}

function glossaryFor(l: LocaleDef): string {
  return GLOSSARY.map((g) => `${g.ja} => ${g.byLocale?.[l.code] ?? g.default}`).join("\n");
}

async function deepseek(apiKey: string, l: LocaleDef, items: string[]): Promise<string[] | null> {
  const input: Record<string, string> = {};
  items.forEach((t, i) => (input[String(i)] = t));
  const system = [
    `You localize a Japanese small-business website into ${l.promptName}. The company is AMALINK LLC, based on Amami Oshima (Kagoshima, Japan); it offers AI consulting, web production, design, system development and GEO/SEO.`,
    `Translate every value naturally, as a native ${l.promptName} copywriter would write for this website. Keep the meaning; do not add or drop information. Keep short UI labels short. Keep numbers, URLs, e-mail addresses and Latin-script product names as they are. Do not use Japanese characters in the output unless a value is a proper noun with no common romanization.`,
    `Always use these fixed renderings:\n${glossaryFor(l)}`,
    `Reply with only a JSON object with exactly the same keys, each value being the translation.`,
  ].join("\n\n");
  try {
    const r = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(input) },
        ],
      }),
      signal: AbortSignal.timeout(28000),
    });
    if (!r.ok) {
      console.error("i18n deepseek", r.status);
      return null;
    }
    const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const obj = JSON.parse(j.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>;
    return items.map((_, i) => (typeof obj[String(i)] === "string" ? String(obj[String(i)]).trim() : ""));
  } catch (e) {
    console.error("i18n deepseek failed", String(e));
    return null;
  }
}

/** 足りない訳を作って D1 に入れる（同じページを同時に何度も訳さないよう、2分のロック付き）。 */
export async function translateMissing(env: I18nEnv, l: LocaleDef, lockKey: string, texts: string[]): Promise<number> {
  const db = env.I18N_DB;
  const key = env.DEEPSEEK_API_KEY?.trim();
  if (!db || !key || texts.length === 0) return 0;
  await ensureSchema(db);
  const now = Date.now();
  await db.prepare("DELETE FROM i18n_locks WHERE at < ?").bind(now - 120000).run();
  const got = (await db.prepare("INSERT OR IGNORE INTO i18n_locks (k, at) VALUES (?, ?) RETURNING k").bind(lockKey, now).all()) as {
    results: unknown[];
  };
  if (got.results.length === 0) return 0;
  const batches: string[][] = [];
  let cur: string[] = [];
  let len = 0;
  for (const t of texts) {
    if (cur.length >= 40 || len + t.length > 5000) {
      batches.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(t);
    len += t.length;
  }
  if (cur.length) batches.push(cur);
  let saved = 0;
  for (let i = 0; i < batches.length; i += 6) {
    const group = batches.slice(i, i + 6);
    const results = await Promise.all(group.map((b) => deepseek(key, l, b)));
    const stmts: D1Stmt[] = [];
    for (let g = 0; g < group.length; g++) {
      const out = results[g];
      if (!out) continue;
      for (let k = 0; k < group[g].length; k++) {
        const tr = out[k];
        if (!tr) continue;
        stmts.push(
          db
            .prepare("INSERT OR REPLACE INTO i18n_translations (locale, hash, src, tr, updated_at) VALUES (?, ?, ?, ?, ?)")
            .bind(l.code, await hash(group[g][k]), group[g][k], tr, Date.now()),
        );
      }
    }
    for (let s = 0; s < stmts.length; s += 50) await db.batch(stmts.slice(s, s + 50));
    saved += stmts.length;
  }
  await db.prepare("DELETE FROM i18n_locks WHERE k = ?").bind(lockKey).run();
  return saved;
}

function localizeHref(href: string, code: string): string | null {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const u = new URL(href, "https://x.invalid");
  if (!isTranslatablePath(u.pathname) || splitLocalePath(u.pathname).locale) return null;
  return localizedPath(u.pathname, code) + u.search + u.hash;
}

function hreflangTags(origin: string, basePath: string): string {
  const tags = [`<link rel="alternate" hreflang="${DEFAULT_LOCALE.hreflang}" href="${origin}${basePath}">`];
  for (const l of LOCALES) tags.push(`<link rel="alternate" hreflang="${l.hreflang}" href="${origin}${localizedPath(basePath, l.code)}">`);
  tags.push(`<link rel="alternate" hreflang="x-default" href="${origin}${basePath}">`);
  return tags.join("");
}

const CLIENT = `(function(){var D=window.__I18N__||{},L=document.documentElement.getAttribute("data-locale"),P="/"+L,J=/[\\u3040-\\u30ff\\u3400-\\u9fff]/;
function tr(s){var m=s.match(/^(\\s*)([\\s\\S]*?)(\\s*)$/),k=m[2];if(!k||!J.test(k)||!D[k])return null;return m[1]+D[k]+m[3]}
function sk(n){return n.closest&&n.closest("script,style,noscript,[data-no-translate]")}
function dt(t){var p=t.parentElement;if(!p||sk(p))return;var r=tr(t.nodeValue);if(r!==null&&r!==t.nodeValue)t.nodeValue=r}
function de(e){if(sk(e))return;["alt","title","aria-label","placeholder"].forEach(function(a){var v=e.getAttribute(a);if(v){var r=tr(v);if(r!==null&&r!==v)e.setAttribute(a,r)}})}
function wk(r){if(!r)return;if(r.nodeType===3)return dt(r);if(r.nodeType!==1)return;de(r);var w=document.createTreeWalker(r,5),n;while((n=w.nextNode()))n.nodeType===3?dt(n):de(n)}
new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==="characterData")dt(m.target);else if(m.type==="attributes")de(m.target);else m.addedNodes.forEach(wk)})}).observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["alt","title","aria-label","placeholder"]});
if(document.readyState!=="loading")wk(document.body);else document.addEventListener("DOMContentLoaded",function(){wk(document.body)});
window.addEventListener("click",function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target&&e.target.closest&&e.target.closest("a[href]");if(!a||a.closest("[data-no-translate]")||a.target==="_blank"||a.hasAttribute("download"))return;var u=new URL(a.getAttribute("href"),location.href);if(u.origin!==location.origin||/^\\/(api|_next)\\//.test(u.pathname))return;var p=u.pathname;if(!(p===P||p.indexOf(P+"/")===0))p=p==="/"?P:P+p;var to=p+u.search+u.hash;e.preventDefault();e.stopImmediatePropagation();if(p===location.pathname&&u.hash){location.hash=u.hash;return}location.href=to},true);
})();`;

/** 日本語ページにも hreflang を足す */
export function addHreflangToJa(res: Response, origin: string, basePath: string): Response {
  if (LOCALES.length === 0) return res;
  return new HTMLRewriter()
    .on("head", { element: (e) => void e.append(hreflangTags(origin, basePath), { html: true }) })
    .transform(res);
}

export async function handleLocalized(request: Request, env: I18nEnv, ctx: Ctx, next: Fetcher): Promise<Response | null> {
  const url = new URL(request.url);
  const { locale, basePath } = splitLocalePath(url.pathname);
  if (!locale) return null;
  if (url.pathname === `/${locale.code}/`) return Response.redirect(`${url.origin}/${locale.code}${url.search}`, 308);
  if (!isTranslatablePath(basePath)) return null;

  const jaUrl = new URL(basePath + url.search, url.origin);
  const isRsc = request.headers.get("RSC") === "1" || url.searchParams.has("_rsc");
  const jaReq = new Request(jaUrl.toString(), request);
  const res = await next(jaReq);
  if (isRsc) return res;
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("Location");
    if (loc) {
      const lu = new URL(loc, url.origin);
      if (lu.origin === url.origin) {
        const h = new Headers(res.headers);
        h.set("Location", localizedPath(lu.pathname, locale.code) + lu.search + lu.hash);
        return new Response(null, { status: res.status, headers: h });
      }
    }
    return res;
  }
  const ct = res.headers.get("Content-Type") ?? "";
  if (!ct.includes("text/html")) return res;
  const html = await res.text();

  // 1回目: 訳す文章を集める
  const texts: string[] = [];
  let skip = 0;
  let buf = "";
  const collectAttr = (v: string | null) => {
    if (!v) return;
    const core = split(decode(v))[1];
    if (core && JP.test(core)) texts.push(core);
  };
  await new HTMLRewriter()
    .on(SKIP_SEL, { element: (e) => { skip++; e.onEndTag(() => void skip--); } })
    .on("*", { element: (e) => { if (!skip) ATTRS.forEach((a) => collectAttr(e.getAttribute(a))); } })
    .on(META_SEL, { element: (e) => collectAttr(e.getAttribute("content")) })
    .onDocument({
      text: (t) => {
        buf += t.text;
        if (!t.lastInTextNode) return;
        const full = buf;
        buf = "";
        if (skip) return;
        const core = split(decode(full))[1];
        if (core && JP.test(core)) texts.push(core);
      },
    })
    .transform(new Response(html, { headers: { "Content-Type": "text/html" } }))
    .text();

  const unique = [...new Set(texts)];
  const dict = await lookup(env.I18N_DB, locale.code, unique);
  const missing = unique.filter((t) => !dict.has(t));
  if (missing.length && env.I18N_DB && env.DEEPSEEK_API_KEY) {
    ctx.waitUntil(translateMissing(env, locale, `${locale.code}:${basePath}`, missing).catch((e) => console.error("i18n", String(e))));
  }
  const trOf = (raw: string) => {
    const [a, core, b] = split(decode(raw));
    const tr = core && dict.get(core);
    return tr ? a + tr + b : null;
  };

  // 2回目: 置き換え
  const origin = url.hostname.endsWith("amalink.co.jp") ? "https://amalink.co.jp" : url.origin;
  const seed: Record<string, string> = {};
  for (const [k, v] of dict) seed[k] = v;
  const seedJson = JSON.stringify(seed).replace(/</g, "\\u003c");
  skip = 0;
  buf = "";
  const out = new HTMLRewriter()
    .on("html", { element: (e) => { e.setAttribute("lang", locale.htmlLang); e.setAttribute("data-locale", locale.code); } })
    .on(SKIP_SEL, { element: (e) => { skip++; e.onEndTag(() => void skip--); } })
    .on("*", {
      element: (e) => {
        if (skip) return;
        for (const a of ATTRS) {
          const v = e.getAttribute(a);
          const tr = v && trOf(v);
          if (tr) e.setAttribute(a, tr);
        }
      },
    })
    .on("a[href]", {
      element: (e) => {
        if (skip) return;
        const to = localizeHref(e.getAttribute("href") ?? "", locale.code);
        if (to) e.setAttribute("href", to);
      },
    })
    .on(META_SEL, { element: (e) => { const tr = trOf(e.getAttribute("content") ?? ""); if (tr) e.setAttribute("content", tr); } })
    .on('meta[property="og:locale"]', { element: (e) => e.setAttribute("content", locale.htmlLang.replace("-", "_")) })
    .on('link[rel="canonical"]', { element: (e) => e.setAttribute("href", origin + localizedPath(basePath, locale.code)) })
    .on('meta[property="og:url"]', { element: (e) => e.setAttribute("content", origin + localizedPath(basePath, locale.code)) })
    .on('link[rel="alternate"][hreflang]', { element: (e) => e.remove() })
    .on("head", {
      element: (e) => {
        e.append(hreflangTags(origin, basePath), { html: true });
        e.append(`<script>window.__I18N__=${seedJson};</script><script>${CLIENT}</script>`, { html: true });
      },
    })
    .onDocument({
      text: (t) => {
        buf += t.text;
        if (!t.lastInTextNode) {
          t.remove();
          return;
        }
        const full = buf;
        buf = "";
        if (skip) {
          t.replace(full, { html: true });
          return;
        }
        const tr = trOf(full);
        t.replace(tr ? escapeHtml(tr) : full, { html: true });
      },
    })
    .transform(new Response(html, { status: res.status, headers: res.headers }));

  const h = new Headers(out.headers);
  h.set("Content-Language", locale.htmlLang);
  h.delete("Content-Length");
  h.delete("ETag");
  if (missing.length) h.set("Cache-Control", "private, no-store");
  h.set("X-I18n", `${dict.size}/${unique.length}`);
  return new Response(out.body, { status: out.status, headers: h });
}
