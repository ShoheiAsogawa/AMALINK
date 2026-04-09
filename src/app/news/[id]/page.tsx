import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getNewsDetail, getNewsList } from "@/lib/microcms";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const news = await getNewsDetail(id);
  return {
    title: `${news.title} | AMALINK`,
    description: news.title,
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const news = await getNewsDetail(id);

  return (
    <main className="overflow-hidden">
      <Header />

      <article className="pt-32 md:pt-40 pb-20 md:pb-32 min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Back link */}
          <Link
            href="/news"
            className="group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amami-green font-sans transition-colors duration-300 mb-10 md:mb-14"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>お知らせ一覧へ戻る</span>
          </Link>

          {/* Header */}
          <header className="mb-10 md:mb-14">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {news.category?.map((cat) => (
                <span
                  key={cat}
                  className="inline-block text-[10px] md:text-xs px-3 py-0.5 rounded-full bg-amami-blue-light/40 text-amami-blue font-sans tracking-wide"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="text-2xl md:text-4xl font-serif text-slate-800 leading-tight mb-4">
              {news.title}
            </h1>

            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <time className="text-xs md:text-sm font-sans">
                {formatDate(news.publishedAt ?? news.createdAt)}
              </time>
            </div>
          </header>

          {/* Body */}
          <div
            className="
              prose prose-slate prose-sm md:prose-base max-w-none font-sans
              prose-headings:font-serif prose-headings:text-slate-800
              prose-h2:text-xl prose-h2:md:text-2xl prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3 prose-h2:mb-6
              prose-h3:text-lg prose-h3:md:text-xl
              prose-p:leading-loose prose-p:text-slate-600
              prose-a:text-amami-blue prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-sm
              prose-strong:text-slate-700
              prose-li:text-slate-600
            "
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Bottom nav */}
          <div className="mt-16 md:mt-20 pt-8 border-t border-slate-100">
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amami-green font-sans transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>お知らせ一覧へ戻る</span>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
