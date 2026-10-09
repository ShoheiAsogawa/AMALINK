import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CoverImage } from "@/components/content/CoverImage";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { categoryPath, formatNewsDate, getContentCategories, postKind, showsHeroCover, type News } from "@/lib/cms";
import { absoluteCover, buildArticleDescription } from "@/lib/seo";
import { articleBodyClassName } from "@/lib/article-style";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ArticleView({ post }: { post: News }) {
  const kind = postKind(post.kind);
  const pathPrefix = kind === "column" ? "/column" : "/news";
  const backHref = kind === "column" ? "/column" : "/news";
  const backLabel = kind === "column" ? "コラム一覧へ" : "お知らせ一覧へ";
  const categories = getContentCategories(post.category);
  // 手入力の説明文があればそれ、無ければ本文の最初の2文
  const description = buildArticleDescription(post);
  // 最初の段落を「要点」ボックスにするのは読み物だけ（お知らせ＝announce カテゴリは対象外）。
  // 見た目は src/lib/article-style.ts の設定（いまは c＝黒地の案C）
  const isArticle = kind === "column" || categories.some((cat) => cat.id !== "announce");
  const image = absoluteCover(post.coverUrl);

  return (
    <main className="overflow-hidden">
      <ArticleJsonLd
        title={post.title}
        description={description}
        image={image}
        pathPrefix={pathPrefix}
        pathSegment={post.slug ?? post.id}
        schemaType={kind === "column" ? "BlogPosting" : "NewsArticle"}
        articleSection={categories[0]?.title}
        publishedAt={post.publishedAt}
        createdAt={post.createdAt}
        updatedAt={post.updatedAt}
      />
      <Header />
      <article className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto max-w-3xl px-6">
          <Link
            href={backHref}
            className="mb-10 inline-flex items-center gap-2 font-sans text-sm text-slate-500 transition-colors hover:text-amami-green"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          <header className="mb-10">
            <time className="mb-4 block font-sans text-sm text-slate-400 tabular-nums">
              {formatNewsDate(post.publishedAt ?? post.createdAt)}
            </time>
            {categories.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((cat) =>
                  kind === "news" ? (
                    // お知らせのカテゴリは、カテゴリの一覧ページへのリンクにする
                    <Link
                      key={cat.id}
                      href={categoryPath(cat.id)}
                      className="inline-block rounded-full bg-amami-blue-light/40 px-3 py-0.5 font-sans text-[10px] tracking-wide text-amami-blue transition-colors hover:bg-amami-blue-light/70 md:text-xs"
                    >
                      {cat.title}
                    </Link>
                  ) : (
                    <span
                      key={cat.id}
                      className="inline-block rounded-full bg-amami-blue-light/40 px-3 py-0.5 font-sans text-[10px] tracking-wide text-amami-blue md:text-xs"
                    >
                      {cat.title}
                    </span>
                  ),
                )}
              </div>
            )}
            <h1 className="font-serif text-2xl leading-snug text-slate-800 md:text-4xl">{post.title}</h1>
          </header>
          {showsHeroCover(post) && post.coverUrl && (
            <CoverImage
              src={post.coverUrl}
              alt={post.coverAlt ?? ""}
              className="mb-10 aspect-[16/9] w-full rounded-3xl object-cover"
            />
          )}
          <div
            className={articleBodyClassName(isArticle)}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
      <Footer />
    </main>
  );
}
