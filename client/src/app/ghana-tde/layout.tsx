import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/ghana-tde", "Ghana–Lithuania Truck Driver Mobility | Sufoniq", "Explore Ghana–Lithuania truck driver recruitment and mobility support, including candidate requirements, documents, permits, training and arrival planning.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
