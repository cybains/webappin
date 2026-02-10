import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuralGridBand } from "@/components/StructuralGridBand";
import { getInsightBySlug, BodyBlock } from "@/lib/insights/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugParts = slug ?? [];
  const insight = getInsightBySlug(slugParts);
  if (!insight) return {};

  return {
    title: `${insight.title} | Sufoniq Insights`,
    description: insight.framing,
  };
}

function renderBlock(block: BodyBlock, index: number) {
  switch (block.type) {
    case "heading":
      return (
        <h2 key={index} className="text-xl font-semibold text-slate-900">
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote key={index} className="text-base italic text-slate-700">
          {block.text}
        </blockquote>
      );
    case "paragraph":
      return (
        <p key={index} className="text-base leading-relaxed text-slate-700">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="list-disc list-inside space-y-1 text-base text-slate-700">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const slugParts = slug ?? [];
  const insight = getInsightBySlug(slugParts);
  if (!insight) {
    notFound();
  }

  return (
    <StructuralGridBand className="bg-[var(--background)] text-slate-900 min-h-screen">
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="space-y-8 rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-[0_40px_80px_rgba(15,23,42,0.15)] backdrop-blur-sm">
            <div className="space-y-2">
              <Link href="/insights" className="text-sm font-medium text-primary hover:underline flex items-center gap-2">
                ← Back to Insights
              </Link>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Interpretation, not advice.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{insight.type}</p>
              <h1 className="text-3xl font-semibold md:text-4xl">{insight.title}</h1>
              <p className="text-base leading-relaxed text-slate-700">{insight.framing}</p>
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                {insight.date && <span>{insight.date}</span>}
                {insight.readTime && <span>{insight.readTime}</span>}
              </div>
            </div>
            <div className="space-y-6">
              {insight.content.map((block, index) => renderBlock(block, index))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Interpretation</p>
                <p className="mt-2 text-base leading-relaxed text-slate-700">{insight.interpretation}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Boundary</p>
                <p className="mt-2 text-base leading-relaxed text-slate-700">{insight.boundary}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">What this article is not</p>
              <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-slate-600">
                {insight.whatThisIsNot.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StructuralGridBand>
  );
}
