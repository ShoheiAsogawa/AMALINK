import type { Metadata } from "next";
import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";
import { COMPANY_OVERVIEW } from "@/lib/site-content";

const title = "お問い合わせ｜奄美大島の合同会社AMALINK";
const desc = `${LEGAL_NAME}（${SITE_NAME}）へのお問い合わせ。鹿児島県奄美大島拠点で、AI活用支援・社内チャットボット・ホームページ制作・システム開発・デザイン・GEO対策のご相談を受け付けています。全国オンライン対応。`;

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: desc,
  alternates: { canonical: "/contact" },
  openGraph: {
    url: absoluteUrl("/contact"),
    title,
    description: desc,
    type: "website",
  },
};

function ContactJsonLd() {
  const url = absoluteUrl("/contact");
  const payload = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${LEGAL_NAME} お問い合わせ`,
    description: desc,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: `${LEGAL_NAME}（${SITE_NAME}）`,
      url: absoluteUrl("/"),
    },
    about: {
      "@type": "Organization",
      name: LEGAL_NAME,
      alternateName: SITE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: COMPANY_OVERVIEW.postalAddress.streetAddress,
        addressLocality: COMPANY_OVERVIEW.postalAddress.addressLocality,
        addressRegion: COMPANY_OVERVIEW.postalAddress.addressRegion,
        addressCountry: COMPANY_OVERVIEW.postalAddress.addressCountry,
      },
      areaServed: ["奄美大島", "奄美群島", "鹿児島県", "日本"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContactJsonLd />
      {children}
    </>
  );
}
