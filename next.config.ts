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
        hostname: "ukibc-storage.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d2paj8ptqa22jg.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default withNextVideo(nextConfig);
