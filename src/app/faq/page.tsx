import type { Metadata } from "next";
import { FaqPageView } from "@/components/pages/FaqPageView";
import { localeMetadata } from "@/lib/i18n-meta";
import { getMessages } from "@/lib/messages";

const t = getMessages("ja").faqPage;

export const metadata: Metadata = localeMetadata("ja", "/faq", t.metaTitle, t.metaDescription);

export default function FaqPage() {
  return <FaqPageView locale="ja" />;
}
