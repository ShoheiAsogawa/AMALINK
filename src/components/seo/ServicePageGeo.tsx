import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

type WhyItem = {
  title: string;
  body: string;
};

type RelatedLink = {
  href: string;
  label: string;
};

/** AI・検索向けの引用しやすい定義ブロック（画面は自然な一文のみ） */
export function CiteableAnswer({ answer }: { answer: string }) {
  return (
    <section className="px-6 py-16 md:py-20" aria-labelledby="geo-answer-heading">
      <div className="mx-auto max-w-5xl">
        <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">Quick answer</p>
        <h2 id="geo-answer-heading" className="mt-3 font-serif text-2xl font-bold text-brand-gradient [word-break:keep-all] md:text-4xl">
          ひとことで言うと
        </h2>
        <p className="mt-6 max-w-4xl font-sans text-lg leading-loose text-slate-700 md:text-xl" data-geo-answer>
          {answer}
        </p>
      </div>
    </section>
  );
}

export function WhyLocalSection({
  eyebrow,
  heading,
  intro,
  items,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  items: readonly WhyItem[];
}) {
  return (
    <section className="bg-slate-50 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-3xl font-bold text-brand-gradient [word-break:keep-all] md:text-5xl">{heading}</h2>
        <p className="mt-6 max-w-3xl font-sans leading-loose text-slate-600">{intro}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-3xl bg-white p-7 md:p-8">
              <h3 className="font-serif text-xl font-bold text-brand-gradient">{item.title}</h3>
              <p className="mt-4 font-sans leading-loose text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedServices({ links }: { links: readonly RelatedLink[] }) {
  return (
    <section className="px-6 pb-8 pt-4 md:pb-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-sans text-xs uppercase tracking-[0.24em] text-amami-blue">Related</p>
        <h2 className="mt-3 font-serif text-2xl font-bold text-brand-gradient [word-break:keep-all] md:text-3xl">あわせてご覧ください</h2>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-sans text-sm md:text-base">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-amami-blue underline-offset-4 hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type ServiceJsonLdInput = {
  url: string;
  name: string;
  description: string;
  serviceTypes: readonly string[];
  breadcrumbName: string;
  faqs: readonly { question: string; answer: string }[];
  keywords: readonly string[];
};

export function ServicePageJsonLd({
  url,
  name,
  description,
  serviceTypes,
  breadcrumbName,
  faqs,
  keywords,
}: ServiceJsonLdInput) {
  const root = absoluteUrl("/");
  const organizationId = `${root}#organization`;
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        alternateName: [...keywords],
        serviceType: [...serviceTypes],
        description,
        url,
        provider: { "@id": organizationId },
        areaServed: [
          { "@type": "Place", name: "奄美大島" },
          { "@type": "AdministrativeArea", name: "奄美群島" },
          { "@type": "AdministrativeArea", name: "鹿児島県" },
          { "@type": "Country", name: "日本" },
        ],
        audience: {
          "@type": "Audience",
          audienceType: "奄美大島・離島エリアの中小事業者、観光・宿泊・特産品事業者",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: "ja",
        isPartOf: { "@id": `${root}#website` },
        about: { "@id": `${url}#service` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "#geo-answer-heading", "[data-geo-answer]"],
        },
        keywords: keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: root },
          { "@type": "ListItem", position: 2, name: breadcrumbName, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
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
