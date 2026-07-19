import Link from "next/link";
import Image from "next/image";
import { FooterTruck } from "@/components/layout/FooterTruck";
import { PixelPlayButton } from "@/components/ui/PixelPlayButton";
import { COMPANY_OVERVIEW } from "@/lib/site-content";
import { LEGAL_NAME } from "@/lib/seo";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const FOOTER_LINKS = [
  { href: "/web-production", label: "ホームページ制作" },
  { href: "/design", label: "デザイン" },
  { href: "/ai-consulting", label: "AIコンサルティング" },
  { href: "/geo-seo", label: "GEO・SEO対策" },
  { href: "/system-development", label: "システム開発" },
  { href: "/faq", label: "よくある質問" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export default function Footer() {
  return (
    <footer className="relative overflow-visible border-t border-slate-200 bg-slate-50 pt-12 pb-[calc(3rem+7.25rem)] md:pt-20 md:pb-[calc(5rem+8.5rem)]">
      <FooterTruck />
      <div className="container relative z-[1] mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
          <div className="max-w-md text-left">
            <Link href="/" className="text-xl md:text-2xl font-bold tracking-widest flex items-center gap-2 mb-4 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src={`${assetBase}/logo.png`}
                  alt={`${LEGAL_NAME} ロゴ`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-slate-900 font-sans group-hover:text-amami-blue transition-colors">AMALINK</span>
            </Link>
            <p className="text-slate-500 text-xs md:text-sm font-sans leading-relaxed">
              {LEGAL_NAME}
              <br />
              {COMPANY_OVERVIEW.address}
            </p>
            <p className="mt-[1em] text-slate-500 text-xs md:text-sm font-sans leading-relaxed">
              島のリズムで、
              <br />
              <span className="text-amami-blue">未来をつくる。</span>
            </p>
            <p className="mt-8 text-[10px] md:text-xs tracking-wide font-sans text-slate-400">
              &copy; {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
            </p>
          </div>

          <nav aria-label="フッターナビ" className="md:justify-self-end">
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-slate-400">Services</p>
            <ul className="grid gap-2.5 font-sans text-sm text-slate-600">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-amami-blue">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* モバイルのみ: ハテナをフッター右下に配置（右下 fixed はやめる） */}
        <div className="mt-8 flex justify-end md:hidden">
          <PixelPlayButton placement="footer" />
        </div>
      </div>
    </footer>
  );
}
