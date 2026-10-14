import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/maptest", "Interactive World Map | Sufoniq", "Explore Sufoniq’s interactive world map and geographic context.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
