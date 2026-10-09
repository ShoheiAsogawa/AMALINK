import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { CoverImage } from "@/components/content/CoverImage";
import { formatNewsDate, postHref, type News } from "@/lib/cms";
import { stripHtmlToDescription } from "@/lib/seo";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export function ColumnsSection({ columns }: { columns: News[] }) {
  if (columns.length === 0) return null;

  return (
    <section id="column" className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="container relative z-10 mx-auto max-w-5xl px-4">
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
        <div className="grid gap-6 md:grid-cols-3">
          {columns.map((item) => (
            <Link
              key={item.id}
              href={postHref(item)}
              className="group overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/60 transition-colors hover:bg-white"
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
                    <BookOpen className="h-7 w-7" aria-hidden />
                  </div>
                )}
              </div>
              <div className="p-5">
                <time className="font-sans text-xs text-slate-400 tabular-nums">
                  {formatNewsDate(item.publishedAt ?? item.createdAt)}
                </time>
                <h3 className="mt-2 font-serif text-lg leading-snug text-slate-800 transition-colors group-hover:text-amami-blue">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 font-sans text-sm leading-relaxed text-slate-500">
                  {stripHtmlToDescription(item.content, 72)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
