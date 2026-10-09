import type { Metadata } from "next";
import type { News } from "@/lib/cms";
import { postHref } from "@/lib/cms";
import { absoluteCover, absoluteUrl, buildArticleDescription, SITE_NAME } from "@/lib/seo";

export function articleMetadata(post: News): Metadata {
  const path = postHref(post);
  // 手入力の説明文があればそれ、無ければ本文の最初の2文（160字まで）
  const description = buildArticleDescription(post);
  const published = post.publishedAt ?? post.createdAt;
  const modified = post.updatedAt ?? published;
  const image = absoluteCover(post.coverUrl);

  return {
    title: post.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: absoluteUrl(path),
      title: post.title,
      description,
      publishedTime: published,
      modifiedTime: modified,
      siteName: SITE_NAME,
      images: image ? [{ url: image, alt: post.coverAlt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
