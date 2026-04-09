import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { NewsSection } from "@/components/sections/News";
import { Contact } from "@/components/sections/Contact";
import { getNewsList } from "@/lib/microcms";

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
    <main className="overflow-hidden">
      <Header />
      <Hero />
      <About />
      <Services />
      <NewsSection news={news} />
      <Contact />
      <Footer />
    </main>
  );
}
