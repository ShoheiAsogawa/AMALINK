import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256],
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
      {
        source: "/articles",
        destination: "/",
        permanent: false,
      },
      {
        source: "/articles/:slug",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
