import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/work-in-europe", "Job Seekers: Work, Visas & Relocation in Europe | Sufoniq", "Work in Europe from abroad or already in Europe: job search, visa, permit, housing and relocation support with requirements, timelines and service scope stated clearly.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
