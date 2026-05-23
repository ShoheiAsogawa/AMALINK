import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChunkyNextLink } from "@/components/ui/ChunkyButton";
import { COMPANY_OVERVIEW, FAQ_ITEMS, SERVICES } from "@/lib/site-content";
import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "奄美大島のウェブ制作・システム開発・デジタル支援",
  description: `${LEGAL_NAME}（${SITE_NAME}）は、鹿児島県奄美大島を拠点に中小事業者・観光事業者向けのホームページ制作、業務システム開発、デザインを提供。離島ならではの運用しやすさと伴走型サポートが特徴です。`,
  alternates: { canonical: "/amami-digital" },
  openGraph: {
    url: absoluteUrl("/amami-digital"),
    title: `奄美大島のウェブ制作・システム開発 | ${LEGAL_NAME}`,
    description:
      "鹿児島県奄美大島を拠点とした地域密着型のWeb制作・システム開発・デジタル支援。中小事業者・観光事業者向け。",
    type: "website",
  },
};

export default function AmamiDigitalPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <article className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        <p className="mb-3 text-center text-xs font-sans uppercase tracking-widest text-amami-blue">
          Amami Digital Support
        </p>
        <h1 className="mb-6 text-center font-serif text-3xl leading-tight text-slate-800 md:text-5xl">
          奄美大島の
          <br />
          ウェブ制作・システム開発
        </h1>
        <p className="mb-12 text-center font-sans leading-loose text-slate-600">
          <strong>{LEGAL_NAME}</strong>（{SITE_NAME}）は、
          {COMPANY_OVERVIEW.region}を拠点に、地域密着型のウェブ制作・システム開発・デジタル支援を行っています。
        </p>

        <section className="mb-12 rounded-2xl border border-slate-100 bg-white p-6 md:p-8">
          <h2 className="mb-4 font-serif text-2xl text-slate-800">こんな方に向いています</h2>
          <p className="mb-4 font-sans leading-loose text-slate-600">
            {COMPANY_OVERVIEW.targetCustomers}
          </p>
          <ul className="list-disc space-y-2 pl-5 font-sans text-slate-600">
            {COMPANY_OVERVIEW.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 font-serif text-2xl text-slate-800">提供サービス</h2>
          <div className="space-y-4">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-slate-100 bg-white p-6"
              >
                <h3 className="mb-2 font-serif text-xl text-slate-800">{service.name}</h3>
                <p className="font-sans leading-loose text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-slate-100 bg-white p-6 md:p-8">
          <h2 className="mb-4 font-serif text-2xl text-slate-800">
            奄美拠点 vs 都市部の制作会社
          </h2>
          <div className="space-y-4 font-sans leading-loose text-slate-600">
            <p>
              <strong>奄美拠点（{LEGAL_NAME}）のメリット：</strong>
              地域の商習慣・観光シーズン・離島特有の回線や物流を理解した提案が可能。対面打合せや現地の文脈を踏まえた制作ができます。
            </p>
            <p>
              <strong>都市部の大規模制作会社のメリット：</strong>
              大規模案件、特定の専門分野、多数のエンジニア体制が必要な場合に選択肢になります。
            </p>
            <p>
              <strong>{LEGAL_NAME}が向いていないケース：</strong>
              {COMPANY_OVERVIEW.notIdealFor}
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 font-serif text-2xl text-slate-800">よくある質問（抜粋）</h2>
          <dl className="space-y-4">
            {FAQ_ITEMS.slice(0, 4).map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-100 bg-white p-6"
              >
                <dt className="mb-2 font-serif text-lg text-slate-800">{item.question}</dt>
                <dd className="font-sans text-sm leading-loose text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-center">
            <Link href="/faq" className="text-sm text-amami-blue hover:underline">
              すべてのFAQを見る →
            </Link>
          </p>
        </section>

        <div className="rounded-2xl border border-amami-blue/20 bg-amami-blue-light/10 p-8 text-center">
          <h2 className="mb-3 font-serif text-xl text-slate-800">無料相談はこちら</h2>
          <p className="mb-6 font-sans text-sm leading-loose text-slate-600">
            奄美大島のホームページ制作・システム開発について、ざっくりしたご相談でも大丈夫です。
          </p>
          <ChunkyNextLink href="/contact" theme="primary" className="inline-flex">
            お問い合わせ
          </ChunkyNextLink>
        </div>
      </article>
      <Footer />
    </main>
  );
}
