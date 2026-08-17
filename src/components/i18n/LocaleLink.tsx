"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { withLocale } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/useLocale";

type Props = ComponentProps<typeof Link>;

export function LocaleLink({ href, ...props }: Props) {
  const locale = useLocale();
  const nextHref = typeof href === "string" ? withLocale(href, locale) : href;
  return <Link href={nextHref} {...props} />;
}
