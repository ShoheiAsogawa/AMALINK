import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Newspaper } from "lucide-react";
import { categoryPath, formatNewsDate, getCategoryIndex, getNewsList, postHref } from "@/lib/cms";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { categories } = await getCategoryIndex();
    return categories.map((category) => ({ id: category.id }));
  } catch {
    return [];
  }
}

async function resolveCategory(rawId: string) {
  const id = decodeURIComponent(rawId);
  const index = await getCategoryIndex();
  const category = index.categories.find((item) => item.id === id);
  if (category) return { category };
  const movedTo = index.aliases[id];
  if (movedTo && movedTo !== id) return { movedTo };
  return {};
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { category } = await resolveCategory(id);
  if (!category) return { title: "お知らせ" };
  const path = categoryPath(category.id);
  const title = `${category.title}の記事`;
  const description = `${SITE_NAME}の「${category.title}」に関する記事・お知らせの一覧です。`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": [{ url: "/rss.xml", title: `お知らせ | ${SITE_NAME}` }] },
    },
    openGraph: { url: absoluteUrl(path), title: `${title} | ${SITE_NAME}`, description },
  };
}

export default async function NewsCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { category, movedTo } = await resolveCategory(id);
  // IDを変えたカテゴリの旧URLは、新しいURLへ恒久転送（308）
  if (movedTo) permanentRedirect(categoryPath(movedTo));
  if (!category) notFound();

  const { contents: news } = await getNewsList({ limit: 100, category: category.id });

  return (
    <main className="overflow-hidden">
      <Header />
      <section className="pt-32 md:pt-40 pb-20 md:pb-32 min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-amami-green font-sans mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            お知らせ一覧へ
          </Link>
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-amami-green" />
              <span className="text-amami-green text-xs font-bold tracking-[0.2em] uppercase">Category</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-slate-800 leading-tight">{category.title}</h1>
          </div>
          {news.length > 0 ? (
            <div className="space-y-0 divide-y divide-slate-100">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={postHref(item)}
                  className="group flex flex-col md:flex-row md:items-center gap-2 md:gap-8 py-6 md:py-8 hover:bg-slate-50/50 transition-colors duration-200 px-2 -mx-2 rounded-lg"
                >
                  <time className="text-xs md:text-sm text-slate-400 font-sans tabular-nums whitespace-nowrap shrink-0">
                    {formatNewsDate(item.publishedAt ?? item.createdAt)}
                  </time>
                  <div className="text-sm md:text-base text-slate-700 font-sans group-hover:text-amami-blue transition-colors duration-200 flex-1 min-w-0 truncate">
                    {item.title}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amami-blue group-hover:translate-x-1 transition-all duration-200 shrink-0 hidden md:block" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <Newspaper className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-sm font-sans">このカテゴリの記事はまだありません</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
