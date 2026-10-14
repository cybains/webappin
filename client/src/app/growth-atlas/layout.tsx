import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/growth-atlas", "Growth Atlas | Sufoniq", "Explore economic growth and regional divergence through Sufoniq’s visual Growth Atlas, with charts, context and interpretation.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
