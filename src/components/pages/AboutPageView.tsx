import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AmbientVideo } from "@/components/about/AmbientVideo";
import { Contact } from "@/components/sections/Contact";
import { COMPANY_OVERVIEW, SERVICES } from "@/lib/site-content";
import { LEGAL_NAME } from "@/lib/seo";
import { type Locale, withLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function AboutPageView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).aboutPage;
  const profile = [
    { label: t.labels.legalName, value: COMPANY_OVERVIEW.legalName },
    { label: t.labels.representative, value: COMPANY_OVERVIEW.representative },
    { label: t.labels.capital, value: COMPANY_OVERVIEW.capital },
    { label: t.labels.address, value: COMPANY_OVERVIEW.address },
  ] as const;

  return (
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
              alt={`${LEGAL_NAME} logo`}
              fill
              priority
              sizes="160px"
              className="object-contain drop-shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
            />
          </div>
          <p className="mb-3 font-sans text-[11px] uppercase tracking-[0.42em] text-amami-blue">
            Company
          </p>
          <h1 className="font-serif text-4xl tracking-wide text-slate-800 md:text-6xl">{t.heading}</h1>
          <p className="mt-5 font-sans text-sm tracking-[0.18em] text-slate-500 md:text-base">
            {t.taglineBefore}{" "}
            <span className="text-brand-gradient">{t.taglineAccent}</span>
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
              {t.storyHeading}
            </h2>
            <div className="space-y-6 font-serif text-base leading-loose text-slate-600 md:text-lg">
              <p>{t.storyP1}</p>
              <p>
                {t.storyP2Before}
                <span className="font-semibold text-amami-blue">AMAMI</span>
                {locale === "ja" ? (
                  <>
                    」と、世界への「
                    <span className="font-semibold text-amami-green">LINK</span>
                    {t.storyP2After}
                  </>
                ) : (
                  <>
                    {" "}
                    and a <span className="font-semibold text-amami-green">LINK</span> to the world
                    {t.storyP2After}
                  </>
                )}
              </p>
              <p>{t.storyP3}</p>
            </div>
          </div>

          <div className="relative pb-16 md:pb-20">
            <div className="overflow-hidden rounded-[1.6rem] bg-slate-50 shadow-[0_28px_64px_-24px_rgba(15,23,42,0.28)]">
              <div className="aspect-[16/9]">
                <AmbientVideo
                  poster="/about/story.webp"
                  src="/about/story.mp4"
                  srcSm="/about/story-sm.mp4"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 left-4 z-10 w-[58%] overflow-hidden rounded-[1.25rem] border-[6px] border-white bg-slate-50 shadow-[0_22px_48px_-18px_rgba(15,23,42,0.38)] sm:left-6 md:-bottom-4 md:-left-8 md:w-[62%] md:rounded-[1.4rem]">
              <div className="aspect-[16/9]">
                <AmbientVideo
                  poster="/about/turtle.webp"
                  src="/about/turtle.mp4"
                  srcSm="/about/turtle-sm.mp4"
                />
              </div>
            </div>
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
                  alt={`${LEGAL_NAME} logo`}
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="bg-white px-6 py-10 md:px-10 md:py-12">
              <p className="mb-3 font-sans text-xs uppercase tracking-[0.28em] text-amami-blue">
                {t.profile}
              </p>
              <h2 className="mb-8 font-serif text-3xl text-slate-800">{t.profileHeading}</h2>
              <dl className="divide-y divide-slate-100">
                {profile.map((row) => (
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
                  <dt className="pt-0.5 font-sans text-xs tracking-wider text-slate-400">{t.labels.businesses}</dt>
                  <dd>
                    <ol className="space-y-2.5">
                      {SERVICES.map((service, index) => (
                        <li key={service.id}>
                          <Link
                            href={withLocale(new URL(service.url).pathname, locale)}
                            className="group flex items-baseline gap-3"
                          >
                            <span className="w-5 shrink-0 font-sans text-[11px] tabular-nums tracking-wider text-amami-blue">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="font-serif text-[15px] text-slate-800 transition-colors group-hover:text-amami-blue">
                              {locale === "en" ? service.enName : service.name}
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
  );
}
