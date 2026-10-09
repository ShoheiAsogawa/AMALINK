import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ContentSwitch } from "@/components/content/ContentSwitch";
import { CoverImage } from "@/components/content/CoverImage";
import { getNewsList, formatNewsDate, getContentCategories, postHref } from "@/lib/cms";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "お知らせ",
  description: `${SITE_NAME}からのお知らせ一覧です。イベント・リリース情報などを掲載しています。`,
  alternates: {
    canonical: "/news",
    types: { "application/rss+xml": [{ url: "/rss.xml", title: `お知らせ | ${SITE_NAME}` }] },
  },
  openGraph: {
    url: absoluteUrl("/news"),
    title: `お知らせ | ${SITE_NAME}`,
    description: `${SITE_NAME}からのお知らせ一覧です。`,
  },
};

export default async function NewsListPage() {
  const { contents: news } = await getNewsList({ limit: 100 });

  return (
    <main className="overflow-hidden">
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="mb-8 md:mb-10">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-amami-green" />
              <span className="text-xs font-bold tracking-[0.2em] text-amami-green uppercase">News</span>
            </div>
            <h1 className="font-serif text-3xl leading-tight text-slate-800 md:text-5xl">お知らせ</h1>
          </div>
          <ContentSwitch current="news" />
          {news.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={postHref(item)}
                  className="group flex items-center gap-4 rounded-2xl px-2 py-5 transition-colors duration-200 hover:bg-white md:gap-6 md:py-6"
                >
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 md:h-20 md:w-32">
                    {item.coverUrl ? (
                      <CoverImage src={item.coverUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <Newspaper className="h-5 w-5" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <time className="font-sans text-xs text-slate-400 tabular-nums">
                        {formatNewsDate(item.publishedAt ?? item.createdAt)}
                      </time>
                      {getContentCategories(item.category).map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-block rounded-full bg-amami-blue-light/40 px-2.5 py-0.5 font-sans text-[10px] tracking-wide text-amami-blue md:text-xs"
                        >
                          {cat.title}
                        </span>
                      ))}
                    </div>
                    <div className="line-clamp-2 font-sans text-sm leading-snug text-slate-800 transition-colors duration-200 group-hover:text-amami-blue md:text-base">
                      {item.title}
                    </div>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-amami-blue md:block" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Newspaper className="mx-auto mb-4 h-12 w-12 text-slate-200" />
              <p className="font-sans text-sm text-slate-400">お知らせはまだありません</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
