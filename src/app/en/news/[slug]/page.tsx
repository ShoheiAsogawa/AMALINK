import type { Metadata } from "next";
import { getNewsList, getNewsEntry } from "@/lib/microcms";
import { NewsArticleView } from "@/components/pages/NewsArticleView";
import { localeMetadata } from "@/lib/i18n-meta";
import { withLocale } from "@/lib/i18n";
import { absoluteUrl, SITE_NAME, stripHtmlToDescription } from "@/lib/seo";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const news = await getNewsEntry(slug);
    const path = `/news/${news.slug ?? slug}`;
    const description = stripHtmlToDescription(news.content) || news.title;
    const published = news.publishedAt ?? news.createdAt;
    const modified = news.updatedAt ?? published;
    return {
      ...localeMetadata("en", path, news.title, description),
      openGraph: {
        type: "article",
        url: absoluteUrl(withLocale(path, "en")),
        title: news.title,
        description,
        publishedTime: published,
        modifiedTime: modified,
        siteName: SITE_NAME,
      },
    } satisfies Metadata;
  } catch {
    return { title: "News" } satisfies Metadata;
  }
}

export default async function EnglishNewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NewsArticleView locale="en" slug={slug} />;
}
