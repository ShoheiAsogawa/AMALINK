import type { Metadata } from "next";
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
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

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "AMALINK - 島のリズムで、未来をつくる。",
  description: "奄美で起業するAMALINK。情報で人と人をつなげ、島内外の懸け橋となります。",
  icons: {
    icon: `${assetBase}/logo.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${zenMincho.variable} ${zenGothic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
