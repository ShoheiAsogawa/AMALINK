import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Contact } from "@/components/sections/Contact";
import { absoluteUrl, LEGAL_NAME } from "@/lib/seo";

const title = "奄美大島のシステム開発・業務効率化";
const description =
  "奄美大島・奄美群島の事業者向けに、予約管理・在庫管理・問い合わせ管理などのWebアプリ、業務システムを開発します。Excelや紙での運用整理から相談できます。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/system-development" },
  openGraph: {
    title: `${title} | ${LEGAL_NAME}`,
    description,
    url: absoluteUrl("/system-development"),
    type: "website",
  },
};

const examples = [
  {
    title: "予約管理",
    body: "電話・LINE・紙に分散した予約をまとめ、確認や変更をしやすくします。",
  },
  {
    title: "在庫・商品管理",
    body: "在庫数や入出庫を共有し、二重入力や確認の手間を減らします。",
  },
  {
    title: "問い合わせ・顧客管理",
    body: "対応状況や履歴を整理し、引き継ぎや対応漏れを防ぎます。",
  },
  {
    title: "集計・報告の自動化",
    body: "Excelへの転記や定型レポート作成など、繰り返し作業を省力化します。",
  },
];

const steps = [
  ["01", "現状を聞く", "いま使っている紙・Excel・既存サービスと、困っている作業を確認します。"],
  ["02", "小さく整理する", "必要な機能と後回しにできる機能を分け、無理のない範囲を決めます。"],
  ["03", "画面と動きを確かめる", "完成前に使い方を確認できる形を用意し、認識のずれを減らします。"],
  ["04", "開発・テスト", "実際の業務を想定して動作を確認し、必要な調整を行います。"],
  ["05", "導入・運用", "操作方法をご説明し、更新や改善についても必要に応じて伴走します。"],
] as const;

const faqs = [
  {
    id: "system-scope",
    question: "システム開発の内容が決まっていなくても相談できますか？",
    answer:
      "はい。「紙の記録を減らしたい」「Excelの転記が大変」といった困りごとの段階から整理します。最初から詳しい仕様書を用意する必要はありません。",
  },
  {
    id: "system-area",
    question: "奄美大島以外からも依頼できますか？",
    answer:
      "はい。奄美群島・鹿児島県内に加え、全国からオンラインでご相談いただけます。奄美大島では対面での打ち合わせもご相談ください。",
    singleLineOnMobile: true,
  },
  {
    id: "system-small-start",
    question: "小規模な業務改善でも依頼できますか？",
    answer:
      "可能です。必要な機能だけで小さく始め、実際の運用を見ながら追加する進め方にも対応します。",
    singleLineOnMobile: true,
  },
  {
    id: "system-price-timeline",
    question: "料金や開発期間はどのくらいですか？",
    answer:
      "対象業務、利用人数、必要な機能、既存データの状態によって変わります。現状を確認したうえで、範囲・概算費用・スケジュールをご案内します。",
    singleLineOnMobile: true,
  },
];

function JsonLd() {
  const url = absoluteUrl("/system-development");
  const organizationId = `${absoluteUrl("/")}#organization`;
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "システム開発・業務効率化支援",
        serviceType: "Webアプリ・業務システム開発",
        description,
        url,
        provider: { "@id": organizationId },
        areaServed: [
          { "@type": "Place", name: "奄美大島" },
          { "@type": "AdministrativeArea", name: "奄美群島" },
          { "@type": "Country", name: "日本" },
        ],
        audience: {
          "@type": "BusinessAudience",
          audienceType: "中小事業者・観光事業者・地域団体",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "システム開発",
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default function SystemDevelopmentPage() {
  return (
    <>
      <JsonLd />
      <main className="min-h-screen bg-white text-slate-800">
        <Header />

        <section className="bg-gradient-to-b from-amami-blue/10 to-white px-6 pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mx-auto max-w-5xl">
            <nav className="mb-10 font-sans text-sm text-slate-500" aria-label="パンくず">
              <Link href="/" className="hover:text-amami-blue">ホーム</Link>
              <span className="mx-2" aria-hidden>／</span>
              <span>システム開発</span>
            </nav>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
              System Development
            </p>
            <h1 className="max-w-4xl font-serif text-2xl leading-[1.65] sm:text-4xl sm:leading-tight md:text-6xl font-bold text-brand-gradient">
              <span className="block">奄美大島の事業に合う、</span>
              <span className="block sm:inline">小さく始める</span>
              <span className="block sm:inline">システム開発<span className="hidden sm:inline">。</span></span>
            </h1>
            <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl">
              {LEGAL_NAME}は、奄美大島を拠点に、予約・在庫・問い合わせ管理などのWebアプリや業務システムを開発します。紙やExcelで続けてきた業務の整理から相談でき、奄美群島では地域の運用事情を踏まえてご提案します。
            </p>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">What we build</p>
            <h2 className="mt-3 whitespace-nowrap font-serif text-[clamp(1.35rem,5.5vw,3rem)] md:text-5xl font-bold text-brand-gradient">
              対応できるシステムの例
            </h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              下記は対応例です。既製サービスで十分な場合も含め、業務に合う方法を一緒に検討します。
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {examples.map((item) => (
                <article key={item.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-7 md:p-9">
                  <h3 className="font-serif text-2xl font-bold text-brand-gradient">{item.title}</h3>
                  <p className="mt-4 font-sans leading-loose text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">Process</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">相談から運用まで</h2>
            <ol className="mt-12 grid gap-5">
              {steps.map(([number, heading, body]) => (
                <li key={number} className="grid gap-3 rounded-3xl bg-white p-7 md:grid-cols-[5rem_14rem_1fr] md:items-center md:p-9">
                  <span className="font-serif text-3xl text-amami-blue/40">{number}</span>
                  <h3 className="font-serif text-xl font-bold text-brand-gradient">{heading}</h3>
                  <p className="font-sans leading-loose text-slate-600">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">FAQ</p>
            <h2 className="mt-3 whitespace-nowrap font-serif text-[1.375rem] md:text-5xl font-bold text-brand-gradient">システム開発のよくある質問</h2>
            <div className="mt-10">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>

        <Contact
          title="まずは、気軽にお話ししませんか？"
          description={
            <>
              作るものが決まっていなくても大丈夫です。
              <br />
              現在の運用を伺い、システム化する範囲を整理します。
            </>
          }
        />

        <Footer />
      </main>
    </>
  );
}
