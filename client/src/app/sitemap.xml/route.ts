import { NextResponse } from "next/server";
import pages from "@/generated/sitemap.json";

export const runtime = "nodejs";

const BASE_URL = "https://sufoniq.com";
const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
}[character]!));

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(
  (page: { path: string; lastModified?: string }) => `  <url>
    <loc>${escapeXml(`${BASE_URL}${page.path}`)}</loc>${page.lastModified ? `\n    <lastmod>${escapeXml(page.lastModified)}</lastmod>` : ""}
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
