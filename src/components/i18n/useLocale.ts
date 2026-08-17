"use client";

import { usePathname } from "next/navigation";
import { localeFromPathname, type Locale } from "@/lib/i18n";

export function useLocale(): Locale {
  return localeFromPathname(usePathname());
}
