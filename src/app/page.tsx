import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { NewsSection } from "@/components/sections/News";
import { Contact } from "@/components/sections/Contact";
import { MarqueeSpacer } from "@/components/ui/MarqueeSpacer";
import { getNewsList, getArticlesList } from "@/lib/microcms";
import { GameGateway } from "@/components/game/GameGateway";
import { ArticlesSection } from "@/components/sections/Articles";
import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
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
  let articles: Awaited<ReturnType<typeof getArticlesList>>["contents"] = [];
  try {
    const res = await getNewsList({ limit: 5 });
    news = res.contents;
  } catch {
    // microCMS 未接続時は空配列のまま表示
  }
  try {
    const res = await getArticlesList({ limit: 3 });
    articles = res.contents;
  } catch {
    // articles API 未作成時は空配列
  }

  return (
    <GameGateway>
      <main className="overflow-hidden">
        <Header />
        <Hero />
        <MarqueeSpacer phrase="PHILOSOPHY" />
        <About />
        <MarqueeSpacer phrase="AMALINK SERVICES" className="bg-white" />
        <Services />
        <NewsSection news={news} />
        <ArticlesSection articles={articles} />
        <Contact />
        <Footer />
      </main>
    </GameGateway>
  );
}
