import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Contact } from "@/components/sections/Contact";
import { absoluteUrl, LEGAL_NAME } from "@/lib/seo";

const title = "GEO対策・SEO対策｜奄美大島でAIにも伝わるWebへ";
const description =
  "奄美大島でAIにも正しく伝わるWebへ。検索エンジン向けのSEOと、生成AI向けのGEOをあわせて支援します。事業内容が引用・発見されやすいページ設計と改善をご提案します。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/geo-seo" },
  openGraph: {
    title: `${title} | ${LEGAL_NAME}`,
    description,
    url: absoluteUrl("/geo-seo"),
    type: "website",
  },
};

const examples = [
  {
    title: "SEO（検索エンジン最適化）",
    body: "ページ構成、見出し、メタ情報、内部リンクなどを整え、Googleなどの検索結果で見つけてもらいやすくします。",
  },
  {
    title: "GEO（生成AI向け最適化）",
    body: "AIが回答を作る際に、会社やサービスが正しく紹介・引用されやすい情報設計を行います。",
  },
  {
    title: "FAQ・会社情報の整理",
    body: "よく聞かれることや基本情報をわかりやすくまとめ、人にもAIにも伝わる形に整えます。",
  },
  {
    title: "構造化データ・llms.txt",
    body: "JSON-LDなどの構造化データや、AIクローラー向けの情報ファイル整備にも対応します。",
  },
];

const steps = [
  ["01", "現状を確認する", "既存サイトの情報の伝わり方、検索・AIでの見え方の課題を整理します。"],
  ["02", "伝える内容を決める", "会社・サービス・強み・FAQなど、正しく伝えたい一次情報を明確にします。"],
  ["03", "ページを整える", "文章構成、メタ情報、構造化データなどを改善し、必要なら制作とあわせて実装します。"],
  ["04", "継続的に見直す", "公開後も、追記したい情報や改善点があれば必要に応じて伴走します。"],
] as const;

const faqs = [
  {
    id: "geo-seo-diff",
    question: "SEO対策とGEO対策は違うのですか？",
    answer:
      "SEOはGoogleなどの検索結果で上位表示を目指す対策、GEOはAIが生成する回答の中で引用・紹介されやすくする対策です。どちらも「見つけてもらう」ことが目的で、いまは両方を意識したWeb設計が有効です。",
    moreHref: "/contact",
  },
  {
    id: "geo-seo-only",
    question: "既存サイトのSEO・GEO改善だけお願いできますか？",
    answer:
      "はい。リニューアルを伴わず、情報整理・FAQ追加・メタデータや構造化データの改善など、現状のサイトを活かしたご依頼も可能です。",
    moreHref: "/contact",
  },
  {
    id: "geo-seo-nocode",
    question: "WixやSTORESのサイトでも対応できますか？",
    answer:
      "プラットフォームの仕様次第で、構造化データの追加や細かなHTML調整ができない場合があります。できる範囲での改善か、作り直しのどちらがよいか、現状を確認したうえでお伝えします。",
    moreHref: "/web-production",
  },
  {
    id: "geo-seo-price",
    question: "料金の目安はありますか？",
    answer:
      "対象ページ数、新規制作の有無、改善範囲によって異なります。ご希望を伺ったうえで概算をご案内します。",
    moreHref: "/contact",
  },
];

function JsonLd() {
  const url = absoluteUrl("/geo-seo");
  const organizationId = `${absoluteUrl("/")}#organization`;
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "GEO対策・SEO対策",
        serviceType: "検索エンジン最適化・生成エンジン最適化",
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
          { "@type": "ListItem", position: 2, name: "GEO・SEO対策", item: url },
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

export default function GeoSeoPage() {
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
              <span>GEO・SEO対策</span>
            </nav>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
              GEO &amp; SEO
            </p>
            <h1 className="max-w-4xl font-serif text-2xl leading-[1.65] font-bold text-brand-gradient [word-break:keep-all] sm:text-4xl sm:leading-tight md:text-6xl">
              <span className="block">検索にもAIにも、</span>
              <span className="block">正しく伝わるWeb設計。</span>
            </h1>
            <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl">
              {LEGAL_NAME}は、従来のSEOに加え、生成AIに引用されやすくするGEOの視点でもWebページを整えます。新規制作と合わせることも、既存サイトの見直しだけでもご相談いただけます。
            </p>
          </div>
        </section>

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">What we offer</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">できることの例</h2>
            <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">
              SEOとGEOは別物ですが、どちらも「正しく見つけてもらう」ための設計です。必要に応じて組み合わせます。
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
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-bold text-brand-gradient">相談から改善まで</h2>
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
            <h2 className="mt-3 font-serif text-2xl font-bold text-brand-gradient [word-break:keep-all] md:text-5xl">
              GEO・SEOの
              <br className="md:hidden" />
              よくある質問
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
              改善したい点がはっきりしていなくても大丈夫です。
              <br />
              検索・AIの両面から、必要な範囲を一緒に整理します。
            </>
          }
        />

        <Footer />
      </main>
    </>
  );
}
