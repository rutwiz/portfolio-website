import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/career",
        destination: "/about?section=career",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/about?section=projects",
        permanent: true,
      },
      {
        source: "/hobbies",
        destination: "/about?section=hobbies",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
