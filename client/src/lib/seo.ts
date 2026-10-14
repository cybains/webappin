import type { Metadata } from "next";

export const SITE_URL = "https://sufoniq.com";
const shareImage = {
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
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type, siteName: "Sufoniq", title, description, url, images: [shareImage] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
  };
}
