import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve /public images as-is. The host's image optimizer (/_next/image)
    // was failing in production and leaving some images blank; every asset is
    // already web-sized (largest ~270 KB), so optimisation isn't needed.
    unoptimized: true,
  },
};

export default nextConfig;
