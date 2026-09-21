import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_PROXY ?? "http://localhost:4000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;