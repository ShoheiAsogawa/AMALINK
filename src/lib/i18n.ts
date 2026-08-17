export const LOCALES = ["ja", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ja";

const ABSOLUTE = /^(https?:|mailto:|tel:|javascript:)/i;

export function localeFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return DEFAULT_LOCALE;
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) {
    const rest = pathname.slice(3);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname || "/";
}

export function withLocale(href: string, locale: Locale): string {
  if (!href || ABSOLUTE.test(href)) return href;

  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const qIndex = withoutHash.indexOf("?");
  const search = qIndex >= 0 ? withoutHash.slice(qIndex) : "";
  let path = qIndex >= 0 ? withoutHash.slice(0, qIndex) : withoutHash;
  if (!path) path = "/";
  path = stripLocalePrefix(path);

  const prefixed = locale === "en" ? (path === "/" ? "/en" : `/en${path}`) : path;
  return `${prefixed}${search}${hash}`;
}

export function switchLocalePath(pathname: string, next: Locale): string {
  return withLocale(stripLocalePrefix(pathname) || "/", next);
}

export function hreflangLanguages(path: string): Record<string, string> {
  const stripped = stripLocalePrefix(path) || "/";
  const ja = stripped === "/" ? "/" : stripped;
  const en = stripped === "/" ? "/en" : `/en${stripped}`;
  return { ja, en, "x-default": ja };
}
