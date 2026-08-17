import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { NewsSection } from "@/components/sections/News";
import { Contact } from "@/components/sections/Contact";
import { MarqueeSpacer } from "@/components/ui/MarqueeSpacer";
import { getNewsList } from "@/lib/microcms";
import { localeMetadata } from "@/lib/i18n-meta";
import { LEGAL_NAME, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = localeMetadata(
  "en",
  "/",
  `${LEGAL_NAME} (${SITE_NAME}) | AI, web, and design from Amami Oshima`,
  "Godo Kaisha AMALINK is a digital creative team on Amami Oshima. AI consulting, websites, systems, design, and GEO — online nationwide.",
);

export const revalidate = 60;

export default async function EnglishHome() {
  let news: Awaited<ReturnType<typeof getNewsList>>["contents"] = [];
  try {
    const res = await getNewsList({ limit: 5 });
    news = res.contents;
  } catch {
    // microCMS 未接続時は空配列のまま表示
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
      <Contact />
      <Footer />
    </main>
  );
}
