import { createPageMetadata } from "@/lib/seo";
﻿// This page is an editorial surface.
// It shows how data is interpreted, not what users should do.
// Service positioning must not be added here.
import InsightsLanding from "./InsightsLanding";
import { StructuralGridBand } from "@/components/StructuralGridBand";

export const metadata = createPageMetadata("/insights", "Work, Mobility & Economic Insights | Sufoniq", "Read Sufoniq’s analysis of economic growth, labour-market signals and mobility constraints, with clear distinctions between evidence and interpretation.");

export default function InsightsPage() {
  return (
    <StructuralGridBand>
      <InsightsLanding />
    </StructuralGridBand>
  );
}
