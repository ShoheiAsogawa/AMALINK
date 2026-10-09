import type { Metadata } from "next";
import { getColumnEntry, getNewsEntry, getNewsList, postHref } from "@/lib/cms";
import { articleMetadata } from "@/lib/article-meta";
import { ArticleView } from "@/components/content/ArticleView";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { contents } = await getNewsList({ limit: 100 });
    return (contents ?? []).map((item) => ({ slug: item.slug ?? item.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const news = await getNewsEntry(slug);
    if (!news) return { title: "お知らせ" };
    return articleMetadata(news);
  } catch {
    return { title: "お知らせ" };
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNewsEntry(slug).catch(() => null);
  if (!news) {
    // コラムの種類に移した記事は、/column/<slug> へ恒久転送（308）
    const column = await getColumnEntry(slug).catch(() => null);
    if (column) permanentRedirect(postHref(column));
    notFound();
  }
  return <ArticleView post={news} />;
}
