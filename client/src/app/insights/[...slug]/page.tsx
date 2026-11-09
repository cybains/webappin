import { createPageMetadata, SITE_URL } from "@/lib/seo";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { StructuralGridBand } from "@/components/StructuralGridBand";
import { getInsightBySlug, BodyBlock } from "@/lib/insights/content";
import { INSIGHTS } from "@/lib/insights";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugParts = slug ?? [];
  const insight = getInsightBySlug(slugParts);
  if (!insight) return {};

  return createPageMetadata(
    "/insights/" + insight.slugParts.join("/"),
    insight.title + " | Sufoniq Insights",
    insight.framing,
    "article",
  );
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
    case "table":
      return (
        <div key={index} className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm text-slate-700">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th
                    key={column}
                    className="border-b border-slate-300 bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="align-top">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border-b border-slate-200 px-3 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div key={index} className="space-y-4">
          {block.items.map((item) => (
            <div key={item.q}>
              <h3 className="font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-1 text-base leading-relaxed text-slate-700">{item.a}</p>
            </div>
          ))}
        </div>
      );
    case "link":
      return (
        <div key={index} className="pt-2">
          <Link
            href={block.href}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {block.text}
          </Link>
        </div>
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

  const canonical = new URL("/insights/" + insight.slugParts.join("/"), SITE_URL).href;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: insight.title,
    description: insight.framing,
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "Sufoniq", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Sufoniq", url: SITE_URL },
    inLanguage: "en",
    ...(insight.tags && insight.tags.length > 0 ? { keywords: insight.tags.join(", ") } : {}),
  };
  const related = INSIGHTS.filter((item) => item.slug !== insight.slug)
    .sort((a, b) => {
      const scoreA = (a.tags ?? []).filter((tag) => insight.tags?.includes(tag)).length;
      const scoreB = (b.tags ?? []).filter((tag) => insight.tags?.includes(tag)).length;
      return scoreB - scoreA;
    })
    .slice(0, 3);
  const faqItems = insight.content.flatMap((block) => (block.type === "faq" ? block.items : []));
  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

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
            {related.length > 0 && (
              <div>
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
            )}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {faqSchema && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
              />
            )}
          </div>
        </div>
      </div>
    </StructuralGridBand>
  );
}
