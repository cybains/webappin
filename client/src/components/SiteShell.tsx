import { LocaleProvider } from "@/lib/i18n/client";
import { getMessages } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/shared";
import localFont from "next/font/local";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { serializeSchema, siteIdentitySchema } from "@/lib/structured-data";
const geist = localFont({ src: "../app/fonts/Geist-Variable.woff2", weight: "100 900", display: "swap", variable: "--font-geist", fallback: ["Arial"] });



export default function SiteShell({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
}>) {
  return (
    <html
      lang={locale}
      className={geist.variable}
      data-theme="light"
      style={{ transitionProperty: "none", marginRight: 0 }}
    >
      <body className="antialiased flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(siteIdentitySchema) }} />
        <LocaleProvider locale={locale} messages={getMessages(locale)}><Navbar />
        <div className="flex-1" data-page-content>{children}</div>
        <Footer locale={locale} /></LocaleProvider>
      </body>
    </html>
  );
}
