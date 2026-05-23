import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
