import { WaveBackground } from "@/components/ui/WaveBackground";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import type { Article } from "@/lib/microcms";
import { formatMicroCmsDate, getContentCategories } from "@/lib/microcms";

function ArticleItem({ item }: { item: Article }) {
  const lead = item.description?.trim();

  return (
    <Link
      href={`/articles/${item.slug ?? item.id}`}
      className="group block py-5 md:py-6 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors duration-200 px-2 -mx-2 rounded-lg"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6">
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
          <div className="text-sm md:text-base text-slate-800 font-serif group-hover:text-amami-blue transition-colors duration-200">
            {item.title}
          </div>
          {lead && (
            <p className="mt-2 line-clamp-2 text-xs md:text-sm font-sans leading-relaxed text-slate-500">
              {lead}
            </p>
          )}
        </div>
        <ArrowRight className="hidden md:block w-4 h-4 text-slate-300 group-hover:text-amami-blue group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-1" />
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 md:py-24">
      <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-4" />
      <p className="text-slate-400 text-sm font-sans">記事はまだありません</p>
    </div>
  );
}

export function ArticlesSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section
      id="articles"
      className="bg-gradient-to-b from-slate-50 to-white py-20 md:py-32 relative overflow-hidden"
    >
      <WaveBackground color="blue" position="bottom" opacity={0.08} speed={45} />
      <div className="container relative z-10 mx-auto max-w-4xl px-4">
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <SectionEyebrow label="Articles" color="blue" />
          <h2 className="text-3xl font-serif leading-tight text-slate-800 [letter-spacing:0] md:text-5xl">
            コラム・ガイド
          </h2>
          <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-slate-500 md:text-base">
            奄美大島・離島のWeb制作やシステム開発について、地域の文脈から解説します。
          </p>
          <Link
            href="/articles"
            className="group mt-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors duration-300 hover:text-amami-blue font-sans"
          >
            <span>すべて見る</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 p-4 md:p-8 shadow-sm">
          {articles.map((item) => (
            <ArticleItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
