import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
  images: {
    domains: ["picsum.photos", "images.unsplash.com"],
  },

  /* config options here */
};

export default nextConfig;
