import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Contact } from "@/components/sections/Contact";
import { type Locale, withLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export function ServiceLanding({ slug, locale }: { slug: string; locale: Locale }) {
  const copy = getMessages(locale).servicePages[slug];
  const common = getMessages(locale).common;
  if (!copy) return null;

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <Header />

      <section className="bg-gradient-to-b from-amami-blue/10 to-white px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-10 font-sans text-sm text-slate-500" aria-label={common.breadcrumb}>
            <Link href={withLocale("/", locale)} className="hover:text-amami-blue">
              {common.home}
            </Link>
            <span className="mx-2" aria-hidden>
              ／
            </span>
            <span>{copy.crumb}</span>
          </nav>
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-4xl font-serif text-2xl leading-[1.65] font-bold text-brand-gradient [word-break:keep-all] sm:text-4xl sm:leading-tight md:text-6xl">
            {copy.h1.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            {copy.h1Sub ? (
              <span className="mt-2 block text-[0.72em] font-bold text-slate-700 sm:mt-3 md:text-[0.55em]">
                {copy.h1Sub}
              </span>
            ) : null}
          </h1>
          <p className="mt-8 max-w-3xl font-sans text-lg leading-loose text-slate-600 md:text-xl">
            {copy.intro}
          </p>
        </div>
      </section>

      {copy.sections.map((section, index) => {
        const muted = index % 2 === 1;
        return (
        <section
          key={section.heading}
          className={muted ? "bg-slate-50 px-6 py-20 md:py-28" : "px-6 py-20 md:py-28"}
        >
          <div className="mx-auto max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">
              {section.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-brand-gradient [word-break:keep-all] md:text-5xl">
              {section.heading}
            </h2>
            {section.body ? (
              <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">{section.body}</p>
            ) : null}
            {section.numbered ? (
              <ol className="mt-12 grid gap-5">
                {section.cards.map((item, i) => (
                  <li
                    key={item.title}
                    className={`grid gap-3 rounded-3xl p-7 md:grid-cols-[5rem_14rem_1fr] md:items-center md:p-9 ${muted ? "bg-white" : "bg-slate-50"}`}
                  >
                    <span className="font-serif text-3xl text-amami-blue/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-brand-gradient">{item.title}</h3>
                    <p className="font-sans leading-loose text-slate-600">{item.body}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {section.cards.map((item) => (
                  <article
                    key={item.title}
                    className={`rounded-3xl border border-slate-100 p-7 md:p-9 ${muted ? "bg-white" : "bg-slate-50"}`}
                  >
                    <h3 className="font-serif text-2xl font-bold text-brand-gradient">{item.title}</h3>
                    <p className="mt-4 font-sans leading-loose text-slate-600">{item.body}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
        );
      })}

      <section className="bg-slate-50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">FAQ</p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-brand-gradient [word-break:keep-all] md:text-5xl">
            {copy.faqHeading}
          </h2>
          <div className="mt-10">
            <FaqAccordion items={copy.faqs} />
          </div>
        </div>
      </section>

      <Contact
        title={copy.contactTitle}
        description={
          <>
            {copy.contactDescription[0]}
            <br />
            {copy.contactDescription[1]}
          </>
        }
      />
      <Footer />
    </main>
  );
}
