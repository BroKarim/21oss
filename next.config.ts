import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    useCache: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 768, 1024, 1280],
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
      },
      {
        protocol: "https",
        hostname: "**", // sementara izinkan semua domain
      },
      {
        protocol: "http",
        hostname: "**", // kalau ada og-image non-https
      },
    ],
  },
};

export default nextConfig;
