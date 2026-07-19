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

function ServicesNav({ className }: { className?: string }) {
  return (
    <nav aria-label="フッターナビ" className={className}>
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-slate-400 md:mb-4">Services</p>
      <ul className="grid grid-cols-3 gap-x-2 gap-y-2 font-sans text-[11px] leading-snug text-slate-600 md:grid-cols-1 md:gap-2.5 md:text-sm md:leading-normal">
        {FOOTER_LINKS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="transition hover:text-amami-blue">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Tagline() {
  return (
    <p className="min-w-0 font-sans text-xs leading-relaxed text-slate-500 md:text-sm">
      島のリズムで、
      <br />
      <span className="text-amami-blue">未来をつくる。</span>
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-visible border-t border-slate-200 bg-slate-50 pt-12 pb-[calc(3rem+7.25rem)] md:pt-20 md:pb-[calc(5rem+8.5rem)]">
      <FooterTruck />
      <div className="container relative z-[1] mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-10">
          <div className="max-w-md text-left">
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold tracking-widest group md:text-2xl">
              <div className="relative h-8 w-8 md:h-10 md:w-10">
                <Image
                  src={`${assetBase}/logo.png`}
                  alt={`${LEGAL_NAME} ロゴ`}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-sans text-slate-900 transition-colors group-hover:text-amami-blue">AMALINK</span>
            </Link>
            <p className="font-sans text-xs leading-relaxed text-slate-500 md:text-sm">
              {LEGAL_NAME}
              <br />
              {COMPANY_OVERVIEW.address}
            </p>

            {/* 住所直下: タグライン＋ハテナ（モバイルは右にハテナ、PCはタグラインのみ） */}
            <div className="mt-[1em] flex items-end justify-between gap-3">
              <Tagline />
              <div className="shrink-0 md:hidden">
                <PixelPlayButton placement="footer" />
              </div>
            </div>

            <p className="mt-6 font-sans text-[10px] tracking-wide text-slate-400 md:mt-8 md:text-xs">
              &copy; {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
            </p>

            {/* モバイル: コピーライトの下にサービス3列 */}
            <ServicesNav className="mt-6 md:hidden" />
          </div>

          <ServicesNav className="hidden md:block md:justify-self-end" />
        </div>
      </div>
    </footer>
  );
}
