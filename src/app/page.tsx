import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { NewsSection } from "@/components/sections/News";
import { Contact } from "@/components/sections/Contact";
import { getNewsList } from "@/lib/microcms";
import { GameGateway } from "@/components/game/GameGateway";
import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} - 島のリズムで、未来をつくる。`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    url: absoluteUrl("/"),
    title: `${SITE_NAME} - 島のリズムで、未来をつくる。`,
    description: DEFAULT_DESCRIPTION,
  },
};

export const revalidate = 60;

export default async function Home() {
  let news: Awaited<ReturnType<typeof getNewsList>>["contents"] = [];
  try {
    const res = await getNewsList({ limit: 5 });
    news = res.contents;
  } catch {
    // microCMS 未接続時は空配列のまま表示
  }

  return (
    <GameGateway>
      <main className="overflow-hidden">
        <Header />
        <Hero />
        <About />
        <Services />
        <NewsSection news={news} />
        <Contact />
        <Footer />
      </main>
    </GameGateway>
  );
}
