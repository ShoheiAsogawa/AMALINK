import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Contact } from "@/components/sections/Contact";
import { absoluteUrl, LEGAL_NAME } from "@/lib/seo";

const title = "AIコンサルティング｜生成AI活用・社内チャットボット";
const description =
  "生成AIの活用支援に加え、社内マニュアルや会社情報に特化した社内用チャットボットの制作にも対応。最新のAI情報を踏まえ、業務効率化と導入を伴走します。";

export const metadata: Metadata = {
  title: "AIコンサルティング",
  description,
  keywords: [
    "AIコンサルティング",
    "生成AI 活用",
    "AI導入支援",
    "社内チャットボット",
    "社内マニュアル AI",
    "生成AI コンサル",
    LEGAL_NAME,
  ],
  alternates: { canonical: "/ai-consulting" },
  openGraph: {
    title: `${title} | ${LEGAL_NAME}`,
    description,
    url: absoluteUrl("/ai-consulting"),
    type: "website",
  },
};

const tools = [
  {
    name: "汎用AIの活用",
    body: "文章作成、要約、問い合わせ下書きなど。生成AIをそのまま業務に取り入れるところから支援します。御社に合う使い方も一緒に整理できます。",
  },
  {
    name: "社内用チャットボット",
    body: "社内マニュアル、就業ルール、商品知識、よくある問い合わせなど、会社のことに特化したチャットボットを作れます。社員や現場がすぐ答えを引ける仕組みです。",
  },
  {
    name: "開発向けAI",
    body: "Web制作やシステム開発の現場向け。実装・修正のスピードを上げたいときに有効です。",
  },
  {
    name: "社内AIの構築基盤",
    body: "社内ボットやナレッジ検索を整えるときの選択肢。目的に合わせて、その時点で最適な仕組みを選びます。",
  },
];

const examples = [
  {
    title: "現状の整理・診断",
    body: "業務フロー、手作業、社内に散らばったマニュアルを洗い出し、生成AIの活用や社内ボット化が効くポイントを整理します。",
  },
  {
    title: "汎用AIの使い方支援",
    body: "生成AIを、誰でも同じ品質で使えるように型づくり。プロンプトや運用のコツまで落とし込みます。",
  },
  {
    title: "会社特化の社内ボット",
    body: "社内マニュアルや会社知識をもとに、会社のことに強い社内用チャットボットを制作。問い合わせ対応や新人教育の負担を減らします。",
  },
  {
    title: "運用しながら育てる",
    body: "新しいモデルや機能が出たときも、御社の業務に合わせて使い方や社内ボットを更新。導入後の改善まで伴走できます。",
  },
];

const steps = [
  ["01", "現状を聞く", "いまの業務、困りごと、マニュアルの有無、目指したい姿を伺います。"],
  ["02", "効くところを見つける", "汎用AIの活用か、社内特化ボットか、または両方か。負担が少なく効く形を整理します。"],
  ["03", "小さく試す", "いきなり全社展開せず、検証しやすい範囲から試し、手応えを確認します。"],
  ["04", "導入・定着", "使い方の型や運用ルールを整え、現場で続く形に落とし込みます。"],
  ["05", "見直し・改善", "新しいモデルや機能を見ながら、使い方や社内ボットを必要に応じて育てます。"],
] as const;

const faqs = [
  {
    id: "ai-consult-undecided",
    question: "どのAIを使えばいいか決まっていなくても相談できますか？",
    answer:
      "はい。業務内容を伺ったうえで選びます。汎用AIの使い方支援だけでなく、社内マニュアル特化のチャットボットが向いている場合もあります。",
    moreHref: "/contact",
  },
  {
    id: "ai-consult-internal-bot",
    question: "社内用のチャットボットも作れますか？",
    answer:
      "はい。社内マニュアル、就業ルール、商品・サービス知識など、会社の情報に特化した社内用チャットボットを制作できます。目的に合わせて最適な形を選びます。",
    singleLineOnMobile: true,
    moreHref: "/contact",
  },
  {
    id: "ai-consult-tools",
    question: "どんなAIの支援に対応していますか？",
    answer:
      "生成AIの業務活用、社内特化チャットボット、開発現場向けのAI活用が中心です。画像生成や使わない自動化ツールを無理に勧めることはしません。常にその時点で実用的な手段を選びます。",
    singleLineOnMobile: true,
    moreHref: "/contact",
  },
  {
    id: "ai-consult-latest",
    question: "最新のAI情報をもとに提案してもらえますか？",
    answer:
      "はい。新しいモデルや機能の動きを見ながら、御社の業務で本当に使えるかを基準にご提案します。導入後の見直しもご相談いただけます。",
    singleLineOnMobile: true,
    moreHref: "/contact",
  },
  {
    id: "ai-consult-other",
    question: "ホームページ制作やシステム開発と組み合わせられますか？",
    answer:
      "可能です。AI導入の相談から、必要に応じて公開サイト向けチャットボット、業務システム、Web制作まで一貫してご相談いただけます。",
    singleLineOnMobile: true,
    moreHref: "/web-production",
  },
];

function JsonLd() {
  const url = absoluteUrl("/ai-consulting");
  const organizationId = `${absoluteUrl("/")}#organization`;
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "AIコンサルティング",
        alternateName: [
          "生成AI導入支援",
          "AI活用支援",
          "社内チャットボット制作",
          "社内マニュアルAI",
          "生成AIコンサルティング",
        ],
        serviceType: "AI導入支援・社内チャットボット・業務効率化コンサルティング",
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
        knowsAbout: [
          "生成AI",
          "AI導入支援",
          "社内チャットボット",
          "社内マニュアル",
          "業務効率化",
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
            name: "AIコンサルティング",
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

export default function AiConsultingPage() {
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
              <span>AIコンサルティング</span>
            </nav>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
              AI Consulting
            </p>
            <h1 className="max-w-4xl font-serif text-2xl leading-[1.65] sm:text-4xl sm:leading-tight md:text-6xl font-bold text-brand-gradient">
              <span className="block">汎用AIも、社内特化ボットも。</span>
              <span className="mt-2 block text-[0.72em] font-bold text-slate-700 sm:mt-3 md:text-[0.55em]">
                会社のことに強いAIの使い方へ。
              </span>
            </h1>
            <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl">
              {LEGAL_NAME}は、生成AIの活用支援に加え、社内マニュアルや会社知識に特化した社内用チャットボットの制作にも対応します。御社の業務で使える形まで一緒に落とし込みます。
            </p>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">What we do</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">
              支援の中心
            </h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              汎用AI・社内特化ボットなど、実際の業務に落とせる支援に集中します。
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {tools.map((item) => (
                <article key={item.name} className="rounded-3xl border border-slate-100 bg-slate-50 p-7 md:p-9">
                  <h3 className="font-serif text-2xl font-bold text-brand-gradient">{item.name}</h3>
                  <p className="mt-4 font-sans leading-loose text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">What we offer</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">
              できることの例
            </h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              診断だけ、社内ボット制作だけ、継続伴走など、必要な範囲から始められます。
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {examples.map((item) => (
                <article key={item.title} className="rounded-3xl bg-white p-7 md:p-9">
                  <h3 className="font-serif text-2xl font-bold text-brand-gradient">{item.title}</h3>
                  <p className="mt-4 font-sans leading-loose text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">Process</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">
              相談から定着まで
            </h2>
            <ol className="mt-12 grid gap-5">
              {steps.map(([number, heading, body]) => (
                <li
                  key={number}
                  className="grid gap-3 rounded-3xl bg-slate-50 p-7 md:grid-cols-[5rem_14rem_1fr] md:items-center md:p-9"
                >
                  <span className="font-serif text-3xl text-amami-blue/40">{number}</span>
                  <h3 className="font-serif text-xl font-bold text-brand-gradient">{heading}</h3>
                  <p className="font-sans leading-loose text-slate-600">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">FAQ</p>
            <h2 className="mt-3 font-serif text-2xl md:text-5xl font-bold text-brand-gradient">
              AIコンサルティングのよくある質問
            </h2>
            <div className="mt-10">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>

        <Contact
          title="まずは、気軽にお話ししませんか？"
          description={
            <>
              AIを試しただけでも、社内マニュアルをボット化したいでも大丈夫です。
              <br />
              現状を伺い、進め方を一緒に整理します。
            </>
          }
        />

        <Footer />
      </main>
    </>
  );
}
