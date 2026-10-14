import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/core-services", "Recruitment & Mobility Services | Sufoniq", "Explore Sufoniq’s recruitment, job-search, immigration guidance and relocation support, with responsibilities and service scope defined for each project.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
