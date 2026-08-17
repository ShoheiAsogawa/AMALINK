import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getNewsList, formatMicroCmsDate, getContentCategories } from "@/lib/microcms";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { type Locale, withLocale } from "@/lib/i18n";
import { localeMetadata } from "@/lib/i18n-meta";
import { getMessages } from "@/lib/messages";

export const revalidate = 0;

export function newsListMetadata(locale: Locale): Metadata {
  const t = getMessages(locale).news;
  const description =
    locale === "en"
      ? "News and updates from AMALINK. Articles are published in Japanese."
      : "AMALINKからのお知らせ一覧です。イベント・リリース情報などを掲載しています。";
  return localeMetadata(locale, "/news", t.heading, description);
}

export async function NewsListView({ locale }: { locale: Locale }) {
  const { contents: news } = await getNewsList({ limit: 100 });
  const t = getMessages(locale).news;

  return (
    <main className="overflow-hidden">
      <Header />
      <section className="pt-32 md:pt-40 pb-20 md:pb-32 min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-amami-green" />
              <span className="text-amami-green text-xs font-bold tracking-[0.2em] uppercase">News</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-slate-800 leading-tight [word-break:keep-all]">{t.heading}</h1>
            {t.japaneseNote ? (
              <p className="mt-4 font-sans text-sm text-slate-500">{t.japaneseNote}</p>
            ) : null}
          </div>
          {news.length > 0 ? (
            <div className="space-y-0 divide-y divide-slate-100">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={withLocale(`/news/${item.slug ?? item.id}`, locale)}
                  className="group flex flex-col md:flex-row md:items-center gap-2 md:gap-8 py-6 md:py-8 hover:bg-slate-50/50 transition-colors duration-200 px-2 -mx-2 rounded-lg"
                >
                  <time className="text-xs md:text-sm text-slate-400 font-sans tabular-nums whitespace-nowrap shrink-0">
                    {formatMicroCmsDate(item.publishedAt ?? item.createdAt)}
                  </time>
                  <div className="flex gap-2 shrink-0">
                    {getContentCategories(item.category).map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-block text-[10px] md:text-xs px-3 py-0.5 rounded-full bg-amami-blue-light/40 text-amami-blue font-sans tracking-wide"
                      >
                        {cat.title}
                      </span>
                    ))}
                  </div>
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
              <p className="text-slate-400 text-sm font-sans">{t.empty}</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
