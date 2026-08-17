import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqPageJsonLd } from "@/components/seo/JsonLd";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ChunkyNextLink } from "@/components/ui/ChunkyButton";
import { type Locale, withLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export function FaqPageView({ locale }: { locale: Locale }) {
  const t = getMessages(locale).faqPage;
  return (
    <main className="min-h-screen bg-slate-50">
      {locale === "ja" ? <FaqPageJsonLd /> : null}
      <Header />
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        <p className="mb-3 text-center text-xs font-sans uppercase tracking-widest text-amami-blue">
          FAQ
        </p>
        <h1 className="mb-4 text-center font-serif text-3xl text-slate-800 md:text-5xl">
          {t.heading}
        </h1>
        <p className="mb-12 text-center font-sans leading-loose text-slate-500">
          {t.lead}
        </p>

        <FaqAccordion />

        <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <h2 className="mb-3 font-serif text-xl text-slate-800">{t.ctaTitle}</h2>
          <p className="mb-6 font-sans text-sm leading-loose text-slate-500">{t.ctaBody}</p>
          <ChunkyNextLink
            href={withLocale("/contact", locale)}
            theme="primary"
            className="mx-auto inline-flex min-w-[15.5rem] sm:min-w-[17.5rem]"
          >
            <span className="whitespace-nowrap px-1">{t.ctaButton}</span>
          </ChunkyNextLink>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          <Link href={withLocale("/", locale)} className="hover:text-amami-blue">
            {t.backHome}
          </Link>
        </p>
      </section>
      <Footer />
    </main>
  );
}
