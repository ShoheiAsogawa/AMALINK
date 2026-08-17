import type { Metadata } from "next";
import { FaqPageView } from "@/components/pages/FaqPageView";
import { localeMetadata } from "@/lib/i18n-meta";
import { getMessages } from "@/lib/messages";

const t = getMessages("en").faqPage;

export const metadata: Metadata = localeMetadata("en", "/faq", t.metaTitle, t.metaDescription);

export default function EnglishFaqPage() {
  return <FaqPageView locale="en" />;
}
