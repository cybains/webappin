import Link from "next/link";
import { BetterGrowthChapters } from "@/components/BetterGrowthHomepage";

export const metadata = {
  title: "Growth dissertation | Sufoniq Insights",
  description:
    "A chaptered review of how growth works, mixing charts and takeaways. Use it for interpretation, not advice.",
};

export default function GrowthInsightsPage() {
  return (
    <div className="bg-white text-slate-900">
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
  );
}
