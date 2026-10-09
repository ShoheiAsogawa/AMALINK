import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ContentSwitch } from "@/components/content/ContentSwitch";
import { CoverImage } from "@/components/content/CoverImage";
import { formatNewsDate, getColumnList, getContentCategories, postHref } from "@/lib/cms";
import { absoluteUrl, SITE_NAME, stripHtmlToDescription } from "@/lib/seo";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "コラム",
  description: `${SITE_NAME}のコラムです。制作、AI、島の仕事について書いた読み物を掲載しています。`,
  alternates: { canonical: "/column" },
  openGraph: {
    url: absoluteUrl("/column"),
    title: `コラム | ${SITE_NAME}`,
    description: `${SITE_NAME}のコラムです。`,
  },
};

export default async function ColumnListPage() {
  const { contents: columns } = await getColumnList({ limit: 100 });

  return (
    <main className="overflow-hidden">
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-8 md:mb-10">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-[1px] w-12 bg-amami-blue" />
              <span className="text-xs font-bold tracking-[0.2em] text-amami-blue uppercase">Column</span>
            </div>
            <h1 className="font-serif text-3xl leading-tight text-slate-800 md:text-5xl">コラム</h1>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-slate-500">
              サービスや現場の話を、少し長く書いた記事です。
            </p>
          </div>
          <ContentSwitch current="column" />
          {columns.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {columns.map((item) => (
                <Link
                  key={item.id}
                  href={postHref(item)}
                  className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    {item.coverUrl ? (
                      <CoverImage
                        src={item.coverUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <BookOpen className="h-8 w-8" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <time className="font-sans text-xs text-slate-400 tabular-nums">
                        {formatNewsDate(item.publishedAt ?? item.createdAt)}
                      </time>
                      {getContentCategories(item.category).map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-block rounded-full bg-amami-blue-light/40 px-2.5 py-0.5 font-sans text-[10px] tracking-wide text-amami-blue"
                        >
                          {cat.title}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-serif text-xl leading-snug text-slate-800 transition-colors group-hover:text-amami-blue">
                      {item.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 font-sans text-sm leading-relaxed text-slate-500">
                      {stripHtmlToDescription(item.content, 96)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-200" />
              <p className="font-sans text-sm text-slate-400">コラムはまだありません</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
