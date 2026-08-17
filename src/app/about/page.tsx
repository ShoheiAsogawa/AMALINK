import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AmbientVideo } from "@/components/about/AmbientVideo";
import { ChunkyAnchor, ChunkyNextLink } from "@/components/ui/ChunkyButton";
import { OfficialLineIcon } from "@/components/ui/OfficialLineIcon";
import { COMPANY_OVERVIEW, SERVICES } from "@/lib/site-content";
import { absoluteUrl, getOfficialLineAddFriendUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const title = "会社概要";
const description = `${LEGAL_NAME}（${SITE_NAME}）の会社概要。鹿児島県奄美大島・宇検村を拠点に、AIコンサルティング・ホームページ制作・デザイン・システム開発・GEO対策を行っています。資本金100万円。全国オンライン対応。`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [LEGAL_NAME, SITE_NAME, "会社概要", "企業概要", "奄美大島", "宇検村", "合同会社"],
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
  { label: "ブランド名", value: `${COMPANY_OVERVIEW.brandName}（アマリンク）` },
  { label: "資本金", value: COMPANY_OVERVIEW.capital },
  { label: "所在地", value: COMPANY_OVERVIEW.address },
  { label: "拠点", value: COMPANY_OVERVIEW.baseLocation },
  { label: "対応エリア", value: COMPANY_OVERVIEW.serviceArea },
] as const;

const VALUES = [
  {
    en: "Rooted",
    title: "島に根ざす",
    body: "奄美の文化や風土を大切にしながら、デジタルの力で新しい可能性を育みます。",
  },
  {
    en: "Ripple",
    title: "波紋を広げる",
    body: "小さな課題解決が、やがて大きな変化の波となり、島全体を豊かにしていきます。",
  },
  {
    en: "Beside",
    title: "人に寄り添う",
    body: "難しい技術用語ではなく、分かりやすい言葉と温かい対応で、想いを形にします。",
  },
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
  const lineUrl = getOfficialLineAddFriendUrl();

  return (
    <>
      <AboutJsonLd />
      <main className="min-h-screen bg-[#05070a] text-slate-100">
        <Header />

        <section className="relative isolate flex min-h-[100dvh] items-end overflow-hidden md:items-center">
          <div className="absolute inset-0">
            <AmbientVideo poster="/about/poster-1.webp" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-[#05070a]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-20 pt-36 text-center md:pb-28 md:pt-28">
            <div className="relative mb-8 h-28 w-28 md:mb-10 md:h-40 md:w-40">
              <Image
                src={`${assetBase}/logo.png`}
                alt={`${LEGAL_NAME} ロゴ`}
                fill
                priority
                sizes="160px"
                className="object-contain drop-shadow-[0_0_36px_rgba(14,165,233,0.35)]"
              />
            </div>
            <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.42em] text-cyan-200/80">
              Company
            </p>
            <h1 className="font-serif text-4xl tracking-wide text-white md:text-6xl">会社概要</h1>
            <p className="mt-5 font-sans text-sm tracking-[0.18em] text-slate-200 md:text-base">
              島のリズムで、
              <span className="text-brand-gradient">未来をつくる。</span>
            </p>
          </div>
        </section>

        <section className="relative px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <p className="mb-4 font-sans text-[11px] uppercase tracking-[0.32em] text-cyan-300/80">
                About
              </p>
              <h2 className="mb-8 font-serif text-3xl leading-tight text-white md:text-4xl">
                デジタルだけど、
                <br />
                体温のある仕事を。
              </h2>
              <div className="space-y-6 font-serif text-base leading-loose text-slate-300 md:text-lg">
                <p>
                  {LEGAL_NAME}（アマリンク）は、奄美大島で生まれたデジタルクリエイティブチームです。
                </p>
                <p>
                  名前の「AMALINK」には、故郷「
                  <span className="font-semibold text-sky-400">AMAMI</span>」と、世界への「
                  <span className="font-semibold text-emerald-400">LINK</span>
                  」という二つの願いが込められています。
                </p>
                <p>
                  最先端の技術も大切ですが、それ以上に「誰かの役に立つこと」を大切に。島の暮らしに、そっと寄り添うような温かいデジタル体験をお届けします。
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-500/20 via-transparent to-emerald-400/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <div className="aspect-[16/10]">
                  <AmbientVideo poster="/about/poster-2.webp" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-16 md:pb-24">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {VALUES.map((item) => (
              <article
                key={item.en}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm md:p-8"
              >
                <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
                  {item.en}
                </p>
                <h3 className="mb-4 font-serif text-xl text-white">{item.title}</h3>
                <p className="font-sans text-sm leading-loose text-slate-400">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 pb-20 md:pb-28">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02]">
            <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="relative min-h-[16rem] lg:min-h-full">
                <Image
                  src={`${assetBase}/about/poster-3.webp`}
                  alt="奄美大島の風景"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-black/20 to-transparent lg:bg-gradient-to-r" />
              </div>

              <div className="px-6 py-10 md:px-10 md:py-12">
                <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.32em] text-cyan-300/80">
                  Profile
                </p>
                <h2 className="mb-8 font-serif text-3xl text-white">会社情報</h2>
                <dl className="divide-y divide-white/10">
                  {PROFILE.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 py-3.5 md:grid-cols-[8.5rem_minmax(0,1fr)]"
                    >
                      <dt className="font-sans text-xs tracking-wider text-slate-500">{row.label}</dt>
                      <dd className="font-sans text-sm leading-relaxed text-slate-200 md:text-[15px]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Business
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {SERVICES.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={new URL(service.url).pathname}
                        className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-sans text-xs text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 md:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl text-white md:text-4xl">
              まずは、気軽にお話ししませんか？
            </h2>
            <p className="mb-8 font-sans text-sm leading-loose text-slate-400">
              内容が固まっていなくても大丈夫です。公式LINE、またはお問い合わせからどうぞ。
            </p>
            <div className="mx-auto flex w-full max-w-[15rem] flex-col items-stretch justify-center gap-3 sm:max-w-[32rem] sm:flex-row sm:gap-5">
              <ChunkyAnchor
                href={lineUrl}
                theme="neu"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full min-w-0 flex-1 text-[0.95rem] md:text-base"
              >
                <span className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2">
                  <OfficialLineIcon className="size-[1em]" />
                  <span className="text-center">公式LINE</span>
                  <span />
                </span>
              </ChunkyAnchor>
              <ChunkyNextLink
                href="/contact"
                theme="neu"
                className="flex w-full min-w-0 flex-1 text-[0.95rem] md:text-base"
              >
                <span className="w-full text-center">お問い合わせ</span>
              </ChunkyNextLink>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
