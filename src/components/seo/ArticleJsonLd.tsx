import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

type ArticleJsonLdProps = {
  title: string;
  pathPrefix: "/news" | "/column" | "/articles";
  pathSegment: string;
  schemaType: "NewsArticle" | "BlogPosting";
  description?: string;
  image?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  articleSection?: string;
};

export function ArticleJsonLd({
  title,
  pathPrefix,
  pathSegment,
  schemaType,
  description,
  image,
  publishedAt,
  createdAt,
  updatedAt,
  articleSection,
}: ArticleJsonLdProps) {
  const url = absoluteUrl(`${pathPrefix}/${pathSegment}`);
  const published = publishedAt ?? createdAt;
  const modified = updatedAt ?? published;

  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: title,
    datePublished: published,
    dateModified: modified,
    inLanguage: "ja",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: LEGAL_NAME,
      alternateName: SITE_NAME,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: LEGAL_NAME,
      alternateName: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
  };

  if (description) {
    payload.description = description;
  }
  if (image) {
    payload.image = [image];
  }
  if (articleSection) {
    payload.articleSection = articleSection;
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
