import {
  COMPANY_OVERVIEW,
  FAQ_ITEMS,
  KEY_URLS,
  SERVICES,
} from "@/lib/site-content";
import {
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  LEGAL_NAME,
  SITE_NAME,
  getOfficialLineAddFriendUrl,
} from "@/lib/seo";

export function RootJsonLd() {
  const root = absoluteUrl("/");
  const lineUrl = getOfficialLineAddFriendUrl();

  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${root}#organization`,
        name: LEGAL_NAME,
        alternateName: SITE_NAME,
        legalName: LEGAL_NAME,
        url: root,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.png"),
        },
        description: DEFAULT_DESCRIPTION,
        address: {
          "@type": "PostalAddress",
          ...COMPANY_OVERVIEW.postalAddress,
        },
        areaServed: [
          {
            "@type": "Place",
            name: COMPANY_OVERVIEW.region,
          },
          {
            "@type": "AdministrativeArea",
            name: "鹿児島県",
          },
        ],
        knowsAbout: [
          "奄美大島ホームページ制作",
          "奄美大島デザイン",
          "ホームページ制作",
          "システム開発",
          "Webデザイン",
          "ロゴデザイン",
          "AIコンサルティング",
          "AI導入支援",
          "業務効率化",
          "GEO対策",
          "Generative Engine Optimization",
          "地域DX",
          "奄美大島",
          "奄美群島",
        ],
        sameAs: [lineUrl],
        slogan: "島のリズムで、未来をつくる。",
      },
      {
        "@type": "WebSite",
        "@id": `${root}#website`,
        url: root,
        name: `${LEGAL_NAME}（${SITE_NAME}）`,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "ja",
        publisher: { "@id": `${root}#organization` },
      },
      ...SERVICES.map((service) => ({
        "@type": "Service",
        "@id": `${root}#${service.id}`,
        name: service.name,
        description: service.description,
        url: service.url,
        provider: { "@id": `${root}#organization` },
        areaServed: {
          "@type": "Place",
          name: COMPANY_OVERVIEW.baseLocation,
        },
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export function FaqPageJsonLd() {
  const faqUrl = KEY_URLS.faq;
  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: faqUrl,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
