import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";
import { pageSchema, serializeSchema } from "@/lib/structured-data";

export const metadata = createPageMetadata("/method-trust", "Recruitment Method & Responsibilities | Sufoniq", "How Sufoniq scopes recruitment work, records candidate checks, handles personal information and coordinates preparation with employers and job seekers.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(pageSchema("/method-trust", "Method & Trust", "Sufoniq’s recruitment scope, screening evidence, candidate information and responsibilities.")) }} />{children}</>;
}
