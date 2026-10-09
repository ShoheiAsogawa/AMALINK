import type { Metadata } from "next";
import type { News } from "@/lib/cms";
import { postHref } from "@/lib/cms";
import { absoluteCover, absoluteUrl, SITE_NAME, stripHtmlToDescription } from "@/lib/seo";

export function articleMetadata(post: News): Metadata {
  const path = postHref(post);
  const description = stripHtmlToDescription(post.content) || post.title;
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
      images: image ? [{ url: image, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
