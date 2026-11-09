import { createPageMetadata, SITE_URL } from "@/lib/seo";
﻿// This page is an editorial surface.
// It shows how data is interpreted, not what users should do.
// Service positioning must not be added here.
import InsightsLanding from "./InsightsLanding";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import { INSIGHTS } from "@/lib/insights";

export const metadata = createPageMetadata("/insights", "Work, Mobility & Economic Insights | Sufoniq", "Read Sufoniq’s analysis of economic growth, labour-market signals and mobility constraints, with clear distinctions between evidence and interpretation.");

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Sufoniq Insights",
  itemListElement: INSIGHTS.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.title,
    url: new URL("/insights/" + item.slug, SITE_URL).href,
  })),
};

export default function InsightsPage() {
  return (
    <StructuralGridBand>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <InsightsLanding />
    </StructuralGridBand>
  );
}
