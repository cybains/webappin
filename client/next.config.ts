import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";
import path from "node:path";

// Generate before Next loads routes, including builds that bypass npm scripts.
execFileSync(process.execPath, [path.join(process.cwd(), "scripts/generate-sitemap.mjs")], {
  cwd: process.cwd(),
  stdio: "inherit",
});

const HOSTNAME = "www.sufoniq.com";
const CANONICAL = "https://sufoniq.com";

const nextConfig: NextConfig = {
  // Isolate verification builds from an active local development server.
  distDir: process.env.SUFONIQ_BUILD_DIR || ".next",
  async redirects() {
    return [
      {
        source: "/hiring-in-practice",
        destination: "/employers",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/employers",
        permanent: true,
      },
      {
        source: "/use-cases",
        destination: "/employers",
        permanent: true,
      },
      {
        source: "/methodology",
        destination: "/method-trust",
        permanent: true,
      },
      {
        source: "/countries",
        destination: "/",
        permanent: true,
      },
      {
        source: "/country/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/growth-atlas",
        destination: "/insights",
        permanent: true,
      },
      {
        source: "/core-services",
        destination: "/work-in-europe",
        permanent: true,
      },
      {
        source: "/maptest",
        destination: "/",
        permanent: true,
      },
      {
        source: "/jobs",
        destination: "/employers",
        permanent: true,
      },
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
