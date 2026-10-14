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
        source: "/use-cases",
        destination: "/case-studies",
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
