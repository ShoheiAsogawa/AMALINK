import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

const desc = `${SITE_NAME}へのご相談はこちら。奄美大島でAIのことなら、活用支援・社内ボット・ホームページ制作・システム開発・デザインまでお気軽にどうぞ。`;

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
