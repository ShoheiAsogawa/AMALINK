import type { Metadata } from "next";
import { AboutPageView } from "@/components/pages/AboutPageView";
import { COMPANY_OVERVIEW } from "@/lib/site-content";
import { localeMetadata } from "@/lib/i18n-meta";
import { getMessages } from "@/lib/messages";
import { absoluteUrl, LEGAL_NAME, SITE_NAME } from "@/lib/seo";

const t = getMessages("ja").aboutPage;

export const metadata: Metadata = {
  ...localeMetadata("ja", "/about", t.metaTitle, t.metaDescription),
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
};

function AboutJsonLd() {
  const url = absoluteUrl("/about");
  const payload = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${LEGAL_NAME} 会社概要`,
    url,
    description: t.metaDescription,
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
      <AboutPageView locale="ja" />
    </>
  );
}
