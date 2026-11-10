import {germanPaths,englishPath,localizedHref} from "./i18n/shared";
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
  const hasGerman=(germanPaths as readonly string[]).includes(basePath);
  const language=path === "/de" || path.startsWith("/de/") ? "de" : "en";
  return {
    title,
    description,
    alternates: { canonical: url, ...(hasGerman ? {languages:{en:new URL(basePath,SITE_URL).href,de:new URL(localizedHref(basePath,"de"),SITE_URL).href,"x-default":new URL(basePath,SITE_URL).href}} : {}) },
    robots: { index: true, follow: true },
    openGraph: { type, locale: language === "de" ? "de_DE" : "en_GB", ...(hasGerman ? {alternateLocale: [language === "de" ? "en_GB" : "de_DE"]} : {}), siteName: "Sufoniq", title, description, url, images: [{...shareImage,alt:language === "de" ? "Sufoniq – internationale Personalgewinnung in Europa" : shareImage.alt}] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
  };
}
