import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/employers", "Cross-border Recruitment for Employers | Sufoniq", "Connect sourcing and screening with eligibility, documentation and mobility requirements. Explore Sufoniq’s workforce support and discuss your hiring needs.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
