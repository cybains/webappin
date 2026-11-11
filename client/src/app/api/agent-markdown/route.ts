import { NextRequest, NextResponse } from "next/server";
import sitemap from "@/generated/sitemap.json";
import { pageMarkdown, missingPageMarkdown } from "@/lib/agent-markdown";
import { SITE_URL } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const legal = ["", "/de", "/cs", "/pl", "/ro"].flatMap(prefix => [prefix + "/privacy-policy", prefix + "/terms-conditions"]);
const publicPages = new Set([...sitemap.map(page => page.path), ...legal]);
const headers = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Vary": "Accept",
  // Do not let a CDN reuse a Markdown response for an HTML request.
  "Cache-Control": "private, no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Link": '<https://sufoniq.com/llms.txt>; rel="describedby"',
};

export async function GET(request: NextRequest) {
  const path = request.headers.get("x-sufoniq-markdown-path") ?? request.nextUrl.searchParams.get("path") ?? "";
  if (!publicPages.has(path)) return new NextResponse(missingPageMarkdown, { status: 404, headers });

  // Fetch only an allowlisted public path on this deployment. No cookies,
  // credentials, query strings or caller-supplied fetch targets are forwarded.
  const origin = new URL(request.url);
  const local = !process.env.VERCEL && ["localhost", "127.0.0.1"].includes(origin.hostname);
  const deployment = /^[a-z0-9-]+\.vercel\.app$/.test(origin.hostname);
  if (!local && !deployment && origin.hostname !== "sufoniq.com") {
    return new NextResponse("# Markdown temporarily unavailable\n\nOpen the HTML page or contact support@sufoniq.com.\n", { status: 503, headers });
  }
  try {
    const source = await fetch(new URL(path, origin.origin), {
      headers: { Accept: "text/html", "User-Agent": "Sufoniq-Markdown-Reader" },
      redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(20000),
    });
    if (source.status === 404) return new NextResponse(missingPageMarkdown, { status: 404, headers });
    if (!source.ok || !source.headers.get("content-type")?.includes("text/html")) throw new Error("HTML source unavailable");
    return new NextResponse(pageMarkdown(await source.text(), new URL(path, SITE_URL).href), {
      headers: { ...headers, "Content-Language": /^\/(de|cs|pl|ro)(?:\/|$)/.exec(path)?.[1] ?? "en", ...(legal.includes(path) ? { "X-Robots-Tag": "noindex, follow" } : {}) },
    });
  } catch {
    // Never turn an unavailable/blocked HTML source into a fabricated success.
    return new NextResponse("# Markdown temporarily unavailable\n\nPlease retry later or open the HTML page. [Site guide](https://sufoniq.com/llms.txt).\n", { status: 503, headers });
  }
}

export async function HEAD(request: NextRequest) {
  const response = await GET(request);
  return new NextResponse(null, { status: response.status, headers: response.headers });
}
