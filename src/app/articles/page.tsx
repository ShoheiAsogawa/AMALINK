import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  formatMicroCmsDate,
  getArticlesList,
  getContentCategories,
} from "@/lib/microcms";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "コラム・ガイド",
  description: `${LEGAL_NAME}（${SITE_NAME}）のコラム・ガイド。奄美大島・鹿児島エリア向けのホームページ制作、システム開発、離島でのWeb運用のノウハウを解説します。`,
  alternates: { canonical: "/articles" },
  openGraph: {
    url: absoluteUrl("/articles"),
    title: `コラム・ガイド | ${LEGAL_NAME}`,
    description:
      "奄美大島・離島のWeb制作・システム開発について、地域密着型の視点から解説する記事一覧です。",
    type: "website",
  },
};

export default async function ArticlesListPage() {
  const { contents: articles } = await getArticlesList({ limit: 100 });

  return (
    <main className="overflow-hidden">
      <Header />
      <section className="pt-32 md:pt-40 pb-20 md:pb-32 min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-amami-blue" />
              <span className="text-amami-blue text-xs font-bold tracking-[0.2em] uppercase">
                Articles
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-slate-800 leading-tight">
              コラム・ガイド
            </h1>
            <p className="mt-4 font-sans text-sm leading-relaxed text-slate-600 md:text-base">
              奄美大島・南九州エリアの事業者向けに、ホームページ制作・システム開発・離島でのWeb運用をテーマにした記事です。
            </p>
          </div>
          {articles.length > 0 ? (
            <div className="space-y-0 divide-y divide-slate-100">
              {articles.map((item) => (
                <Link
                  key={item.id}
                  href={`/articles/${item.slug ?? item.id}`}
                  className="group block py-6 md:py-8 hover:bg-slate-50/50 transition-colors duration-200 px-2 -mx-2 rounded-lg"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
                    <time className="text-xs md:text-sm text-slate-400 font-sans tabular-nums whitespace-nowrap shrink-0">
                      {formatMicroCmsDate(item.publishedAt ?? item.createdAt)}
                    </time>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap gap-2">
                        {getContentCategories(item.category).map((cat) => (
                          <span
                            key={cat.id}
                            className="inline-block text-[10px] md:text-xs px-3 py-0.5 rounded-full bg-amami-blue-light/40 text-amami-blue font-sans tracking-wide"
                          >
                            {cat.title}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-base md:text-lg font-serif text-slate-800 group-hover:text-amami-blue transition-colors duration-200">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="mt-2 font-sans text-sm leading-relaxed text-slate-500 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amami-blue group-hover:translate-x-1 transition-all duration-200 shrink-0 hidden md:block mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-sm font-sans">記事はまだありません</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
