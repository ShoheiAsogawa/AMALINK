"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, localizedPath, splitLocalePath } from "@/lib/i18n-config";

const ALL = [DEFAULT_LOCALE, ...LOCALES];

/** ヘッダーの言語切り替え。訳は Worker が付けるので、ここは同じパスの各言語版へ普通のリンクで移るだけ。 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const [path, setPath] = useState<{ current: string; base: string }>({ current: DEFAULT_LOCALE.code, base: "/" });
  useEffect(() => {
    const { locale, basePath } = splitLocalePath(window.location.pathname);
    setPath({ current: locale?.code ?? DEFAULT_LOCALE.code, base: basePath });
  }, []);
  return (
    <div data-no-translate className={`flex items-center gap-1 font-sans text-xs font-bold tracking-wide ${className}`} aria-label="Language">
      {ALL.map((l, i) => {
        const active = l.code === path.current;
        return (
          <span key={l.code} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-300" aria-hidden>/</span>}
            <a
              href={localizedPath(path.base, l.code)}
              hrefLang={l.hreflang}
              lang={l.htmlLang}
              aria-current={active ? "true" : undefined}
              className={`rounded-full px-2 py-1 transition-colors ${active ? "bg-[#188a8c] text-white" : "text-slate-700 hover:text-[#188a8c]"}`}
            >
              {l.code === DEFAULT_LOCALE.code ? "JA" : l.code.toUpperCase().replace("ZH-HANS", "简").replace("ZH-HANT", "繁")}
            </a>
          </span>
        );
      })}
    </div>
  );
}
