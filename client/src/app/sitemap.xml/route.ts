import { NextResponse } from "next/server";
import {germanPaths,englishPath,localizedHref} from "@/lib/i18n/shared";
import pages from "@/generated/sitemap.json";

export const runtime = "nodejs";

const BASE_URL = "https://sufoniq.com";
const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
}[character]!));

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(
  (page: { path: string; lastModified?: string }) => `  <url>
    <loc>${escapeXml(`${BASE_URL}${page.path}`)}</loc>${page.lastModified ? `\n    <lastmod>${escapeXml(page.lastModified)}</lastmod>` : ""}
${(germanPaths as readonly string[]).includes(englishPath(page.path)) ? ["en", "de", "x-default"].map(lang => `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(BASE_URL + localizedHref(englishPath(page.path), lang === "de" ? "de" : "en"))}" />`).join("") : ""}
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
