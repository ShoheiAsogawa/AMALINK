import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChunkyNextLink } from "@/components/ui/ChunkyButton";
import {
  formatMicroCmsDate,
  getArticleEntry,
  getArticlesList,
  getContentCategories,
} from "@/lib/microcms";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { absoluteUrl, LEGAL_NAME, SITE_NAME, stripHtmlToDescription } from "@/lib/seo";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const { contents } = await getArticlesList({ limit: 100 });
    return (contents ?? []).map((item) => ({ slug: item.slug ?? item.id }));
  } catch {
    return [];
  }
}

function articleDescription(
  description: string | undefined,
  content: string,
  title: string,
): string {
  const trimmed = description?.trim();
  if (trimmed) return trimmed;
  return stripHtmlToDescription(content) || title;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const article = await getArticleEntry(slug);
    const path = `/articles/${article.slug ?? slug}`;
    const description = articleDescription(
      article.description,
      article.content,
      article.title,
    );
    const published = article.publishedAt ?? article.createdAt;
    const modified = article.updatedAt ?? published;

    return {
      title: article.title,
      description,
      alternates: { canonical: path },
      openGraph: {
        type: "article",
        url: absoluteUrl(path),
        title: article.title,
        description,
        publishedTime: published,
        modifiedTime: modified,
        siteName: SITE_NAME,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description,
      },
    } satisfies Metadata;
  } catch {
    return { title: "コラム・ガイド" } satisfies Metadata;
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let article;
  try {
    article = await getArticleEntry(slug);
  } catch {
    notFound();
  }

  const pathSegment = article.slug ?? slug;
  const description = articleDescription(
    article.description,
    article.content,
    article.title,
  );
  const categories = getContentCategories(article.category);
  const articleSection = categories[0]?.title;

  return (
    <main className="overflow-hidden">
      <ArticleJsonLd
        title={article.title}
        description={description}
        pathPrefix="/articles"
        pathSegment={pathSegment}
        schemaType="BlogPosting"
        publishedAt={article.publishedAt}
        createdAt={article.createdAt}
        updatedAt={article.updatedAt}
        articleSection={articleSection}
      />
      <Header />
      <article className="pt-32 md:pt-40 pb-20 md:pb-32 min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-amami-blue font-sans mb-10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            コラム・ガイド一覧へ
          </Link>
          <header className="mb-10">
            <time className="text-sm text-slate-400 font-sans tabular-nums block mb-4">
              {formatMicroCmsDate(article.publishedAt ?? article.createdAt)}
            </time>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-block text-[10px] md:text-xs px-3 py-0.5 rounded-full bg-amami-blue-light/40 text-amami-blue font-sans tracking-wide"
                  >
                    {cat.title}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-2xl md:text-4xl font-serif text-slate-800 leading-snug">
              {article.title}
            </h1>
            {article.description?.trim() && (
              <p className="mt-6 rounded-2xl border border-amami-blue/15 bg-amami-blue-light/10 px-5 py-4 font-sans text-sm leading-loose text-slate-700 md:text-base">
                {article.description.trim()}
              </p>
            )}
          </header>
          <div
            className="font-sans text-slate-700 leading-loose [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-serif [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-serif [&_h3]:mt-8 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-amami-blue [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          <aside className="mt-16 rounded-2xl border border-slate-100 bg-white p-6 md:p-8">
            <p className="mb-4 font-sans text-sm leading-loose text-slate-600">
              {LEGAL_NAME}（{SITE_NAME}）は、鹿児島県奄美大島を拠点にホームページ制作・システム開発・GEO対策を行っています。
              記事の内容についてのご相談もお気軽にどうぞ。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ChunkyNextLink href="/faq" theme="neu" className="inline-flex justify-center">
                よくある質問
              </ChunkyNextLink>
              <ChunkyNextLink href="/contact" theme="primary" className="inline-flex justify-center">
                お問い合わせ
              </ChunkyNextLink>
            </div>
          </aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}
