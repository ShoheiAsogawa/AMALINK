import adminHtml from "./admin.html";
import seed from "../seed/news.json";

type SeedPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  categoryId: string;
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  coverUrl: string;
};

type SeedFile = {
  categories: { id: string; title: string; sortOrder: number }[];
  posts: SeedPost[];
};

interface D1Prepared {
  bind(...values: unknown[]): D1Prepared;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(sql: string): D1Prepared;
  batch(statements: D1Prepared[]): Promise<unknown>;
}

interface R2Object {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
}

interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer | ReadableStream | string,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<R2Object | null>;
}

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  ADMIN_PASSWORD?: string;
}

type PostRow = {
  id: string;
  slug: string;
  title: string;
  content_html: string;
  category_id: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_url: string | null;
  kind: string | null;
  cover_alt: string | null;
  description: string | null;
  category_title?: string | null;
};

const SESSION_COOKIE = "amalink_cms";
const SESSION_DAYS = 14;
const PUBLIC_SITE = "https://amalink.co.jp";
const data = seed as SeedFile;

let ready: Promise<void> | null = null;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    await ensureReady(env);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (url.pathname === "/robots.txt") {
      return new Response("User-agent: *\nDisallow: /\n", {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    if (url.pathname.startsWith("/media/")) {
      return serveMedia(env, decodeURIComponent(url.pathname.slice("/media/".length)));
    }

    if (url.pathname.startsWith("/api/public/")) {
      return publicApi(request, env, url);
    }

    if (url.pathname.startsWith("/api/")) {
      return adminApi(request, env, url);
    }

    if (url.pathname === "/" || url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
      return new Response(adminHtml, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

async function ensureReady(env: Env) {
  if (!ready) {
    ready = (async () => {
      await env.DB.batch([
        env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            sort_order INTEGER NOT NULL DEFAULT 0
          )`,
        ),
        env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            slug TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            content_html TEXT NOT NULL,
            category_id TEXT,
            status TEXT NOT NULL DEFAULT 'draft',
            published_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            cover_url TEXT,
            kind TEXT NOT NULL DEFAULT 'news',
            cover_alt TEXT,
            description TEXT
          )`,
        ),
        env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            expires_at TEXT NOT NULL
          )`,
        ),
        env.DB.prepare(
          `CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
          )`,
        ),
      ]);

      // カテゴリIDを変えたときの旧ID（転送用の別名）
      await env.DB.prepare(
        `CREATE TABLE IF NOT EXISTS category_aliases (
          old_id TEXT PRIMARY KEY,
          category_id TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`,
      ).run();

      // 既存DB向け: kind / cover_alt / description 列が無ければ足す（何度走っても安全）
      const columns = await env.DB.prepare("PRAGMA table_info(posts)").all<{ name: string }>();
      const names = new Set(columns.results.map((column) => column.name));
      const alters: D1Prepared[] = [];
      if (!names.has("kind")) alters.push(env.DB.prepare("ALTER TABLE posts ADD COLUMN kind TEXT NOT NULL DEFAULT 'news'"));
      if (!names.has("cover_alt")) alters.push(env.DB.prepare("ALTER TABLE posts ADD COLUMN cover_alt TEXT"));
      if (!names.has("description")) alters.push(env.DB.prepare("ALTER TABLE posts ADD COLUMN description TEXT"));
      if (alters.length) await env.DB.batch(alters);

      const count = await env.DB.prepare("SELECT COUNT(*) AS n FROM posts").first<{ n: number }>();
      if (!count || Number(count.n) === 0) {
        const statements: D1Prepared[] = [];
        for (const category of data.categories) {
          statements.push(
            env.DB.prepare(
              "INSERT INTO categories (id, title, sort_order) VALUES (?, ?, ?) ON CONFLICT(id) DO NOTHING",
            ).bind(category.id, category.title, category.sortOrder),
          );
        }
        for (const post of data.posts) {
          statements.push(
            env.DB.prepare(
              `INSERT INTO posts (
                id, slug, title, content_html, category_id, status, published_at, created_at, updated_at, cover_url
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO NOTHING`,
            ).bind(
              post.id,
              post.slug,
              post.title,
              post.content,
              post.categoryId,
              post.status,
              post.publishedAt,
              post.createdAt,
              post.updatedAt,
              post.coverUrl,
            ),
          );
        }
        if (statements.length) await env.DB.batch(statements);
      }
      await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(new Date().toISOString()).run();
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  await ready;
}

async function publicApi(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "GET") return json({ error: "method" }, 405);
  if (url.pathname === "/api/public/categories") {
    const categories = await env.DB.prepare(
      "SELECT id, title, sort_order AS sortOrder FROM categories ORDER BY sort_order, title",
    ).all<{ id: string; title: string; sortOrder: number }>();
    const aliases = await env.DB.prepare(
      "SELECT old_id AS oldId, category_id AS categoryId FROM category_aliases ORDER BY created_at",
    ).all<{ oldId: string; categoryId: string }>();
    return json({ categories: categories.results, aliases: aliases.results }, 200, publicHeaders());
  }
  const listKind = url.pathname === "/api/public/columns" ? "column" : url.pathname === "/api/public/news" ? "news" : "";
  const detail = url.pathname.match(/^\/api\/public\/(news|columns)\/([^/]+)$/);
  if (listKind) {
    const limit = clamp(Number(url.searchParams.get("limit") ?? 100), 1, 100);
    const requested = (url.searchParams.get("category") ?? "").trim();
    const category = requested ? await resolveCategoryId(env, requested) : null;
    const where = category ? "p.status = 'published' AND p.category_id = ?" : "p.status = 'published'";
    const binds = category ? [category] : [];
    const rows = await env.DB.prepare(
      `${postSelect()} WHERE ${where} AND p.kind = ? ORDER BY p.published_at DESC LIMIT ?`,
    )
      .bind(...binds, listKind, limit)
      .all<PostRow>();
    const total = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM posts p WHERE ${where} AND p.kind = ?`,
    )
      .bind(...binds, listKind)
      .first<{ n: number }>();
    return json(
      { contents: rows.results.map(toPublic), totalCount: Number(total?.n ?? rows.results.length) },
      200,
      publicHeaders(),
    );
  }
  if (detail) {
    const kind = detail[1] === "columns" ? "column" : "news";
    const key = decodeURIComponent(detail[2]);
    const row = await env.DB.prepare(
      `${postSelect()} WHERE p.status = 'published' AND p.kind = ? AND (p.slug = ? OR p.id = ?) LIMIT 1`,
    )
      .bind(kind, key, key)
      .first<PostRow>();
    if (!row) return json({ error: "not_found" }, 404, publicHeaders());
    return json(toPublic(row), 200, publicHeaders());
  }
  return json({ error: "not_found" }, 404, corsHeaders());
}

async function adminApi(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    const blocked = rejectCrossOrigin(request);
    if (blocked) return blocked;
  }

  if (url.pathname === "/api/auth/me" && request.method === "GET") {
    const authed = await isAuthed(request, env);
    const needsSetup = !(await hasPassword(env));
    return json({ ok: authed, needsSetup });
  }
  if (url.pathname === "/api/auth/setup" && request.method === "POST") {
    return setupPassword(request, env);
  }
  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    return login(request, env);
  }
  if (url.pathname === "/api/auth/logout" && request.method === "POST") {
    return logout(request, env);
  }

  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);

  if (url.pathname === "/api/posts" && request.method === "GET") return listPosts(env);
  if (url.pathname === "/api/posts" && request.method === "POST") return savePost(request, env, null);
  const postMatch = url.pathname.match(/^\/api\/posts\/([^/]+)$/);
  if (postMatch && request.method === "PUT") return savePost(request, env, decodeURIComponent(postMatch[1]));
  if (postMatch && request.method === "DELETE") return deletePost(env, decodeURIComponent(postMatch[1]));

  if (url.pathname === "/api/categories" && request.method === "GET") return listCategories(env);
  if (url.pathname === "/api/categories" && request.method === "POST") return createCategory(request, env);
  const categoryMatch = url.pathname.match(/^\/api\/categories\/([^/]+)$/);
  if (categoryMatch && request.method === "PUT") {
    return updateCategory(request, env, decodeURIComponent(categoryMatch[1]));
  }

  if (url.pathname === "/api/media" && request.method === "POST") return uploadMedia(request, env);
  if (url.pathname === "/api/settings/password" && request.method === "PUT") return changePassword(request, env);

  return json({ error: "not_found" }, 404);
}

async function listPosts(env: Env) {
  const rows = await env.DB.prepare(
    `${postSelect()} ORDER BY COALESCE(p.published_at, p.updated_at) DESC LIMIT 200`,
  ).all<PostRow>();
  return json({ posts: rows.results.map(toAdmin) });
}

async function savePost(request: Request, env: Env, existingId: string | null) {
  const body = await readJson<PostInput>(request);
  if (!body) return json({ error: "invalid" }, 400);
  const title = (body.title ?? "").trim();
  const content = sanitizeHtml(body.content ?? "");
  const status = body.status === "published" ? "published" : "draft";
  if (!title) return json({ error: "title_required" }, 400);
  const id = existingId ?? newId();
  const slug = normalizeSlug(body.slug || "") || id;
  if (!/^[a-z0-9][a-z0-9_-]{0,80}$/.test(slug)) return json({ error: "bad_slug" }, 400);
  const now = new Date().toISOString();
  const publishedAt = status === "published" ? body.publishedAt || now : body.publishedAt || null;
  const categoryId = body.categoryId || null;
  const coverUrl = (body.coverUrl ?? "").trim() || null;
  // 送られてこなかった項目は、今の値を残す（管理画面の版によって送る項目が違っても消えないように）
  const existing = existingId
    ? await env.DB.prepare("SELECT kind, cover_alt, description FROM posts WHERE id = ?")
        .bind(existingId)
        .first<{ kind: string | null; cover_alt: string | null; description: string | null }>()
    : null;
  const kind =
    body.kind === undefined || body.kind === null ? (existing?.kind === "column" ? "column" : "news") : body.kind === "column" ? "column" : "news";
  const coverAlt =
    body.coverAlt === undefined ? (existing?.cover_alt ?? null) : (body.coverAlt ?? "").trim().slice(0, 200) || null;
  const description =
    body.description === undefined
      ? (existing?.description ?? null)
      : (body.description ?? "").replace(/\s+/g, " ").trim().slice(0, 200) || null;

  const dup = await env.DB.prepare("SELECT id FROM posts WHERE slug = ? AND id != ?")
    .bind(slug, id)
    .first<{ id: string }>();
  if (dup) return json({ error: "slug_taken" }, 409);

  if (existingId) {
    const current = await env.DB.prepare("SELECT id FROM posts WHERE id = ?").bind(existingId).first();
    if (!current) return json({ error: "not_found" }, 404);
    await env.DB.prepare(
      `UPDATE posts
       SET slug = ?, title = ?, content_html = ?, category_id = ?, status = ?, published_at = ?, updated_at = ?, cover_url = ?,
           kind = ?, cover_alt = ?, description = ?
       WHERE id = ?`,
    )
      .bind(slug, title, content, categoryId, status, publishedAt, now, coverUrl, kind, coverAlt, description, existingId)
      .run();
    return json({ post: await getAdminPost(env, existingId) });
  }

  await env.DB.prepare(
    `INSERT INTO posts (id, slug, title, content_html, category_id, status, published_at, created_at, updated_at, cover_url, kind, cover_alt, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, slug, title, content, categoryId, status, publishedAt, now, now, coverUrl, kind, coverAlt, description)
    .run();
  return json({ post: await getAdminPost(env, id) }, 201);
}

async function deletePost(env: Env, id: string) {
  await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

async function listCategories(env: Env) {
  const rows = await env.DB.prepare(
    "SELECT id, title, sort_order AS sortOrder FROM categories ORDER BY sort_order, title",
  ).all<{ id: string; title: string; sortOrder: number }>();
  return json({ categories: rows.results });
}

/** カテゴリID: 英小文字・数字・ハイフン（先頭と末尾は英数字）、40字まで */
const CATEGORY_ID_RE = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

/** ID がカテゴリか、別のカテゴリの旧ID（転送用）として使われているか */
async function categoryIdTaken(env: Env, id: string, self: string | null) {
  const category = await env.DB.prepare("SELECT id FROM categories WHERE id = ?").bind(id).first();
  if (category) return true;
  const alias = await env.DB.prepare("SELECT category_id AS categoryId FROM category_aliases WHERE old_id = ?")
    .bind(id)
    .first<{ categoryId: string }>();
  return Boolean(alias && alias.categoryId !== self);
}

/** 現在のIDか旧IDを、現在のカテゴリIDにする。見つからなければ null */
async function resolveCategoryId(env: Env, id: string) {
  const category = await env.DB.prepare("SELECT id FROM categories WHERE id = ?").bind(id).first<{ id: string }>();
  if (category) return category.id;
  const alias = await env.DB.prepare("SELECT category_id AS categoryId FROM category_aliases WHERE old_id = ?")
    .bind(id)
    .first<{ categoryId: string }>();
  return alias?.categoryId ?? null;
}

async function createCategory(request: Request, env: Env) {
  const body = await readJson<{ title?: string; id?: string }>(request);
  const title = (body?.title ?? "").trim();
  if (!title || title.length > 40) return json({ error: "bad_title" }, 400);
  const requested = (body?.id ?? "").trim();
  if (requested && !CATEGORY_ID_RE.test(requested)) return json({ error: "bad_category_id" }, 400);
  const id = requested || newId();
  if (await categoryIdTaken(env, id, null)) return json({ error: "category_id_taken" }, 409);
  await env.DB.prepare("INSERT INTO categories (id, title, sort_order) VALUES (?, ?, ?)").bind(id, title, 10).run();
  return json({ category: { id, title, sortOrder: 10 } }, 201);
}

/**
 * カテゴリの名前・IDを変える。IDを変えたときは、記事の参照を付け替え、
 * 旧IDを category_aliases に残す（サイト側で旧URL→新URLの転送に使う）。
 */
async function updateCategory(request: Request, env: Env, currentId: string) {
  const body = await readJson<{ title?: string; id?: string }>(request);
  if (!body) return json({ error: "invalid" }, 400);
  const current = await env.DB.prepare("SELECT id, title, sort_order AS sortOrder FROM categories WHERE id = ?")
    .bind(currentId)
    .first<{ id: string; title: string; sortOrder: number }>();
  if (!current) return json({ error: "not_found" }, 404);
  const title = (body.title ?? current.title).trim();
  if (!title || title.length > 40) return json({ error: "bad_title" }, 400);
  const nextId = (body.id ?? current.id).trim();
  if (!CATEGORY_ID_RE.test(nextId)) return json({ error: "bad_category_id" }, 400);

  if (nextId === current.id) {
    await env.DB.prepare("UPDATE categories SET title = ? WHERE id = ?").bind(title, current.id).run();
    return json({ category: { ...current, title } });
  }
  if (await categoryIdTaken(env, nextId, current.id)) return json({ error: "category_id_taken" }, 409);

  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO categories (id, title, sort_order) VALUES (?, ?, ?)").bind(
      nextId,
      title,
      current.sortOrder,
    ),
    env.DB.prepare("UPDATE posts SET category_id = ? WHERE category_id = ?").bind(nextId, current.id),
    // これまでの旧IDも、新しいIDへ向け直す（転送が多段にならないように）
    env.DB.prepare("UPDATE category_aliases SET category_id = ? WHERE category_id = ?").bind(nextId, current.id),
    // 元のIDに戻したときは、その別名は不要
    env.DB.prepare("DELETE FROM category_aliases WHERE old_id = ?").bind(nextId),
    env.DB.prepare(
      "INSERT INTO category_aliases (old_id, category_id, created_at) VALUES (?, ?, ?) ON CONFLICT(old_id) DO UPDATE SET category_id = excluded.category_id",
    ).bind(current.id, nextId, now),
    env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(current.id),
  ]);
  return json({ category: { id: nextId, title, sortOrder: current.sortOrder }, previousId: current.id });
}

async function uploadMedia(request: Request, env: Env) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "file_required" }, 400);
  if (file.size > 5 * 1024 * 1024) return json({ error: "too_large" }, 413);
  const type = file.type || "application/octet-stream";
  if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(type)) {
    return json({ error: "bad_type" }, 415);
  }
  const ext = type.split("/")[1] === "jpeg" ? "jpg" : type.split("/")[1];
  const key = `uploads/${new Date().toISOString().slice(0, 10)}-${newId()}.${ext}`;
  await env.MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: type } });
  const url = new URL(request.url);
  return json({ url: `${url.origin}/media/${key}`, key });
}

async function serveMedia(env: Env, key: string) {
  if (!key || key.includes("..")) return new Response("Not found", { status: 404 });
  const object = await env.MEDIA.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
      ...corsHeaders(),
    },
  });
}

async function setupPassword(request: Request, env: Env) {
  if (await hasPassword(env)) return json({ error: "already_setup" }, 409);
  const body = await readJson<{ password?: string }>(request);
  const password = body?.password ?? "";
  if (password.length < 10) return json({ error: "weak_password" }, 400);
  await storePassword(env, password);
  return openSession(request, env);
}

async function login(request: Request, env: Env) {
  const body = await readJson<{ password?: string }>(request);
  const password = body?.password ?? "";
  if (!(await checkPassword(env, password))) return json({ error: "invalid" }, 401);
  return openSession(request, env);
}

async function changePassword(request: Request, env: Env) {
  const body = await readJson<{ current?: string; next?: string }>(request);
  const current = body?.current ?? "";
  const next = body?.next ?? "";
  if (!(await checkPassword(env, current))) return json({ error: "invalid" }, 401);
  if (next.length < 10) return json({ error: "weak_password" }, 400);
  await storePassword(env, next);
  return json({ ok: true });
}

async function logout(request: Request, env: Env) {
  const token = readCookie(request);
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  return json({ ok: true }, 200, { "set-cookie": clearCookie(request) });
}

async function openSession(request: Request, env: Env) {
  const token = crypto.randomUUID().replaceAll("-", "") + newId();
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  await env.DB.prepare("INSERT INTO sessions (token, expires_at) VALUES (?, ?)").bind(token, expires).run();
  return json({ ok: true }, 200, { "set-cookie": sessionCookie(request, token, SESSION_DAYS * 86400) });
}

async function hasPassword(env: Env) {
  if (env.ADMIN_PASSWORD) return true;
  const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'password_hash'").first<{ value: string }>();
  return Boolean(row?.value);
}

async function checkPassword(env: Env, password: string) {
  if (!password) return false;
  if (env.ADMIN_PASSWORD) return safeEqual(password, env.ADMIN_PASSWORD);
  const hashRow = await env.DB.prepare("SELECT value FROM settings WHERE key = 'password_hash'").first<{ value: string }>();
  const saltRow = await env.DB.prepare("SELECT value FROM settings WHERE key = 'password_salt'").first<{ value: string }>();
  if (!hashRow?.value || !saltRow?.value) return false;
  const actual = await hashPassword(password, saltRow.value);
  return safeEqual(actual, hashRow.value);
}

async function storePassword(env: Env, password: string) {
  const salt = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
  const hash = await hashPassword(password, salt);
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO settings (key, value) VALUES ('password_salt', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    ).bind(salt),
    env.DB.prepare(
      "INSERT INTO settings (key, value) VALUES ('password_hash', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    ).bind(hash),
  ]);
}

async function hashPassword(password: string, salt: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
    key,
    256,
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function isAuthed(request: Request, env: Env) {
  const token = readCookie(request);
  if (!token) return false;
  const row = await env.DB.prepare("SELECT expires_at FROM sessions WHERE token = ?")
    .bind(token)
    .first<{ expires_at: string }>();
  if (!row) return false;
  if (row.expires_at < new Date().toISOString()) {
    await env.DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    return false;
  }
  return true;
}

function postSelect() {
  return `SELECT p.id, p.slug, p.title, p.content_html, p.category_id, p.status, p.published_at, p.created_at, p.updated_at, p.cover_url, p.kind, p.cover_alt, p.description, c.title AS category_title
          FROM posts p LEFT JOIN categories c ON c.id = p.category_id`;
}

function postKind(kind: string | null | undefined) {
  return kind === "column" ? "column" : "news";
}

function publicPath(kind: string, slug: string) {
  return `${PUBLIC_SITE}/${kind === "column" ? "column" : "news"}/${slug}`;
}

function toPublic(row: PostRow) {
  return {
    id: row.id,
    title: row.title,
    content: row.content_html,
    slug: row.slug,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    description: row.description,
    coverUrl: row.cover_url ?? "",
    coverAlt: row.cover_alt,
    kind: postKind(row.kind),
    category: row.category_id ? [{ id: row.category_id, title: row.category_title ?? "お知らせ" }] : [],
  };
}

function toAdmin(row: PostRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    content: row.content_html,
    categoryId: row.category_id,
    categoryTitle: row.category_title,
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    coverUrl: row.cover_url,
    kind: postKind(row.kind),
    coverAlt: row.cover_alt,
    description: row.description,
    publicUrl: publicPath(postKind(row.kind), row.slug),
  };
}

async function getAdminPost(env: Env, id: string) {
  const row = await env.DB.prepare(`${postSelect()} WHERE p.id = ?`).bind(id).first<PostRow>();
  return row ? toAdmin(row) : null;
}

type PostInput = {
  title?: string;
  slug?: string;
  content?: string;
  categoryId?: string | null;
  status?: string;
  publishedAt?: string | null;
  coverUrl?: string | null;
  kind?: string | null;
  coverAlt?: string | null;
  description?: string | null;
};

function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

function readCookie(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function sessionCookie(request: Request, token: string, maxAge: number) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function clearCookie(request: Request) {
  return sessionCookie(request, "", 0);
}

function rejectCrossOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  if (origin === new URL(request.url).origin) return null;
  return json({ error: "forbidden" }, 403);
}

function corsHeaders(): Record<string, string> {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function publicHeaders(): Record<string, string> {
  return {
    ...corsHeaders(),
    "cache-control": "public, max-age=60",
  };
}

function json(data: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
      ...extra,
    },
  });
}

function safeEqual(a: string, b: string) {
  const enc = new TextEncoder();
  const left = enc.encode(a);
  const right = enc.encode(b);
  const length = Math.max(left.length, right.length);
  let diff = left.length === right.length ? 0 : 1;
  for (let i = 0; i < length; i += 1) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}
