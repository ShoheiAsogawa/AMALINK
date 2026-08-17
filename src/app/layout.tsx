import type { Metadata } from "next";
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import { AmalinkChatbot } from "@/components/chatbot/AmalinkChatbot";
import { PixelPlayButton } from "@/components/ui/PixelPlayButton";
import { RootJsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_TITLE, LEGAL_NAME, SITE_NAME } from "@/lib/seo";
import "./globals.css";

const zenMincho = Zen_Old_Mincho({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-zen-mincho",
  display: "optional",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "serif"],
});

const zenGothic = Zen_Kaku_Gothic_New({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-zen-gothic",
  display: "optional",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "YuGothic", "Meiryo", "sans-serif"],
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
    "奄美大島 AI",
    "奄美大島でAI",
    "AIコンサルティング",
    "AI導入支援",
    "生成AI",
    "社内チャットボット",
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
    <html lang="ja" className={`${zenMincho.variable} ${zenGothic.variable} ${zenGothic.className}`}>
      <head>
        {/* Google tag (gtag.js) — 全ページ共通・ここ1箇所のみ */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4XHQG5H0D3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4XHQG5H0D3');
            `,
          }}
        />
      </head>
      <body>
        <RootJsonLd />
        {children}
        <AmalinkChatbot />
        <PixelPlayButton />
      </body>
    </html>
  );
}
