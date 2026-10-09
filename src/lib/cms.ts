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

export async function getNewsList(queries?: { limit?: number }) {
  const limit = queries?.limit ?? 100;
  const remote = await fetchCms<{ contents: News[]; totalCount: number }>(
    `/api/public/news?limit=${limit}`,
  );
  if (remote?.contents) {
    const contents = remote.contents.filter((item) => postKind(item.kind) === "news");
    return { contents, totalCount: contents.length };
  }
  return seedList(limit);
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
