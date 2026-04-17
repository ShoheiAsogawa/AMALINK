import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export function RootJsonLd() {
  const root = absoluteUrl("/");
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${root}#organization`,
        name: SITE_NAME,
        url: root,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.png"),
        },
        description: DEFAULT_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${root}#website`,
        url: root,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "ja",
        publisher: { "@id": `${root}#organization` },
      },
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
