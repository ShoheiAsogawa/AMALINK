import type { Metadata } from "next";
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import { PixelPlayButton } from "@/components/ui/PixelPlayButton";
import { RootJsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import "./globals.css";

const zenMincho = Zen_Old_Mincho({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const zenGothic = Zen_Kaku_Gothic_New({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteTitleDefault = `${SITE_NAME} - 島のリズムで、未来をつくる。`;

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: siteTitleDefault,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "AMALINK",
    "奄美",
    "システム開発",
    "ホームページ制作",
    "Webデザイン",
    "地域DX",
    "鹿児島",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: siteTitleDefault,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: `${SITE_NAME} ロゴ`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitleDefault,
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.png"],
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
        <RootJsonLd />
        {children}
        <PixelPlayButton />
      </body>
    </html>
  );
}
