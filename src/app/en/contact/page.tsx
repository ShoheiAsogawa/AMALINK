import type { Metadata } from "next";
import { localeMetadata } from "@/lib/i18n-meta";
import { getMessages } from "@/lib/messages";

const t = getMessages("en").contactPage;

export const metadata: Metadata = localeMetadata(
  "en",
  "/contact",
  t.heading,
  "Contact Godo Kaisha AMALINK. AI, websites, systems, design, and GEO — based on Amami Oshima, online nationwide.",
);

export { default } from "../../contact/page";
