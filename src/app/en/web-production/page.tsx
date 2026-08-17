import type { Metadata } from "next";
import { ServiceLanding } from "@/components/pages/ServiceLanding";
import { localeMetadata } from "@/lib/i18n-meta";
import { getMessages } from "@/lib/messages";

const copy = getMessages("en").servicePages["web-production"]!;

export const metadata: Metadata = localeMetadata("en", copy.path, copy.metaTitle, copy.metaDescription);

export default function Page() {
  return <ServiceLanding slug="web-production" locale="en" />;
}
