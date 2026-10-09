import type { Metadata } from "next";
import { getColumnEntry, getColumnList } from "@/lib/cms";
import { articleMetadata } from "@/lib/article-meta";
import { ArticleView } from "@/components/content/ArticleView";
import { notFound } from "next/navigation";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { contents } = await getColumnList({ limit: 100 });
    return (contents ?? []).map((item) => ({ slug: item.slug ?? item.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const column = await getColumnEntry(slug);
    if (!column) return { title: "コラム" };
    return articleMetadata(column);
  } catch {
    return { title: "コラム" };
  }
}

export default async function ColumnDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const column = await getColumnEntry(slug).catch(() => null);
  if (!column) notFound();
  return <ArticleView post={column} />;
}
