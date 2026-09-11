import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@hugeicons/react"],
  },
};

export default nextConfig;
