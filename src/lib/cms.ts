import seed from "../../cms/seed/news.json";

export type NewsCategory = {
  id: string;
  title: string;
};

export type PostKind = "news" | "column";

export type News = {
  id: string;
  title: string;
  content: string;
  slug?: string;
  category?: NewsCategory | NewsCategory[];
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  coverUrl?: string;
  kind?: PostKind;
  /** 検索結果・SNS用の説明文（CMSで手入力。空なら本文の最初の2文） */
  description?: string | null;
  /** カバー画像の説明（alt） */
  coverAlt?: string | null;
};

type SeedPost = (typeof seed.posts)[number];

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://amalink-cms.uken-shohei.workers.dev").replace(
  /\/$/,
  "",
);

export function getContentCategories(category: News["category"]): NewsCategory[] {
  if (!category) return [];
  return Array.isArray(category) ? category : [category];
}

export function postKind(kind: News["kind"]): PostKind {
  return kind === "column" ? "column" : "news";
}

export function postHref(item: Pick<News, "id" | "slug" | "kind">): string {
  const slug = item.slug || item.id;
  return postKind(item.kind) === "column" ? `/column/${slug}` : `/news/${slug}`;
}

export function showsHeroCover(item: Pick<News, "content" | "coverUrl">): boolean {
  if (!item.coverUrl) return false;
  return !item.content.includes(item.coverUrl);
}

export function formatNewsDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function categoryOf(categoryId: string | undefined): NewsCategory | undefined {
  const found = seed.categories.find((category) => category.id === categoryId);
  return found ? { id: found.id, title: found.title } : undefined;
}

function fromSeedPost(post: SeedPost): News {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    slug: post.slug,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    coverUrl: post.coverUrl,
    kind: "news",
    category: categoryOf(post.categoryId),
  };
}

function seedList(limit?: number) {
  const posts = [...seed.posts]
    .filter((post) => post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(fromSeedPost);
  return {
    contents: typeof limit === "number" ? posts.slice(0, limit) : posts,
    totalCount: posts.length,
  };
}

async function fetchCms<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${CMS_API_URL}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getNewsList(queries?: { limit?: number; category?: string }) {
  const limit = queries?.limit ?? 100;
  const category = queries?.category;
  const params = new URLSearchParams({ limit: String(limit) });
  if (category) params.set("category", category);
  const remote = await fetchCms<{ contents: News[]; totalCount: number }>(`/api/public/news?${params}`);
  if (remote?.contents) {
    // 古いCMS（category 指定に未対応）でも正しく絞り込めるよう、念のためここでも絞る
    const contents = remote.contents.filter(
      (item) =>
        postKind(item.kind) === "news" &&
        (!category || getContentCategories(item.category).some((cat) => cat.id === category)),
    );
    return { contents, totalCount: contents.length };
  }
  const local = seedList();
  const contents = category
    ? local.contents.filter((item) => getContentCategories(item.category).some((cat) => cat.id === category))
    : local.contents;
  return { contents: contents.slice(0, limit), totalCount: contents.length };
}

export type CategoryIndex = {
  categories: NewsCategory[];
  /** 旧ID → 現在のID（IDを変えたカテゴリの転送用） */
  aliases: Record<string, string>;
};

export async function getCategoryIndex(): Promise<CategoryIndex> {
  const remote = await fetchCms<{
    categories: { id: string; title: string }[];
    aliases?: { oldId: string; categoryId: string }[];
  }>("/api/public/categories");
  if (remote?.categories) {
    return {
      categories: remote.categories.map(({ id, title }) => ({ id, title })),
      aliases: Object.fromEntries((remote.aliases ?? []).map((alias) => [alias.oldId, alias.categoryId])),
    };
  }
  return {
    categories: seed.categories.map(({ id, title }) => ({ id, title })),
    aliases: {},
  };
}

export function categoryPath(id: string): string {
  return `/news/category/${encodeURIComponent(id)}`;
}

export async function getNewsEntry(slugOrId: string): Promise<News | null> {
  const remote = await fetchCms<News>(`/api/public/news/${encodeURIComponent(slugOrId)}`);
  if (remote?.id && postKind(remote.kind) === "news") return remote;
  const local = seed.posts.find(
    (post) => post.status === "published" && (post.slug === slugOrId || post.id === slugOrId),
  );
  return local ? fromSeedPost(local) : null;
}

export async function getColumnList(queries?: { limit?: number }) {
  const limit = queries?.limit ?? 100;
  const remote = await fetchCms<{ contents: News[]; totalCount: number }>(
    `/api/public/columns?limit=${limit}`,
  );
  if (remote?.contents) {
    return {
      contents: remote.contents.filter((item) => postKind(item.kind) === "column"),
      totalCount: remote.totalCount,
    };
  }
  return { contents: [], totalCount: 0 };
}

export async function getColumnEntry(slugOrId: string): Promise<News | null> {
  const remote = await fetchCms<News>(`/api/public/columns/${encodeURIComponent(slugOrId)}`);
  if (remote?.id && postKind(remote.kind) === "column") return remote;
  return null;
}
