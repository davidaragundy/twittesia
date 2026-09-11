import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@hugeicons/react"],
  },
};

export default nextConfig;
