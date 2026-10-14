import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/method-trust", "Method & Trust | Sufoniq", "Understand Sufoniq’s service boundaries, verification points, human review and responsibilities before planning cross-border recruitment or mobility.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
