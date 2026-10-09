import { WaveBackground } from "@/components/ui/WaveBackground";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { CoverImage } from "@/components/content/CoverImage";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import type { News } from "@/lib/cms";
import { formatNewsDate, getContentCategories, postHref } from "@/lib/cms";

function CategoryBadge({ category }: { category: { id: string; title: string } }) {
  return (
    <span className="inline-block text-[10px] md:text-xs px-3 py-0.5 rounded-full bg-amami-blue-light/40 text-amami-blue font-sans tracking-wide">
      {category.title}
    </span>
  );
}

function NewsItem({ item }: { item: News }) {
  return (
    <Link
      href={postHref(item)}
      className="group grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-100 px-2 py-4 last:border-b-0 hover:bg-slate-50/50 transition-colors duration-200 md:grid-cols-[104px_120px_auto_minmax(0,1fr)_32px] md:gap-5 md:py-5 -mx-2 rounded-lg"
    >
      <div className="h-12 w-[72px] overflow-hidden rounded-lg bg-slate-100 md:h-14 md:w-[104px]">
        {item.coverUrl ? (
          <CoverImage src={item.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Newspaper className="h-4 w-4" aria-hidden />
          </div>
        )}
      </div>
      <time className="hidden text-xs text-slate-400 font-sans tabular-nums whitespace-nowrap md:block md:text-sm">
        {formatNewsDate(item.publishedAt ?? item.createdAt)}
      </time>
      <div className="hidden md:flex gap-2">
        {getContentCategories(item.category).map((cat) => (
          <CategoryBadge key={cat.id} category={cat} />
        ))}
      </div>
      <div className="min-w-0">
        <time className="mb-1 block font-sans text-[11px] text-slate-400 tabular-nums md:hidden">
          {formatNewsDate(item.publishedAt ?? item.createdAt)}
        </time>
        <div className="line-clamp-2 font-sans text-sm leading-snug text-slate-700 transition-colors duration-200 group-hover:text-amami-blue md:text-base">
          {item.title}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amami-blue group-hover:translate-x-1 transition-all duration-200" />
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 md:py-24">
      <Newspaper className="w-10 h-10 text-slate-200 mx-auto mb-4" />
      <p className="text-slate-400 text-sm font-sans">お知らせはまだありません</p>
    </div>
  );
}

export function NewsSection({ news }: { news: News[] }) {
  return (
    <section id="news" className="bg-gradient-to-b from-white to-slate-50 py-20 md:py-32 relative overflow-hidden">
      {news.length > 0 && (
        <WaveBackground color="green" position="bottom" opacity={0.1} speed={55} />
      )}
      <div className="container relative z-10 mx-auto max-w-4xl px-4">
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <SectionEyebrow label="News" color="green" />
          <h2 className="text-3xl font-serif leading-tight text-slate-800 [letter-spacing:0] md:text-5xl">
            お知らせ
          </h2>
          {news.length > 0 && (
            <Link
              href="/news"
              className="group mt-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors duration-300 hover:text-amami-green font-sans"
            >
              <span>すべて見る</span>
              <span className="sr-only">お知らせ一覧へ</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
        {news.length > 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-8">
            {news.map((item) => (
              <NewsItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
