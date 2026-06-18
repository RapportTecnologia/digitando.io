import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.1.4"],
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/digitando.io",
};

export default nextConfig;
