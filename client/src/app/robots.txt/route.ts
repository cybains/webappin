import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CONTENT = `User-agent: *
Allow: /
Sitemap: https://sufoniq.com/sitemap.xml
`;

export async function GET() {
  return new NextResponse(CONTENT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, stale-while-revalidate=86400",
    },
  });
}
