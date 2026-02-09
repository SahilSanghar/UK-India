import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bryanp25.sg-host.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ukibc.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextVideo(nextConfig);
