import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { hreflangLanguages, withLocale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

export function localeMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  const canonical = withLocale(path, locale);
  const languages = hreflangLanguages(path);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ja: absoluteUrl(languages.ja),
        en: absoluteUrl(languages.en),
        "x-default": absoluteUrl(languages["x-default"]),
      },
    },
    openGraph: {
      locale: locale === "en" ? "en_US" : "ja_JP",
      url: absoluteUrl(canonical),
      title,
      description,
      type: "website",
    },
  };
}
