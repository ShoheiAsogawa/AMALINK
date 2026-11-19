import type { Metadata } from "next";
import { ColumnListView } from "@/components/content/ColumnListView";
import { getColumnList } from "@/lib/cms";
import {
  COLUMN_GENRE_IDS,
  columnGenrePath,
  getColumnGenre,
  isColumnGenreId,
} from "@/lib/column-genre";
import { absoluteUrl, OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return COLUMN_GENRE_IDS.map((genre) => ({ genre }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ genre: string }>;
}): Promise<Metadata> {
  const { genre: id } = await params;
  const genre = getColumnGenre(id);
  if (!genre) return { title: "コラム" };
  const path = columnGenrePath(genre.id);
  return {
    title: genre.seoTitle,
    description: genre.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      images: [OG_IMAGE],
      url: absoluteUrl(path),
      title: `${genre.seoTitle} | ${SITE_NAME}`,
      description: genre.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${genre.seoTitle} | ${SITE_NAME}`,
      description: genre.seoDescription,
      images: [OG_IMAGE],
    },
  };
}

export default async function ColumnGenrePage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre: id } = await params;
  if (!isColumnGenreId(id)) notFound();
  const { contents: columns } = await getColumnList({ limit: 100 });
  return <ColumnListView columns={columns} activeGenre={id} />;
}
