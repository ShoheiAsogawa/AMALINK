import type { Metadata } from "next";
import { NewsListView, newsListMetadata } from "@/components/pages/NewsListView";

export const revalidate = 0;
export const metadata: Metadata = newsListMetadata("ja");

export default function NewsListPage() {
  return <NewsListView locale="ja" />;
}
