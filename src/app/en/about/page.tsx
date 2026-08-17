import type { Metadata } from "next";
import { AboutPageView } from "@/components/pages/AboutPageView";
import { localeMetadata } from "@/lib/i18n-meta";
import { getMessages } from "@/lib/messages";

const t = getMessages("en").aboutPage;

export const metadata: Metadata = localeMetadata("en", "/about", t.metaTitle, t.metaDescription);

export default function EnglishAboutPage() {
  return <AboutPageView locale="en" />;
}
