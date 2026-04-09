import { WaveBackground } from "@/components/ui/WaveBackground";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import type { News, Category } from "@/lib/microcms";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-block text-[10px] md:text-xs px-3 py-0.5 rounded-full bg-amami-blue-light/40 text-amami-blue font-sans tracking-wide">
      {category.title}
    </span>
  );
}

function getCategories(category: Category | Category[] | undefined): Category[] {
  if (!category) return [];
  return Array.isArray(category) ? category : [category];
}

function NewsItem({ item }: { item: News }) {
  return (
    <Link
      href="/news"
      className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[120px_auto_1fr_32px] items-center gap-3 md:gap-6 py-5 md:py-6 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors duration-200 px-2 -mx-2 rounded-lg"
    >
      <time className="text-xs md:text-sm text-slate-400 font-sans tabular-nums whitespace-nowrap">
        {formatDate(item.publishedAt ?? item.createdAt)}
      </time>
      <div className="hidden md:flex gap-2">
        {getCategories(item.category).map((cat) => (
          <CategoryBadge key={cat.id} category={cat} />
        ))}
      </div>
      <div className="text-sm md:text-base text-slate-700 font-sans truncate group-hover:text-amami-blue transition-colors duration-200">
        {item.title}
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
      <WaveBackground color="green" position="bottom" opacity={0.1} speed={0.3} />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-amami-green" />
              <span className="text-amami-green text-xs font-bold tracking-[0.2em] uppercase">News</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-800 leading-tight">お知らせ</h2>
          </div>
          {news.length > 0 && (
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 text-sm text-slate-500 hover:text-amami-green font-sans transition-colors duration-300"
            >
              <span>すべて見る</span>
              <span className="sr-only">お知らせ一覧へ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}
        </div>
        {news.length > 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-100 p-4 md:p-8 shadow-sm">
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
