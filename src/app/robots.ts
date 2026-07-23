import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** 検索・生成AIクローラー向けに明示許可（GEO対策） */
const AI_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "Applebot",
] as const;

/** ページ以外の大量アセットをクロール対象から外す（GSCの「クロール済み-未登録」抑制） */
const DISALLOW_ASSETS = ["/_next/static/media/", "/_next/image"] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...DISALLOW_ASSETS],
      },
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: [...DISALLOW_ASSETS],
      })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(absoluteUrl("/")).host,
  };
}
