import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getNewsList, getNewsEntry } from "@/lib/microcms";
import type { Category } from "@/lib/microcms";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

/** `output: export` で `generateStaticParams` が空のときのビルド制約を避ける */
export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  const { contents } = await getNewsList({ limit: 100 });
  return contents.map((item) => ({ slug: item.slug ?? item.id }));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getCategories(category: Category | Category[] | undefined): Category[] {
  if (!category) return [];
  return Array.isArray(category) ? category : [category];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const news = await getNewsEntry(slug);
    return {
      title: `${news.title} | AMALINK`,
      description: news.title,
    };
  } catch {
    return { title: "お知らせ | AMALINK" };
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let news;
  try {
    news = await getNewsEntry(slug);
  } catch {
    notFound();
  }

  return (
    <main className="overflow-hidden">
      <Header />
      <article className="pt-32 md:pt-40 pb-20 md:pb-32 min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-amami-green font-sans mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            お知らせ一覧へ
          </Link>
          <header className="mb-10">
            <time className="text-sm text-slate-400 font-sans tabular-nums block mb-4">
              {formatDate(news.publishedAt ?? news.createdAt)}
            </time>
            <div className="flex flex-wrap gap-2 mb-6">
              {getCategories(news.category).map((cat) => (
                <span
                  key={cat.id}
                  className="inline-block text-[10px] md:text-xs px-3 py-0.5 rounded-full bg-amami-blue-light/40 text-amami-blue font-sans tracking-wide"
                >
                  {cat.title}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-4xl font-serif text-slate-800 leading-snug">{news.title}</h1>
          </header>
          <div
            className="font-sans text-slate-700 leading-loose [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-serif [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-serif [&_h3]:mt-8 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-amami-blue [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </article>
      <Footer />
    </main>
  );
}
