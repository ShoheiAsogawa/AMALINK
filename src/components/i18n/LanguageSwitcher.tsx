"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { localeFromPathname, switchLocalePath } from "@/lib/i18n";

export function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const locale = localeFromPathname(pathname);
  const jaHref = switchLocalePath(pathname, "ja");
  const enHref = switchLocalePath(pathname, "en");

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-slate-200/90 bg-white/80 p-0.5 font-sans text-[11px] tracking-[0.14em] shadow-[0_8px_20px_-16px_rgba(15,23,42,0.35)] backdrop-blur-sm",
        className,
      )}
      role="group"
      aria-label={locale === "en" ? "Language" : "言語"}
    >
      <Link
        href={jaHref}
        hrefLang="ja"
        className={cn(
          "rounded-full px-2.5 py-1.5 transition-colors",
          locale === "ja" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800",
        )}
        aria-current={locale === "ja" ? "true" : undefined}
      >
        JA
      </Link>
      <Link
        href={enHref}
        hrefLang="en"
        className={cn(
          "rounded-full px-2.5 py-1.5 transition-colors",
          locale === "en" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800",
        )}
        aria-current={locale === "en" ? "true" : undefined}
      >
        EN
      </Link>
    </div>
  );
}
