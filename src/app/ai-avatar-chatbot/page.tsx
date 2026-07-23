import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Contact } from "@/components/sections/Contact";
import { absoluteUrl, LEGAL_NAME } from "@/lib/seo";

const title = "AIアバターチャットボット制作｜奄美大島のAI支援";
const description =
  "奄美大島でAIのことならAMALINKへ。自社サイト向けのAIアバターチャットボットを制作・組み込み。答える範囲の設計、アバター演出、問い合わせ導線まで用途に合わせてご提案します。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ai-avatar-chatbot" },
  openGraph: {
    title: `${title} | ${LEGAL_NAME}`,
    description,
    url: absoluteUrl("/ai-avatar-chatbot"),
    type: "website",
  },
};

const examples = [
  {
    title: "答える範囲の設計",
    body: "自社サービス・店舗案内・地域情報など、話してよいテーマだけに絞り、それ以外は丁寧にお断りする設定にします。",
  },
  {
    title: "アバター演出",
    body: "表情差分やアイドルアニメーションで、サイトに馴染むキャラクター導線をつくります。既存キャラの活用もご相談ください。",
  },
  {
    title: "サイトへの組み込み",
    body: "既存サイトのデザインに合わせて、フローティングUIやページ内からの起動など、表示位置・導線を整えます。",
  },
  {
    title: "問い合わせへの橋渡し",
    body: "よくある質問に答えつつ、見積もりや相談はフォーム・公式LINEなどへ自然に誘導します。",
  },
];

const steps = [
  ["01", "目的を決める", "案内したい内容、答えない範囲、誘導先（フォーム／LINE）を整理します。"],
  ["02", "見た目と知識を整える", "アバターのデザインと、FAQ・会社情報などの回答ソースを用意します。"],
  ["03", "試作して会話を確認", "実際に話しかけてみて、口調や拒否の仕方を調整します。"],
  ["04", "サイトに組み込む", "表示位置・スマホ表示・既存デザインとのバランスを整えて公開します。"],
] as const;

const faqs = [
  {
    id: "chatbot-what",
    question: "AIアバターチャットボットとは何ですか？",
    answer:
      "サイト上に表示されるキャラクター付きの案内チャットです。よくある質問への回答や、問い合わせへの橋渡しを自動化し、訪問者の離脱を減らす用途で導入されます。",
    moreHref: "/contact",
  },
  {
    id: "chatbot-custom",
    question: "自社用にキャラや回答内容を変えられますか？",
    answer:
      "可能です。キャラクター、口調、答える範囲、誘導先はお客様の事業に合わせて設計します。既存のFAQや会社案内を知識として使うこともできます。",
    singleLineOnMobile: true,
    moreHref: "/contact",
  },
  {
    id: "chatbot-scope",
    question: "何でも答えるボットになりますか？",
    answer:
      "いいえ。答える範囲をあらかじめ決めて設計します。「自社サービスと地域のことだけ」など、用途に合わせて制限できます。",
    singleLineOnMobile: true,
    moreHref: "/contact",
  },
  {
    id: "chatbot-price",
    question: "料金の目安はありますか？",
    answer:
      "アバター制作の有無、回答範囲、既存サイトへの組み込み範囲によって異なります。まずはご希望を伺い、概算をご案内します。",
    singleLineOnMobile: true,
    moreHref: "/contact",
  },
];

function JsonLd() {
  const url = absoluteUrl("/ai-avatar-chatbot");
  const organizationId = `${absoluteUrl("/")}#organization`;
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "AIアバターチャットボット制作",
        serviceType: "AIチャットボット・アバター組み込み",
        description,
        url,
        provider: { "@id": organizationId },
        areaServed: [
          { "@type": "Place", name: "奄美大島" },
          { "@type": "AdministrativeArea", name: "奄美群島" },
          { "@type": "Country", name: "日本" },
        ],
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
            name: "AIアバターチャットボット",
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

export default function AiAvatarChatbotPage() {
  return (
    <>
      <JsonLd />
      <main className="min-h-screen bg-white text-slate-800">
        <Header />

        <section className="bg-gradient-to-b from-amami-blue/10 to-white px-6 pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mx-auto max-w-5xl">
            <nav className="mb-10 font-sans text-sm text-slate-500" aria-label="パンくず">
              <Link href="/" className="hover:text-amami-blue">
                ホーム
              </Link>
              <span className="mx-2" aria-hidden>
                ／
              </span>
              <span>AIアバターチャットボット</span>
            </nav>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
              AI Avatar Chatbot
            </p>
            <h1 className="max-w-4xl font-serif text-2xl leading-[1.65] sm:text-4xl sm:leading-tight md:text-6xl font-bold text-brand-gradient">
              <span className="block">自社サイトに合う、</span>
              <span className="block whitespace-nowrap">AIアバターチャットボット制作。</span>
            </h1>
            <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl">
              {LEGAL_NAME}は、サイトに馴染むアバター付きチャットボットの制作・組み込みを行います。答える範囲の設計から問い合わせ導線まで、用途に合わせてご提案します。
            </p>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">What we offer</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">できることの例</h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              下記は対応例です。必要な機能だけ小さく始めることもできます。
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
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">相談から公開まで</h2>
            <ol className="mt-12 grid gap-5">
              {steps.map(([number, heading, body]) => (
                <li
                  key={number}
                  className="grid gap-3 rounded-3xl bg-white p-7 md:grid-cols-[5rem_14rem_1fr] md:items-center md:p-9"
                >
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
            <h2 className="mt-3 font-serif text-2xl md:text-5xl font-bold text-brand-gradient">よくある質問</h2>
            <div className="mt-10">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>

        <Contact
          title="まずは、気軽にお話ししませんか？"
          description={
            <>
              作りたいものが固まっていなくても大丈夫です。
              <br />
              目的と答える範囲から一緒に整理します。
            </>
          }
        />

        <Footer />
      </main>
    </>
  );
}
