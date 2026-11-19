import type { Metadata } from "next";
import { ColumnListView } from "@/components/content/ColumnListView";
import { getColumnList } from "@/lib/cms";
import { absoluteUrl, OG_IMAGE, SITE_NAME } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "コラム",
  description: `${SITE_NAME}のコラムです。制作、AI、島の仕事について書いた読み物を、ジャンル別に掲載しています。`,
  alternates: { canonical: "/column" },
  openGraph: {
    images: [OG_IMAGE],
    url: absoluteUrl("/column"),
    title: `コラム | ${SITE_NAME}`,
    description: `${SITE_NAME}のコラムです。制作、AI、島の仕事について書いた読み物を掲載しています。`,
  },
  twitter: {
    card: "summary_large_image",
    title: `コラム | ${SITE_NAME}`,
    description: `${SITE_NAME}のコラムです。`,
    images: [OG_IMAGE],
  },
};

export default async function ColumnListPage() {
  const { contents: columns } = await getColumnList({ limit: 100 });
  return <ColumnListView columns={columns} />;
}
