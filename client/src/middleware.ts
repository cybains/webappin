import { NextRequest, NextResponse, userAgent } from "next/server";
import { countryLanguage, LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE, savedLanguage } from "@/lib/i18n/preference";

// Country headers are supplied by the hosting edge; no external IP lookup or IP storage.
// Only the bare homepage negotiates language. Locale URLs and deep links stay explicit.
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/" || !["GET", "HEAD"].includes(request.method) || userAgent(request).isBot) {
    return NextResponse.next();
  }

  // Prefetching a homepage link must not silently choose a visitor's language.
  if (request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch") {
    return NextResponse.next();
  }

  const preference = savedLanguage(request.cookies.get(LANGUAGE_COOKIE)?.value);
  const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
  const locale = preference ?? countryLanguage(country);
  const destination = request.nextUrl.clone();
  destination.pathname = locale === "en" ? "/" : `/${locale}`;
  const response = locale === "en" ? NextResponse.next() : NextResponse.redirect(destination, 307);

  // Never share a visitor's language decision through browser/CDN caches.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Cookie, X-Vercel-IP-Country, CF-IPCountry");
  if (!preference) {
    response.cookies.set(LANGUAGE_COOKIE, locale, {
      path: "/", maxAge: LANGUAGE_COOKIE_MAX_AGE, sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
  }
  return response;
}

export const config = { matcher: "/" };
