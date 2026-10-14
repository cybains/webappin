import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/methodology", "Data Sources & Methodology | Sufoniq", "See how Sufoniq uses economic and labour-market indicators, including sources, coverage, normalization, missing data and limits of interpretation.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
