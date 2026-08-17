import type { Metadata } from "next";
import { NewsListView, newsListMetadata } from "@/components/pages/NewsListView";

export const revalidate = 0;
export const metadata: Metadata = newsListMetadata("en");

export default function EnglishNewsListPage() {
  return <NewsListView locale="en" />;
}
