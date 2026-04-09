import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages用の設定（Vercel以外の本番ビルド時のみ有効）
  ...(process.env.NODE_ENV === 'production' && !process.env.VERCEL && {
    output: 'export',
    basePath: '/AMARINK',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  }),
};

export default nextConfig;

