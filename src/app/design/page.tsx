import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Contact } from "@/components/sections/Contact";
import { absoluteUrl, LEGAL_NAME } from "@/lib/seo";

const title = "奄美大島のデザイン制作";
const description =
  "ロゴ、名刺、パンフレット、SNS用画像など、ブランドの想いを伝えるビジュアルデザインを制作します。印刷の手配まで一気通貫で対応し、納品までお任せいただけます。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/design" },
  openGraph: {
    title: `${title} | ${LEGAL_NAME}`,
    description,
    url: absoluteUrl("/design"),
    type: "website",
  },
};

const examples = [
  {
    title: "ロゴマーク",
    body: "会社・お店・サービスの印象を伝えるロゴを、用途や展開先を踏まえてご提案します。",
  },
  {
    title: "名刺・印刷物",
    body: "名刺、チラシ、パンフレットなど。デザインから印刷手配・納品まで一気通貫で対応できます。",
  },
  {
    title: "SNS・Web用画像",
    body: "投稿用画像やバナーなど、画面上で使うビジュアルも整えます。",
  },
  {
    title: "ブランドの統一",
    body: "ロゴ・色・書体の使い方を整理し、Webや印刷物で印象がぶれないようにします。",
  },
];

const steps = [
  ["01", "想いを聞く", "伝えたい印象、使う場面、避けたいイメージを確認します。"],
  ["02", "方向性を決める", "ラフや案を見ながら、トーンと優先したい要素を絞ります。"],
  ["03", "デザイン制作", "用途に合わせてデータを整え、必要に応じて修正します。"],
  ["04", "印刷手配・納品", "印刷の手配まで行い、完成品の納品まで一気通貫で進めます。"],
] as const;

const faqs = [
  {
    id: "design-only",
    question: "デザインだけの依頼もできますか？",
    answer:
      "はい。ロゴや名刺など、ビジュアルのみのご依頼も承っています。Web制作と合わせてブランド全体を整えることも可能です。",
  },
  {
    id: "design-logo",
    question: "ロゴの修正やリニューアルも相談できますか？",
    answer:
      "可能です。既存ロゴを活かす調整から、印象を刷新するリニューアルまでご相談ください。",
    singleLineOnMobile: true,
  },
  {
    id: "design-print",
    question: "印刷の手配までお願いできますか？",
    answer:
      "はい。デザインから印刷の手配、納品まで一気通貫で対応できます。データだけ欲しい場合も、印刷まで任せたい場合もご相談ください。",
    singleLineOnMobile: true,
  },
  {
    id: "design-price",
    question: "料金の目安はありますか？",
    answer:
      "制作物の種類、案の数、印刷の有無や部数によって異なります。ご希望を伺ったうえで概算をご案内します。",
    singleLineOnMobile: true,
  },
];

function JsonLd() {
  const url = absoluteUrl("/design");
  const organizationId = `${absoluteUrl("/")}#organization`;
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "デザイン制作",
        serviceType: "ロゴ・印刷物デザイン・印刷手配",
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
          { "@type": "ListItem", position: 1, name: "ホーム", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "デザイン", item: url },
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

export default function DesignPage() {
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
              <span>デザイン</span>
            </nav>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
              Creative Design
            </p>
            <h1 className="max-w-4xl font-serif text-2xl leading-[1.65] sm:text-4xl sm:leading-tight md:text-6xl">
              <span className="block">想いをカタチにする、</span>
              <span className="block sm:inline">伝わるデザイン</span>
              <span className="block sm:inline">制作<span className="hidden sm:inline">。</span></span>
            </h1>
            <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl">
              {LEGAL_NAME}は、ロゴや名刺、パンフレットなど、ブランドの印象を伝えるビジュアルを制作します。印刷の手配から納品まで一気通貫で対応でき、Webと合わせた統一もご相談ください。
            </p>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">What we design</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">対応できるデザインの例</h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              下記は対応例です。単体のご依頼から、複数媒体の統一までご相談いただけます。
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {examples.map((item) => (
                <article key={item.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-7 md:p-9">
                  <h3 className="font-serif text-2xl">{item.title}</h3>
                  <p className="mt-4 font-sans leading-loose text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">Process</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">相談から納品まで</h2>
            <ol className="mt-12 grid gap-5">
              {steps.map(([number, heading, body]) => (
                <li
                  key={number}
                  className="grid gap-3 rounded-3xl bg-white p-7 md:grid-cols-[5rem_14rem_1fr] md:items-center md:p-9"
                >
                  <span className="font-serif text-3xl text-amami-blue/40">{number}</span>
                  <h3 className="font-serif text-xl">{heading}</h3>
                  <p className="font-sans leading-loose text-slate-600">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">FAQ</p>
            <h2 className="mt-3 font-serif text-2xl md:text-5xl">デザインのよくある質問</h2>
            <div className="mt-10">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>

        <Contact
          title={
            <>
              まずは、<br className="md:hidden" />
              どんな印象にしたいか教えてください。
            </>
          }
          description={
            <>
              作りたいものが固まっていなくても大丈夫です。
              <br />
              使う場面と伝えたい印象から一緒に整理します。
            </>
          }
        />

        <Footer />
      </main>
    </>
  );
}
