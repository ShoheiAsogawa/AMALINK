import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqPageJsonLd } from "@/components/seo/JsonLd";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ChunkyNextLink } from "@/components/ui/ChunkyButton";
import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: `よくある質問（FAQ）`,
  description: `${LEGAL_NAME}（${SITE_NAME}）へのよくある質問。ホームページ制作・システム開発・GEO対策の料金、対応エリア、選び方について回答します。`,
  alternates: { canonical: "/faq" },
  openGraph: {
    url: absoluteUrl("/faq"),
    title: `よくある質問（FAQ） | ${LEGAL_NAME}`,
    description: `奄美大島のWeb制作・システム開発・GEO対策に関するFAQ。${LEGAL_NAME}が回答します。`,
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <>
      <FaqPageJsonLd />
      <main className="min-h-screen bg-slate-50">
        <Header />
        <section className="mx-auto max-w-3xl px-6 pb-20 pt-32">
          <p className="mb-3 text-center text-xs font-sans uppercase tracking-widest text-amami-blue">
            FAQ
          </p>
          <h1 className="mb-4 text-center font-serif text-3xl text-slate-800 md:text-5xl">
            よくある質問
          </h1>
          <p className="mb-12 text-center font-sans leading-loose text-slate-500">
            ご依頼前によくいただく質問をまとめました。
            <br />
            ここにない内容も、お気軽にお問い合わせください。
          </p>

          <FaqAccordion />

          <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-8 text-center">
            <h2 className="mb-3 font-serif text-xl text-slate-800">
              気になることなんでも、お気軽にどうぞ。
            </h2>
            <p className="mb-6 font-sans text-sm leading-loose text-slate-500">
              概算だけ知りたい、こんなことできる？など、内容が決まっていなくても大丈夫です。
            </p>
            <ChunkyNextLink
              href="/contact"
              theme="primary"
              className="mx-auto inline-flex min-w-[15.5rem] sm:min-w-[17.5rem]"
            >
              <span className="whitespace-nowrap px-1">お問い合わせはこちら</span>
            </ChunkyNextLink>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            <Link href="/" className="hover:text-amami-blue">
              ← TOPへ
            </Link>
          </p>
        </section>
        <Footer />
      </main>
    </>
  );
}
