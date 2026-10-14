import { createPageMetadata } from "@/lib/seo";
﻿import Link from "next/link";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import { BetterGrowthChapters } from "@/components/BetterGrowthHomepage";

export const metadata = createPageMetadata("/insights/growth", "Economic Growth & Regional Divergence | Sufoniq Insights", "Explore a chaptered analysis of economic growth, momentum and regional divergence, with charts and interpretations of what national indicators can show.");

export default function GrowthInsightsPage() {
  return (
    <StructuralGridBand className="bg-[var(--background)] text-slate-900 min-h-screen">
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-4 space-y-2">
          <Link
            href="/insights"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
          >
            ← Back to Insights
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Interpretation, not advice.</p>
        </div>
        <BetterGrowthChapters />
      </div>
    </StructuralGridBand>
  );
}
