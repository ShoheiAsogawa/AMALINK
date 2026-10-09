import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // 表示サイズに近い幅だけ生成し、/_next/image のURL爆発を抑える
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [48, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    return [
      {
        source: "/amami-digital",
        destination: "/",
        permanent: true,
      },
      // カテゴリ一覧の別の書き方（/news?category=ID）を正式なURLへ。旧IDならその先でさらに新IDへ転送される
      {
        source: "/news",
        has: [{ type: "query", key: "category", value: "(?<category>[a-z0-9-]+)" }],
        destination: "/news/category/:category",
        permanent: true,
      },
      {
        source: "/news/category",
        destination: "/news",
        permanent: true,
      },
      // 廃止したコラムは一時リダイレクトをやめ、ニュースへ恒久誘導（ソフト404感を解消）
      {
        source: "/articles",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/articles/:slug",
        destination: "/news",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/static/media/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/_next/image",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
