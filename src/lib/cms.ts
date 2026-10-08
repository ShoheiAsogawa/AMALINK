import seed from "../../cms/seed/news.json";

export type NewsCategory = {
  id: string;
  title: string;
};

export type News = {
  id: string;
  title: string;
  content: string;
  slug?: string;
  category?: NewsCategory | NewsCategory[];
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
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
  if (remote?.contents) return remote;
  return seedList(limit);
}

export async function getNewsEntry(slugOrId: string): Promise<News | null> {
  const remote = await fetchCms<News>(`/api/public/news/${encodeURIComponent(slugOrId)}`);
  if (remote?.id) return remote;
  const local = seed.posts.find(
    (post) => post.status === "published" && (post.slug === slugOrId || post.id === slugOrId),
  );
  return local ? fromSeedPost(local) : null;
}
