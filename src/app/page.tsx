import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { MarqueeSpacer } from "@/components/ui/MarqueeSpacer";
import { getNewsList } from "@/lib/microcms";
import { GameGateway } from "@/components/game/GameGateway";
import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";

/** 初回バンドルを薄くするため、下部セクションは分割読み込み（見た目は同じ） */
const About = dynamic(() =>
  import("@/components/sections/About").then((m) => ({ default: m.About })),
);
const Services = dynamic(() =>
  import("@/components/sections/Services").then((m) => ({ default: m.Services })),
);
const NewsSection = dynamic(() =>
  import("@/components/sections/News").then((m) => ({ default: m.NewsSection })),
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => ({ default: m.Contact })),
);

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
  try {
    const res = await getNewsList({ limit: 5 });
    news = res.contents;
  } catch {
    // microCMS 未接続時は空配列のまま表示
  }

  return (
    <GameGateway>
      <main className="overflow-x-clip">
        <Header />
        <Hero />
        <MarqueeSpacer phrase="PHILOSOPHY" />
        <About />
        <MarqueeSpacer phrase="AMALINK SERVICES" className="bg-white" />
        <Services />
        <NewsSection news={news} />
        <Contact />
        <Footer />
      </main>
    </GameGateway>
  );
}
