"use client";

import { WaveBackground } from "@/components/ui/WaveBackground";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ArrowRight, Newspaper } from "lucide-react";
import Link from "next/link";
import type { News } from "@/lib/microcms";
import { formatMicroCmsDate, getContentCategories } from "@/lib/microcms";
import { useLocale } from "@/components/i18n/useLocale";
import { withLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

function CategoryBadge({ category }: { category: { id: string; title: string } }) {
  return (
    <span className="inline-block text-[10px] md:text-xs px-3 py-0.5 rounded-full bg-amami-blue-light/40 text-amami-blue font-sans tracking-wide">
      {category.title}
    </span>
  );
}

function NewsItem({ item }: { item: News }) {
  const locale = useLocale();
  return (
    <Link
      href={withLocale(`/news/${item.slug ?? item.id}`, locale)}
      className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[120px_auto_1fr_32px] items-center gap-3 md:gap-6 py-5 md:py-6 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors duration-200 px-2 -mx-2 rounded-lg"
    >
      <time className="text-xs md:text-sm text-slate-400 font-sans tabular-nums whitespace-nowrap">
        {formatMicroCmsDate(item.publishedAt ?? item.createdAt)}
      </time>
      <div className="hidden md:flex gap-2">
        {getContentCategories(item.category).map((cat) => (
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
  const t = getMessages(useLocale()).news;
  return (
    <div className="text-center py-16 md:py-24">
      <Newspaper className="w-10 h-10 text-slate-200 mx-auto mb-4" />
      <p className="text-slate-400 text-sm font-sans">{t.empty}</p>
    </div>
  );
}

export function NewsSection({ news }: { news: News[] }) {
  const locale = useLocale();
  const t = getMessages(locale).news;
  return (
    <section id="news" className="bg-gradient-to-b from-white to-slate-50 py-20 md:py-32 relative overflow-hidden">
      {news.length > 0 && (
        <WaveBackground color="green" position="bottom" opacity={0.1} speed={55} />
      )}
      <div className="container relative z-10 mx-auto max-w-4xl px-4">
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <SectionEyebrow label="News" color="green" />
          <h2 className="text-3xl font-serif leading-tight text-slate-800 [letter-spacing:0] [word-break:keep-all] md:text-5xl">
            {t.heading}
          </h2>
          {news.length > 0 && (
            <Link
              href={withLocale("/news", locale)}
              className="group mt-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors duration-300 hover:text-amami-green font-sans"
            >
              <span>{t.viewAll}</span>
              <span className="sr-only">{t.viewAllSr}</span>
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
