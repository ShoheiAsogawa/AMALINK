"use client";

import Link from "next/link";
import Image from "next/image";
import { FooterTruck } from "@/components/layout/FooterTruck";
import { PixelPlayButton } from "@/components/ui/PixelPlayButton";
import { COMPANY_OVERVIEW } from "@/lib/site-content";
import { LEGAL_NAME } from "@/lib/seo";
import { useLocale } from "@/components/i18n/useLocale";
import { withLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function ServicesNav({ className }: { className?: string }) {
  const locale = useLocale();
  const t = getMessages(locale);
  return (
    <nav aria-label={t.footer.navLabel} className={className}>
      <p className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-slate-400">Services</p>
      <ul className="grid gap-2.5 font-sans text-sm text-slate-600">
        {t.footer.links.map((item) => (
          <li key={item.href}>
            <Link href={withLocale(item.href, locale)} className="transition hover:text-amami-blue">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const locale = useLocale();
  const t = getMessages(locale);
  return (
    <footer className="relative overflow-visible border-t border-slate-200 bg-slate-50 pt-12 pb-[calc(3rem+7.25rem)] md:pt-20 md:pb-[calc(5rem+8.5rem)]">
      <FooterTruck />
      <div className="container relative z-[1] mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
          <div className="flex max-w-md flex-col gap-4 text-left md:gap-5">
            <Link href={withLocale("/", locale)} className="flex items-center gap-2 text-xl font-bold tracking-widest group md:text-2xl">
              <div className="relative h-8 w-8 md:h-10 md:w-10">
                <Image
                  src={`${assetBase}/logo.png`}
                  alt={t.footer.logoAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-sans text-slate-900 transition-colors group-hover:text-amami-blue">AMALINK</span>
            </Link>

            <div className="flex items-end justify-between gap-3">
              <p className="min-w-0 font-sans text-xs leading-relaxed text-slate-500 md:text-sm">
                {t.footer.tagline1}
                <br />
                <span className="text-amami-blue">{t.footer.tagline2}</span>
              </p>
              <div className="shrink-0 md:hidden">
                <PixelPlayButton placement="footer" />
              </div>
            </div>

            <p className="font-sans text-xs leading-relaxed text-slate-500 md:text-sm">
              {LEGAL_NAME}
              <br />
              {COMPANY_OVERVIEW.address}
            </p>

            <p className="font-sans text-[10px] tracking-wide text-slate-400 md:text-xs">
              &copy; {new Date().getFullYear()} {LEGAL_NAME}. All rights reserved.
            </p>
          </div>

          {/* サービスは PC のみ */}
          <ServicesNav className="hidden md:block md:justify-self-end" />
        </div>
      </div>
    </footer>
  );
}
