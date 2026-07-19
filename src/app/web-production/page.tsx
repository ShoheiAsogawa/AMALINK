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
import { TARGET_KEYWORDS, WEB_PRODUCTION_GEO } from "@/lib/geo-targets";

const title = WEB_PRODUCTION_GEO.title;
const description = WEB_PRODUCTION_GEO.description;

export const metadata: Metadata = {
  title,
  description,
  keywords: [...TARGET_KEYWORDS.webProduction, LEGAL_NAME, "AMALINK"],
  alternates: { canonical: WEB_PRODUCTION_GEO.canonicalPath },
  openGraph: {
    title: `${title} | ${LEGAL_NAME}`,
    description,
    url: absoluteUrl(WEB_PRODUCTION_GEO.canonicalPath),
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
    title: "コーポレートサイト",
    body: "会社・お店の紹介、サービス内容、アクセス、問い合わせまで、基本情報をわかりやすくまとめます。",
  },
  {
    title: "集客・案内ページ",
    body: "観光・宿泊・飲食など、来店や予約につながる導線を意識したページ構成にします。",
  },
  {
    title: "リニューアル",
    body: "スマホ非対応・更新しづらい・情報が古いサイトを、いまの運用に合う形へ作り替えます。",
  },
  {
    title: "更新しやすい設計",
    body: "お知らせやメニューなど、ご自身で直しやすい管理画面付きの構成にも対応します。",
  },
];

const steps = [
  ["01", "目的を聞く", "誰に何を伝えたいか、集客・採用・案内など目的とご予算感を確認します。"],
  ["02", "構成を決める", "必要なページと優先順位を整理し、無理のない範囲から始めます。"],
  ["03", "デザイン・制作", "見やすさと使いやすさを大切に、スマホ表示も確認しながら進めます。"],
  ["04", "公開・運用", "操作方法をご説明し、公開後の更新や改善も必要に応じて伴走します。"],
] as const;

const faqs = WEB_PRODUCTION_GEO.faqs;

export default function WebProductionPage() {
  return (
    <>
      <ServicePageJsonLd
        url={WEB_PRODUCTION_GEO.url}
        name={WEB_PRODUCTION_GEO.serviceSchemaName}
        description={description}
        serviceTypes={WEB_PRODUCTION_GEO.serviceTypes}
        breadcrumbName="ホームページ制作"
        faqs={faqs}
        keywords={TARGET_KEYWORDS.webProduction}
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
              <span>ホームページ制作</span>
            </nav>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
              Web Production
            </p>
            <h1 className="max-w-4xl font-serif text-2xl leading-[1.65] sm:text-4xl sm:leading-tight md:text-6xl font-bold text-brand-gradient">
              <span className="block">{WEB_PRODUCTION_GEO.h1Primary}</span>
              <span className="block sm:inline">{WEB_PRODUCTION_GEO.h1Secondary}</span>
            </h1>
            <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl" data-geo-answer>
              {LEGAL_NAME}は、見やすさと更新しやすさを大切にしたホームページを制作します。新規制作もリニューアルも、目的が固まっていない段階からご相談いただけます。拠点は奄美大島で、全国オンラインにも対応しています。
            </p>
          </div>
        </section>

        <CiteableAnswer answer={WEB_PRODUCTION_GEO.citeableAnswer} />

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">What we build</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">
              対応できるサイトの例
            </h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              下記は対応例です。ページ数や機能は、目的とご予算に合わせてご提案します。
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
          intro="無理のない範囲から、検索・AIにも伝わる設計まで、一緒に進めます。"
          items={WEB_PRODUCTION_GEO.whyLocal}
        />

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">Process</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">相談から公開まで</h2>
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
              ホームページ制作のよくある質問
            </h2>
            <div className="mt-10">
              <FaqAccordion items={[...faqs]} />
            </div>
          </div>
        </section>

        <RelatedServices links={WEB_PRODUCTION_GEO.related} />

        <Contact
          title="まずは、気軽にお話ししませんか？"
          description={
            <>
              作りたいものが固まっていなくても大丈夫です。
              <br />
              目的と載せたい情報から一緒に整理します。
            </>
          }
        />

        <Footer />
      </main>
    </>
  );
}
