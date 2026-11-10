import {availableLocales,pathLocale,englishPath,localizedHref} from "./i18n/shared";
import type { Metadata } from "next";

export const SITE_URL = "https://sufoniq.com";
export const shareImage = {
  url: SITE_URL + "/sufoniq-share.png",
  width: 1200,
  height: 630,
  alt: "Sufoniq — cross-border recruitment and mobility in Europe",
};
const description = "Sufoniq helps European employers connect workforce planning, candidate sourcing and screening with the mobility requirements a hire needs to start.";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sufoniq | Cross-border Recruitment & Mobility",
  description,
  openGraph: { type: "website", siteName: "Sufoniq", title: "Sufoniq | Cross-border Recruitment & Mobility", description, images: [shareImage] },
  twitter: { card: "summary_large_image", title: "Sufoniq | Cross-border Recruitment & Mobility", description, images: [shareImage.url] },
};

export function createPageMetadata(path: string, title: string, description: string, type: "website" | "article" = "website"): Metadata {
  const url = new URL(path, SITE_URL).href;
  const basePath=englishPath(path);
  const locales=availableLocales(basePath),language=pathLocale(path);
  const ogLocales={en:'en_GB',de:'de_DE',cs:'cs_CZ'};
  const imageAlts={en:shareImage.alt,de:'Sufoniq – internationale Personalgewinnung in Europa',cs:'Sufoniq – mezinárodní nábor v Evropě'};
  return {
    title,
    description,
    alternates: { canonical: url, ...(locales.length>1 ? {languages:{...Object.fromEntries(locales.map(locale=>[locale,new URL(localizedHref(basePath,locale),SITE_URL).href])),"x-default":new URL(basePath,SITE_URL).href}} : {}) },
    robots: { index: true, follow: true },
    openGraph: { type, locale: ogLocales[language], ...(locales.length>1 ? {alternateLocale:locales.filter(locale=>locale!==language).map(locale=>ogLocales[locale])} : {}), siteName: "Sufoniq", title, description, url, images: [{...shareImage,alt:imageAlts[language]}] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
  };
}
