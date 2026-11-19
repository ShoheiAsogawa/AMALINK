import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ContentSwitch } from "@/components/content/ContentSwitch";
import { CoverImage } from "@/components/content/CoverImage";
import { formatNewsDate, postHref, type News } from "@/lib/cms";
import {
  COLUMN_GENRES,
  columnGenrePath,
  getColumnGenre,
  resolveColumnGenre,
  type ColumnGenreId,
} from "@/lib/column-genre";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export function ColumnListView({
  columns,
  activeGenre,
}: {
  columns: News[];
  activeGenre?: ColumnGenreId;
}) {
  const genre = activeGenre ? getColumnGenre(activeGenre) : undefined;
  const visible = activeGenre
    ? columns.filter((item) => resolveColumnGenre(item) === activeGenre)
    : columns;
  const counts = Object.fromEntries(COLUMN_GENRES.map((item) => [item.id, 0])) as Record<
    ColumnGenreId,
    number
  >;
  for (const item of columns) {
    counts[resolveColumnGenre(item)] += 1;
  }

  return (
    <main className="overflow-hidden">
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-8 md:mb-10">
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.28em] text-amami-blue md:text-xs md:tracking-[0.32em]">
              Column
            </p>
            <h1 className="font-serif text-3xl leading-tight text-slate-800 [overflow-wrap:anywhere] md:text-5xl">
              {genre ? genre.label : "コラム"}
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-sm leading-loose text-slate-500 md:text-[15px]">
              {genre
                ? genre.lead
                : "サービスや現場の話を、少し長く書いた記事です。ジャンルから探せます。"}
            </p>
          </div>
          <ContentSwitch current="column" />
          <nav
            aria-label="コラムのジャンル"
            className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mb-10 md:flex-wrap md:gap-2.5 md:overflow-visible md:px-0"
          >
            <GenreChip href="/column" active={!activeGenre} count={columns.length}>
              すべて
            </GenreChip>
            {COLUMN_GENRES.map((item) => (
              <GenreChip
                key={item.id}
                href={columnGenrePath(item.id)}
                active={activeGenre === item.id}
                count={counts[item.id]}
              >
                {item.label}
              </GenreChip>
            ))}
          </nav>
          {visible.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
              {visible.map((item) => {
                const itemGenre = getColumnGenre(resolveColumnGenre(item));
                return (
                  <li key={item.id}>
                    <Link
                      href={postHref(item)}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(28,36,48,0.06)] ring-1 ring-slate-100/80 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(28,36,48,0.1)]"
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
                            <BookOpen className="h-6 w-6" aria-hidden />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4">
                        <div className="mb-1.5 flex items-center gap-1.5 overflow-hidden">
                          <time className="shrink-0 font-sans text-[10px] text-slate-400 tabular-nums sm:text-xs">
                            {formatNewsDate(item.publishedAt ?? item.createdAt)}
                          </time>
                          {itemGenre && !activeGenre ? (
                            <span className="hidden min-w-0 truncate rounded-full bg-amami-blue-light/50 px-2 py-0.5 font-sans text-[10px] tracking-wide text-amami-blue sm:inline-block">
                              {itemGenre.label}
                            </span>
                          ) : null}
                        </div>
                        <span className="line-clamp-4 font-sans text-[13px] leading-[1.65] tracking-wide text-slate-800 transition-colors duration-200 [overflow-wrap:anywhere] group-hover:text-amami-blue sm:line-clamp-3 sm:text-sm md:text-[15px] md:leading-snug">
                          {item.title}
                        </span>
                        <span className="mt-auto hidden pt-3 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-amami-blue sm:inline-flex sm:items-center">
                          <ArrowRight className="h-4 w-4" aria-hidden />
                          <span className="sr-only">記事を読む</span>
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-24 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-200" aria-hidden />
              <p className="font-sans text-sm text-slate-400">このジャンルのコラムはまだありません</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function GenreChip({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 font-sans text-[12px] tracking-wide transition-[color,background-color,border-color,transform] duration-200 md:h-10 md:px-3.5 md:text-[13px] ${
        active
          ? "bg-slate-800 text-white"
          : "bg-white text-slate-600 ring-1 ring-slate-200/90 hover:-translate-y-px hover:text-amami-blue hover:ring-amami-blue/40"
      }`}
    >
      <span>{children}</span>
      <span className={`tabular-nums ${active ? "text-white/70" : "text-slate-400"}`}>{count}</span>
    </Link>
  );
}
