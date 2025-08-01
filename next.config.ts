import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ignore eslint
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
