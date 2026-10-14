import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/about", "About Sufoniq | Recruitment & Mobility in Europe", "Meet Sufoniq, operated by UAB Skillaxis from Vienna. Learn about our approach to workforce decisions, cross-border recruitment and mobility in Europe.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
