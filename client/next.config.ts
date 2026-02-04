import type { NextConfig } from "next";

const HOSTNAME = "www.sufoniq.com";
const CANONICAL = "https://sufoniq.com";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: HOSTNAME,
          },
        ],
        destination: `${CANONICAL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
