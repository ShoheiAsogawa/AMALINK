import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { CoverImage } from "@/components/content/CoverImage";
import { formatNewsDate, postHref, type News } from "@/lib/cms";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export function ColumnsSection({ columns }: { columns: News[] }) {
  if (columns.length === 0) return null;

  return (
    <section id="column" className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="container relative z-10 mx-auto max-w-4xl px-4">
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <SectionEyebrow label="Column" color="blue" />
          <h2 className="font-serif text-3xl leading-tight text-slate-800 [letter-spacing:0] md:text-5xl">コラム</h2>
          <Link
            href="/column"
            className="group mt-6 inline-flex items-center gap-2 font-sans text-sm text-slate-500 transition-colors duration-300 hover:text-amami-blue"
          >
            <span>すべて見る</span>
            <span className="sr-only">コラム一覧へ</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        {/* お知らせ欄（News.tsx）と同じ、サムネイル付きの1行リスト */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-8">
          {columns.map((item) => (
            <Link
              key={item.id}
              href={postHref(item)}
              className="group -mx-2 grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border-b border-slate-100 px-2 py-4 transition-colors duration-200 last:border-b-0 hover:bg-slate-50/50 md:grid-cols-[104px_120px_minmax(0,1fr)_32px] md:gap-5 md:py-5"
            >
              <div className="h-12 w-[72px] overflow-hidden rounded-lg bg-slate-100 md:h-14 md:w-[104px]">
                {item.coverUrl ? (
                  <CoverImage src={item.coverUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <BookOpen className="h-4 w-4" aria-hidden />
                  </div>
                )}
              </div>
              <time className="hidden whitespace-nowrap font-sans text-xs text-slate-400 tabular-nums md:block md:text-sm">
                {formatNewsDate(item.publishedAt ?? item.createdAt)}
              </time>
              <div className="min-w-0">
                <time className="mb-1 block font-sans text-[11px] text-slate-400 tabular-nums md:hidden">
                  {formatNewsDate(item.publishedAt ?? item.createdAt)}
                </time>
                <div className="line-clamp-2 font-sans text-sm leading-snug text-slate-700 transition-colors duration-200 group-hover:text-amami-blue md:text-base">
                  {item.title}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-amami-blue" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
