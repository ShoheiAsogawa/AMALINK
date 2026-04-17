import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import type { News } from "@/lib/microcms";

type Props = {
  news: News;
  pathSegment: string;
};

export function ArticleJsonLd({ news, pathSegment }: Props) {
  const url = absoluteUrl(`/news/${pathSegment}`);
  const published = news.publishedAt ?? news.createdAt;
  const modified = news.updatedAt ?? published;

  const payload = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
