import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/ghana-tde", "Ghana–Lithuania Truck Driver Mobility | Sufoniq", "Explore Ghana–Lithuania C/CE driver recruitment: employer-funded flights and Code 95 training, no Sufoniq fees for drivers, and clear preparation costs.");

export default function PageLayout({ children }: { children: ReactNode }) {
  return children;
}
