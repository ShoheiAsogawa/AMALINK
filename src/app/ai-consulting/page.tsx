import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Contact } from "@/components/sections/Contact";
import { absoluteUrl, LEGAL_NAME } from "@/lib/seo";

const title = "AIコンサルティング｜ChatGPT・Claude・Cursor導入支援";
const description =
  "ChatGPT、Claude、Cursor、Dify など、現場で使いやすいAIツールを中心に、業務の現状整理・効率化・導入を伴走支援します。何から始めるべきかわからない段階からご相談ください。";

export const metadata: Metadata = {
  title: "AIコンサルティング",
  description,
  keywords: [
    "AIコンサルティング",
    "ChatGPT 導入",
    "Claude 導入",
    "Cursor 活用",
    "Dify 導入",
    "生成AI コンサル",
    "AI導入支援",
    "業務効率化",
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
    name: "ChatGPT",
    body: "文章作成、要約、問い合わせの下書き、社内FAQのたたき台など。まず試すならここ、という定番の生成AIです。",
  },
  {
    name: "Claude",
    body: "長文の読み込みや丁寧な文書作成が得意。規約・マニュアル・議事録など、文量の多い業務整理に向いています。",
  },
  {
    name: "Cursor",
    body: "Web制作やシステム開発の現場で使うAIコーディング環境。実装・修正・リファクタのスピードを上げたいときに有効です。",
  },
  {
    name: "Dify / 自動化",
    body: "社内向けチャットボットや業務フローの自動化を整えたいときに。Dify や Make、n8n など、用途に合わせて選びます。",
  },
];

const examples = [
  {
    title: "現状の整理・診断",
    body: "業務フロー、手作業、使っているツールを洗い出し、ChatGPT・Claude・Cursor などで効きやすいポイントを整理します。",
  },
  {
    title: "業務効率化の提案",
    body: "問い合わせ対応、資料作成、社内ナレッジ整理など。流行ではなく、現場で続く使い方を基準にご提案します。",
  },
  {
    title: "導入支援・伴走",
    body: "ツール選定、使い方の型づくり、社内への落とし込みまで。導入して終わりではなく、定着まで伴走します。",
  },
  {
    title: "継続的なアップデート",
    body: "モデルや機能はすぐ変わるため、最新情報を見ながら、今の事業に合うやり方へ見直す支援も行います。",
  },
];

const steps = [
  ["01", "現状を聞く", "いまの業務、困りごと、使っているツール、目指したい姿を伺います。"],
  ["02", "効くところを見つける", "ChatGPT・Claude・Cursor などを踏まえ、効果が出やすく負担が少ない導入ポイントを整理します。"],
  ["03", "小さく試す", "いきなり全社展開せず、検証しやすい範囲から試し、手応えを確認します。"],
  ["04", "導入・定着", "運用ルールや使い方を整え、現場で続く形に落とし込みます。"],
  ["05", "見直し・改善", "新しいモデルや機能の変化に合わせて、必要に応じて改善を続けます。"],
] as const;

const faqs = [
  {
    id: "ai-consult-undecided",
    question: "ChatGPT と Claude、どれを使えばいいか決まっていなくても相談できますか？",
    answer:
      "はい。業務内容を伺ったうえで、ChatGPT・Claude・Cursor・Dify などから、目的に合うものを一緒に選びます。最初から1つに決める必要はありません。",
  },
  {
    id: "ai-consult-tools",
    question: "対応しているAIツールの例を教えてください。",
    answer:
      "主に ChatGPT、Claude、Cursor、Dify、Make / n8n、画像生成（Midjourney など）を扱います。用途に合わせて選び、新しいツールが出た場合も必要に応じて検討します。",
    singleLineOnMobile: true,
  },
  {
    id: "ai-consult-latest",
    question: "最新のAI情報をもとに提案してもらえますか？",
    answer:
      "はい。モデルや機能の更新を踏まえつつ、流行だけで選ばず、御社の業務に本当に合うかを基準にご提案します。",
    singleLineOnMobile: true,
  },
  {
    id: "ai-consult-other",
    question: "ホームページ制作やシステム開発と組み合わせられますか？",
    answer:
      "可能です。AI導入の相談から、必要に応じてチャットボット、業務システム、Web制作まで一貫してご相談いただけます。Cursor を使った開発支援とも相性が良いです。",
    singleLineOnMobile: true,
  },
  {
    id: "ai-consult-price",
    question: "料金の目安はありますか？",
    answer:
      "診断のみ、導入支援、継続伴走など範囲によって異なります。現状を伺ったうえで概算をご案内します。",
    singleLineOnMobile: true,
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
          "ChatGPT導入支援",
          "Claude導入支援",
          "Cursor活用支援",
          "生成AIコンサルティング",
        ],
        serviceType: "AI導入支援・業務効率化コンサルティング",
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
          "ChatGPT",
          "Claude",
          "Cursor",
          "Dify",
          "Make",
          "n8n",
          "Midjourney",
          "生成AI",
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
              <span className="block">ChatGPTもClaudeもCursorも、</span>
              <span className="block sm:inline">現場に合う形で</span>
              <span className="block sm:inline">
                導入する<span className="hidden sm:inline">。</span>
              </span>
            </h1>
            <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl">
              {LEGAL_NAME}は、ChatGPT・Claude・Cursor・Dify
              など、実際に使いやすいAIツールを中心に、業務の現状整理から導入・定着まで伴走します。流行に流されず、続く使い方まで一緒に考えます。
            </p>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">Tools</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">
              扱うAIツールの例
            </h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              よく使う実用的なツールに絞っています。どれが合うかは、業務の内容と負担感から一緒に決めます。
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
              診断だけ、導入支援だけ、継続伴走など、必要な範囲から始められます。
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
              ChatGPT を試しただけ、まだ何も使っていない、どちらでも大丈夫です。
              <br />
              現状の業務を伺い、進め方を一緒に整理します。
            </>
          }
        />

        <Footer />
      </main>
    </>
  );
}
