import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { NewsSection } from "@/components/sections/News";
import { ColumnsSection } from "@/components/sections/Columns";
import { Contact } from "@/components/sections/Contact";
import { MarqueeSpacer } from "@/components/ui/MarqueeSpacer";
import { getColumnList, getNewsList } from "@/lib/cms";
import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "合同会社AMALINK",
    "AMALINK",
    "奄美大島",
    "ホームページ制作",
    "デザイン",
    "GEO対策",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    url: absoluteUrl("/"),
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
  },
};

export const revalidate = 60;

export default async function Home() {
  let news: Awaited<ReturnType<typeof getNewsList>>["contents"] = [];
  let columns: Awaited<ReturnType<typeof getColumnList>>["contents"] = [];
  try {
    const [newsRes, columnRes] = await Promise.all([
      getNewsList({ limit: 5 }),
      getColumnList({ limit: 3 }),
    ]);
    news = newsRes.contents;
    columns = columnRes.contents;
  } catch {
    // CMS に届かないときは同梱の移行データに戻る
  }

  return (
    <main className="overflow-x-clip">
      <Header />
      <Hero />
      <MarqueeSpacer phrase="PHILOSOPHY" />
      <About />
      <MarqueeSpacer phrase="AMALINK SERVICES" className="bg-white" />
      <Services />
      <NewsSection news={news} />
      <ColumnsSection columns={columns} />
      <Contact />
      <Footer />
    </main>
  );
}
