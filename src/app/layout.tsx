import type { Metadata } from "next";
import Script from "next/script";
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import { DeferredWidgets } from "@/components/layout/DeferredWidgets";
import { RootJsonLd } from "@/components/seo/JsonLd";
import { GATEWAY_BOOT_SCRIPT } from "@/lib/gateway";
import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_TITLE, LEGAL_NAME, SITE_NAME } from "@/lib/seo";
import "./globals.css";

const zenMincho = Zen_Old_Mincho({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  // ヒーロー用。初回ペイントを妨げないよう preload は本文フォント側に寄せる
  preload: false,
});

const zenGothic = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${LEGAL_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "合同会社AMALINK",
    "AMALINK",
    "奄美大島",
    "奄美",
    "離島",
    "システム開発",
    "ホームページ制作",
    "Webデザイン",
    "地域DX",
    "鹿児島",
    "ウェブ制作",
    "GEO対策",
    "Generative Engine Optimization",
    "AI検索",
    "奄美大島ホームページ制作",
    "奄美大島デザイン",
  ],
  authors: [{ name: LEGAL_NAME }],
  creator: LEGAL_NAME,
  publisher: LEGAL_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: absoluteUrl("/"),
    siteName: `${LEGAL_NAME}（${SITE_NAME}）`,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/logo.png"),
        width: 512,
        height: 512,
        alt: `${LEGAL_NAME}（${SITE_NAME}）ロゴ`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl("/logo.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenMincho.variable} ${zenGothic.variable}`}>
      <body>
        <Script id="amalink-gateway-boot" strategy="beforeInteractive">
          {GATEWAY_BOOT_SCRIPT}
        </Script>
        <RootJsonLd />
        {children}
        <DeferredWidgets />
      </body>
    </html>
  );
}
