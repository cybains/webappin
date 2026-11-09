import { createPageMetadata, SITE_URL } from "@/lib/seo";
import Link from "next/link";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import { BetterGrowthChapters } from "@/components/BetterGrowthHomepage";
import { INSIGHTS } from "@/lib/insights";

const growth = INSIGHTS.find((item) => item.slug === "growth");
const related = INSIGHTS.filter((item) => item.slug !== "growth").slice(0, 3);
const growthSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: growth?.title ?? "Growth is uneven. Your strategy shouldn't be.",
  description: growth?.framing,
  mainEntityOfPage: new URL("/insights/growth", SITE_URL).href,
  author: { "@type": "Organization", name: "Sufoniq", url: SITE_URL },
  publisher: { "@type": "Organization", name: "Sufoniq", url: SITE_URL },
  inLanguage: "en",
  ...(growth?.tags && growth.tags.length > 0 ? { keywords: growth.tags.join(", ") } : {}),
};

export const metadata = createPageMetadata(
  "/insights/growth",
  (growth?.title ?? "Growth is uneven. Your strategy shouldn't be.") + " | Sufoniq Insights",
  growth?.framing ?? "A six-chapter visual dissertation on GDP growth across Europe.",
);

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
        <div className="max-w-6xl mx-auto px-6 pt-4 space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            {growth?.type ?? "Visual Dissertation"}
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            {growth?.title ?? "Growth is uneven. Your strategy shouldn't be."}
          </h1>
          {growth?.framing && (
            <p className="text-base leading-relaxed text-slate-700">{growth.framing}</p>
          )}
        </div>
        <BetterGrowthChapters />
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-base leading-relaxed text-slate-700">
              Charts show where growth is. Hiring decides what happens next — put your role,
              destination and requirements into the intake form.
            </p>
            <Link
              href="/work-in-europe"
              className="mt-4 inline-block font-medium text-primary hover:underline"
            >
              Tell us the role →
            </Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-xl font-semibold text-slate-900">Related insights</h2>
          <ul className="mt-3 space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  prefetch={false}
                  href={`/insights/${item.slug}`}
                  className="font-medium text-primary hover:underline"
                >
                  {item.title} →
                </Link>
                <span className="ml-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                  {item.type}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(growthSchema) }}
        />
      </div>
    </StructuralGridBand>
  );
}
