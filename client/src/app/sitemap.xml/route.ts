import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BASE_URL = "https://sufoniq.com";
const URLS = [
  "/",
  "/about",
  "/core-services",
  "/countries",
  "/methodology",
  "/privacy-policy",
  "/terms-conditions",
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${URLS.map(
  (path) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${path === "/" ? "1.0" : "0.7"}</priority>
  </url>`,
).join("\n")}
</urlset>`;

export async function GET() {
  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, stale-while-revalidate=86400",
    },
  });
}
