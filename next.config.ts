import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  agentRules: false,
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/products/urad", destination: "/products/black-urad-dal", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
