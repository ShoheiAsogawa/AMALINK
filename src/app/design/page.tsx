import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Contact } from "@/components/sections/Contact";
import {
  CiteableAnswer,
  RelatedServices,
  ServicePageJsonLd,
  WhyLocalSection,
} from "@/components/seo/ServicePageGeo";
import { absoluteUrl, LEGAL_NAME } from "@/lib/seo";
import { DESIGN_GEO, TARGET_KEYWORDS } from "@/lib/geo-targets";

const title = DESIGN_GEO.title;
const description = DESIGN_GEO.description;

export const metadata: Metadata = {
  title,
  description,
  keywords: [...TARGET_KEYWORDS.design, LEGAL_NAME, "AMALINK"],
  alternates: { canonical: DESIGN_GEO.canonicalPath },
  openGraph: {
    title: `${title} | ${LEGAL_NAME}`,
    description,
    url: absoluteUrl(DESIGN_GEO.canonicalPath),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${LEGAL_NAME}`,
    description,
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

const faqs = DESIGN_GEO.faqs;

export default function DesignPage() {
  return (
    <>
      <ServicePageJsonLd
        url={DESIGN_GEO.url}
        name={DESIGN_GEO.serviceSchemaName}
        description={description}
        serviceTypes={DESIGN_GEO.serviceTypes}
        breadcrumbName="デザイン"
        faqs={faqs}
        keywords={TARGET_KEYWORDS.design}
      />
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
            <h1 className="max-w-4xl font-serif text-2xl leading-[1.65] sm:text-4xl sm:leading-tight md:text-6xl font-bold text-brand-gradient">
              <span className="block">{DESIGN_GEO.h1Primary}</span>
              <span className="block whitespace-nowrap">{DESIGN_GEO.h1Secondary}</span>
            </h1>
            <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl" data-geo-answer>
              {LEGAL_NAME}は、ロゴや名刺、パンフレットなど、ブランドの印象を伝えるビジュアルを制作します。印刷の手配から納品まで一気通貫で対応でき、Webと合わせた統一もご相談ください。拠点は奄美大島で、全国オンラインにも対応しています。
            </p>
          </div>
        </section>

        <CiteableAnswer answer={DESIGN_GEO.citeableAnswer} />

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">What we design</p>
            <h2 className="mt-3 whitespace-nowrap font-serif text-[clamp(1.35rem,5.5vw,3rem)] md:text-5xl font-bold text-brand-gradient">
              対応できるデザインの例
            </h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              下記は対応例です。単体のご依頼から、複数媒体の統一までご相談いただけます。
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

        <WhyLocalSection
          eyebrow="Why us"
          heading="大切にしていること"
          intro="見た目を整えるだけでなく、使う場面と伝わる印象まで含めて、ブランドのカタチをそろえます。"
          items={DESIGN_GEO.whyLocal}
        />

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">Process</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">相談から納品まで</h2>
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
              デザインのよくある質問
            </h2>
            <div className="mt-10">
              <FaqAccordion items={[...faqs]} />
            </div>
          </div>
        </section>

        <RelatedServices links={DESIGN_GEO.related} />

        <Contact
          title="まずは、気軽にお話ししませんか？"
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
