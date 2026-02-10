"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BalancedScatter, MobilityBarChart, ScatterRndVsGrowth } from "@/components/BetterGrowthHomepage";
import ChartCarousel from "@/components/insights/ChartCarousel";
import { GDPPerCapitaChart } from "@/components/charts/GDPPerCapitaChart";
import { InsightType, INSIGHTS } from "@/lib/insights";
import { ArrowUpRight } from "lucide-react";
import { StructuralGridBand } from "@/components/StructuralGridBand";

const typeFilters: ("All" | InsightType)[] = [
  "All",
  "Visual Dissertation",
  "Signals & Patterns",
  "Framework Note",
];

const normalizeSlug = (slug: string) => (slug.startsWith("/") ? slug : `/insights/${slug}`);

export default function InsightsLanding() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<(typeof typeFilters)[number]>("All");

  const filteredInsights = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return INSIGHTS.filter((item) => {
      const matchesType = selectedType === "All" || item.type === selectedType;
      if (!matchesType) return false;
      if (!term) return true;
      const haystack = `${item.title} ${item.framing} ${item.type}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [selectedType, searchTerm]);

  const featuredInsight = INSIGHTS.find((item) => item.featured) ?? INSIGHTS[0];
  const chartSlides = [
    <div key="gdp" className="h-full w-full p-4">
      <GDPPerCapitaChart />
    </div>,
    <div key="scatter" className="h-full w-full p-4">
      <ScatterRndVsGrowth />
    </div>,
    <div key="balanced" className="h-full w-full p-4">
      <BalancedScatter />
    </div>,
    <div key="mobility" className="h-full w-full p-4">
      <MobilityBarChart />
    </div>,
  ];

  return (
    <StructuralGridBand>
      <div className="text-[color:var(--foreground)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
          <section className="grid gap-8 lg:grid-cols-[3fr_2fr] bg-transparent">
            <div className="space-y-4 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Editorial</p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">Insights</h1>
            <p className="text-base leading-relaxed tracking-tight text-slate-700 max-w-3xl">
              Calm analysis, grounded in signals. No advice. No promises. Just a clearer map of what’s moving—and what
              isn’t.
            </p>
            <p className="text-base leading-relaxed tracking-tight text-slate-700 max-w-3xl">
              Each entry is a quiet record—no marketing gloss, no service pitch—just clear observations you can carry
              into the work you already know.
            </p>
          </div>
          <Card className="rounded-2xl border border-slate-300/80 bg-slate-50/70 shadow-sm">
            <CardHeader className="space-y-3 px-4 py-5">
              <CardTitle className="text-lg tracking-[0.3em] text-slate-500">Operating notes</CardTitle>
              <p className="text-sm leading-relaxed text-slate-700">
                Insights are interpretive. They show how we read signals — not what you should do.
              </p>
              <ul className="space-y-1.5 text-sm leading-relaxed text-foreground/60 list-disc list-inside pl-4">
                <li>Interpretation, not instructions</li>
                <li>No implied promises</li>
                <li>Boundaries included</li>
              </ul>
              <div className="pt-3 flex justify-center">
                <Link href="/method-trust" className="inline-flex">
                  <Button
                    variant="outline"
                    size="default"
                    className="rounded-full border-slate-300 bg-transparent px-10 py-3.5 text-xs tracking-[0.4em] text-foreground/80 hover:border-slate-400 hover:bg-white/70"
                  >
                    Method & Trust
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </section>

          <section className="space-y-4 bg-transparent">
          <Link
            href={normalizeSlug(featuredInsight.slug)}
            className="block group"
            aria-label={`${featuredInsight.title} – Featured visual dissertation`}
          >
            <Card className="transition-shadow border border-slate-200 hover:border-slate-400 hover:shadow-lg cursor-pointer">
              <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
                <CardHeader className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
                    Featured visual dissertation
                  </div>
                  <CardTitle className="text-3xl leading-tight text-slate-900">{featuredInsight.title}</CardTitle>
                  <p className="text-sm text-slate-600">{featuredInsight.framing}</p>
                  <div className="flex gap-6 text-xs uppercase tracking-[0.3em] text-slate-400">
                    {featuredInsight.date && <span>{featuredInsight.date}</span>}
                    {featuredInsight.readTime && <span>{featuredInsight.readTime}</span>}
                  </div>
                </CardHeader>
                <div className="space-y-6 p-6">
                  <ChartCarousel slides={chartSlides} />
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      {
                        label: "Interpretation",
                        body:
                          "Convergence is real. Regions with the steepest productivity slopes tend to retain momentum longer than rankings suggest.",
                      },
                      {
                        label: "Boundary",
                        body: "This does not imply every low per-capita economy is immediately ready to scale.",
                      },
                    ].map((tile) => (
                      <div
                        key={tile.label}
                        className="flex flex-col items-start justify-start gap-3 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-left min-w-0 max-w-[240px]"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 whitespace-nowrap">
                          {tile.label}
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/70 break-words">{tile.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </section>

          <section className="space-y-6 bg-transparent">
        <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">All insights</p>
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <label className="sr-only" htmlFor="insights-search">
                  Search insights
                </label>
                <input
                  id="insights-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search insights"
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {typeFilters.map((filter) => {
                  const isActive = selectedType === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedType(filter)}
                      className={
                        `rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.3em] transition ` +
                        (isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-400")
                      }
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Showing {filteredInsights.length} insight{filteredInsights.length === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInsights.map((item) => (
              <Link key={item.slug} href={normalizeSlug(item.slug)} className="block">
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader className="space-y-2">
                    <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
                      <span>{item.type}</span>
                    </div>
                    <CardTitle className="text-xl font-semibold leading-snug tracking-tight text-slate-900">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm leading-relaxed text-slate-600">{item.framing}</p>
                  </CardHeader>
                  <CardContent className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.date ?? "\u00A0"}</span>
                      {item.tags?.[0] ? (
                        <span className="tracking-[0.4em] uppercase text-slate-400/70">
                          {item.tags[0]}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        </div>
      </div>
    </StructuralGridBand>
  );
}
