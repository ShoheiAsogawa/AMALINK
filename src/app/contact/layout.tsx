import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

const desc = `${SITE_NAME}へのお仕事のご相談・ご質問はこちらから。システム開発、ホームページ制作、デザインなどお気軽にお問い合わせください。`;

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: desc,
  alternates: { canonical: "/contact" },
  openGraph: {
    url: absoluteUrl("/contact"),
    title: `お問い合わせ | ${SITE_NAME}`,
    description: desc,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
