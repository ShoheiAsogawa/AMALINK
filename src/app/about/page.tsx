import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AmbientVideo } from "@/components/about/AmbientVideo";
import { Contact } from "@/components/sections/Contact";
import { COMPANY_OVERVIEW, SERVICES } from "@/lib/site-content";
import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "会社概要";
const description = `${LEGAL_NAME}（${SITE_NAME}）の会社概要。代表社員 ${COMPANY_OVERVIEW.representative}。鹿児島県奄美大島・宇検村拠点。資本金${COMPANY_OVERVIEW.capital}。AIコンサルティング・ホームページ制作・デザイン・システム開発・GEO対策。全国オンライン対応。`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    LEGAL_NAME,
    SITE_NAME,
    "会社概要",
    "企業概要",
    COMPANY_OVERVIEW.representative,
    "奄美大島",
    "宇検村",
    "合同会社",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${title} | ${LEGAL_NAME}`,
    description,
    url: absoluteUrl("/about"),
    type: "website",
  },
};

const PROFILE = [
  { label: "商号", value: COMPANY_OVERVIEW.legalName },
  { label: "代表社員", value: COMPANY_OVERVIEW.representative },
  { label: "資本金", value: COMPANY_OVERVIEW.capital },
  { label: "所在地", value: COMPANY_OVERVIEW.address },
] as const;

function AboutJsonLd() {
  const url = absoluteUrl("/about");
  const payload = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${LEGAL_NAME} 会社概要`,
    url,
    description,
    mainEntity: {
      "@type": ["Organization", "LocalBusiness"],
      "@id": `${absoluteUrl("/")}#organization`,
      name: LEGAL_NAME,
      alternateName: SITE_NAME,
      legalName: LEGAL_NAME,
      url: absoluteUrl("/"),
      slogan: COMPANY_OVERVIEW.tagline,
      founder: {
        "@type": "Person",
        name: COMPANY_OVERVIEW.representative,
        jobTitle: "代表社員",
      },
      address: {
        "@type": "PostalAddress",
        ...COMPANY_OVERVIEW.postalAddress,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutJsonLd />
      <main className="min-h-screen bg-slate-50 text-slate-800">
        <Header />

        <section className="relative isolate flex min-h-[100dvh] items-end overflow-hidden md:items-center">
          <div className="absolute inset-0">
            <AmbientVideo
              poster="/about/hero.webp"
              src="/about/hero.mp4"
              srcSm="/about/hero-sm.mp4"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/78 via-white/62 to-white" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent" />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-20 pt-36 text-center md:pb-24 md:pt-28">
            <div className="relative mb-8 h-28 w-28 md:mb-10 md:h-40 md:w-40">
              <Image
                src={`${assetBase}/logo.png`}
                alt={`${LEGAL_NAME} ロゴ`}
                fill
                priority
                sizes="160px"
                className="object-contain drop-shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
              />
            </div>
            <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.42em] text-amami-blue">
              Company
            </p>
            <h1 className="font-serif text-4xl tracking-wide text-slate-800 md:text-6xl">会社概要</h1>
            <p className="mt-5 font-sans text-sm tracking-[0.18em] text-slate-500 md:text-base">
              島のリズムで、
              <span className="text-brand-gradient">未来をつくる。</span>
            </p>
          </div>
        </section>

        <section className="relative bg-white px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.28em] text-amami-blue">
                About
              </p>
              <h2 className="mb-8 font-serif text-3xl leading-tight text-slate-800 md:text-4xl">
                デジタルだけど、
                <br />
                体温のある仕事を。
              </h2>
              <div className="space-y-6 font-serif text-base leading-loose text-slate-600 md:text-lg">
                <p>
                  {LEGAL_NAME}（アマリンク）は、奄美大島で生まれたデジタルクリエイティブチームです。
                </p>
                <p>
                  名前の「AMALINK」には、故郷「
                  <span className="font-semibold text-amami-blue">AMAMI</span>」と、世界への「
                  <span className="font-semibold text-amami-green">LINK</span>
                  」という二つの願いが込められています。
                </p>
                <p>
                  最先端の技術も大切ですが、それ以上に「誰かの役に立つこと」を大切に。島の暮らしに、そっと寄り添うような温かいデジタル体験をお届けします。
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-slate-100 bg-slate-50 shadow-sm">
              <div className="aspect-[16/10]">
                <AmbientVideo
                  poster="/about/story.webp"
                  src="/about/story.mp4"
                  srcSm="/about/story-sm.mp4"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-10 md:py-14">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white shadow-sm">
            <div className="aspect-[16/7] md:aspect-[21/8]">
              <AmbientVideo
                poster="/about/band.webp"
                src="/about/band.mp4"
                srcSm="/about/band-sm.mp4"
              />
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50">
            <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="flex min-h-[16rem] items-center justify-center bg-slate-50 lg:min-h-full">
                <div className="relative h-28 w-28 md:h-36 md:w-36">
                  <Image
                    src={`${assetBase}/logo.png`}
                    alt={`${LEGAL_NAME} ロゴ`}
                    fill
                    sizes="144px"
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="bg-white px-6 py-10 md:px-10 md:py-12">
                <p className="mb-3 font-sans text-xs uppercase tracking-[0.28em] text-amami-blue">
                  Profile
                </p>
                <h2 className="mb-8 font-serif text-3xl text-slate-800">会社情報</h2>
                <dl className="divide-y divide-slate-100">
                  {PROFILE.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 py-3.5 md:grid-cols-[8.5rem_minmax(0,1fr)]"
                    >
                      <dt className="font-sans text-xs tracking-wider text-slate-400">{row.label}</dt>
                      <dd className="font-sans text-sm leading-relaxed text-slate-700 md:text-[15px]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                  <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-4 py-4 md:grid-cols-[8.5rem_minmax(0,1fr)]">
                    <dt className="pt-0.5 font-sans text-xs tracking-wider text-slate-400">事業内容</dt>
                    <dd>
                      <ol className="space-y-2.5">
                        {SERVICES.map((service, index) => (
                          <li key={service.id}>
                            <Link
                              href={new URL(service.url).pathname}
                              className="group flex items-baseline gap-3"
                            >
                              <span className="w-5 shrink-0 font-sans text-[11px] tabular-nums tracking-wider text-amami-blue">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="font-serif text-[15px] text-slate-800 transition-colors group-hover:text-amami-blue">
                                {service.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ol>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <Contact />
        <Footer />
      </main>
    </>
  );
}
