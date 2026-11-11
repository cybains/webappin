import { NextRequest, NextResponse, userAgent } from "next/server";
import { countryLanguage, LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE, savedLanguage } from "@/lib/i18n/preference";
import { appendVary, representation } from "@/lib/agent-negotiation";

// Country headers are supplied by the hosting edge; no external IP lookup or IP storage.
// Only the bare homepage negotiates language. Locale URLs and deep links stay explicit.
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Leave APIs, static files and React's client-navigation protocol alone.
  const componentRequest = request.headers.get("accept")?.trim().toLowerCase() === "text/x-component";
  if (path.startsWith("/api/") || path.startsWith("/_next/") || /\.[^/]+$/.test(path) || request.headers.get("rsc") === "1" || componentRequest || !["GET", "HEAD"].includes(request.method)) return NextResponse.next();
  const format = representation(request.headers.get("accept"));
  if (format === "text/markdown") {
    const target = request.nextUrl.clone();
    target.pathname = "/api/agent-markdown";
    target.search = "";
    target.searchParams.set("path", path);
    const forwarded = new Headers(request.headers);
    forwarded.set("x-sufoniq-markdown-path", path);
    const response = NextResponse.rewrite(target, { request: { headers: forwarded } });
    response.headers.set("Vary", "Accept");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  if (!format) return new NextResponse("Available representations: text/html, text/markdown.\n", { status: 406, headers: { "Content-Type": "text/plain; charset=utf-8", "Vary": "Accept", "Cache-Control": "no-store" } });
  const html = () => {
    const response = NextResponse.next();
    response.headers.set("Vary", "Accept");
    response.headers.set("Link", '<https://sufoniq.com/llms.txt>; rel="describedby"');
    return response;
  };
  if (path !== "/" || userAgent(request).isBot || request.headers.get("user-agent") === "Sufoniq-Markdown-Reader") {
    return html();
  }

  // Prefetching a homepage link must not silently choose a visitor's language.
  if (request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch") {
    return html();
  }

  const preference = savedLanguage(request.cookies.get(LANGUAGE_COOKIE)?.value);
  const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
  const locale = preference ?? countryLanguage(country);
  const destination = request.nextUrl.clone();
  destination.pathname = locale === "en" ? "/" : `/${locale}`;
  const response = locale === "en" ? NextResponse.next() : NextResponse.redirect(destination, 307);

  // Never share a visitor's language decision through browser/CDN caches.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", appendVary(response.headers.get("Vary"), "Accept") + ", Cookie, X-Vercel-IP-Country, CF-IPCountry");
  if (!preference) {
    response.cookies.set(LANGUAGE_COOKIE, locale, {
      path: "/", maxAge: LANGUAGE_COOKIE_MAX_AGE, sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
  }
  return response;
}

export const config = { matcher: ["/((?!api/|_next/|.*\\.[^/]+$).*)"] };
