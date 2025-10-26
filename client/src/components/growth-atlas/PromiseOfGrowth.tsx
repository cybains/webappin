"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
  BandChartSvg,
  BarChartSvg,
  MultiLineChartSvg,
  type LineDatum,
  type MultiLineSeries,
} from "./ChartPrimitives";

const iso3ToName: Record<string, string> = {
  ALB: "Albania",
  AND: "Andorra",
  ARM: "Armenia",
  AUT: "Austria",
  AZE: "Azerbaijan",
  BEL: "Belgium",
  BGR: "Bulgaria",
  BIH: "Bosnia and Herzegovina",
  BLR: "Belarus",
  CHE: "Switzerland",
  CHI: "Channel Islands",
  CYP: "Cyprus",
  CZE: "Czechia",
  DEU: "Germany",
  DNK: "Denmark",
  ESP: "Spain",
  EST: "Estonia",
  FIN: "Finland",
  FRA: "France",
  FRO: "Faroe Islands",
  GBR: "United Kingdom",
  GEO: "Georgia",
  GIB: "Gibraltar",
  GRC: "Greece",
  GRL: "Greenland",
  HRV: "Croatia",
  HUN: "Hungary",
  IMN: "Isle of Man",
  IRL: "Ireland",
  ISL: "Iceland",
  ITA: "Italy",
  KAZ: "Kazakhstan",
  KGZ: "Kyrgyzstan",
  LTU: "Lithuania",
  LUX: "Luxembourg",
  LVA: "Latvia",
  LIE: "Liechtenstein",
  MCO: "Monaco",
  MDA: "Moldova",
  MKD: "North Macedonia",
  MNE: "Montenegro",
  NLD: "Netherlands",
  NOR: "Norway",
  POL: "Poland",
  PRT: "Portugal",
  ROU: "Romania",
  RUS: "Russia",
  SMR: "San Marino",
  SRB: "Serbia",
  SVK: "Slovakia",
  SVN: "Slovenia",
  SWE: "Sweden",
  TJK: "Tajikistan",
  TKM: "Turkmenistan",
  TUR: "Turkey",
  UKR: "Ukraine",
  UZB: "Uzbekistan",
  XKX: "Kosovo",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const palette = [
  "#0ea5e9",
  "#f97316",
  "#22c55e",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#9333ea",
  "#facc15",
  "#06b6d4",
  "#ef4444",
];

const panelMeta: Record<string, { label: string; description: string }> = {
  default: {
    label: "Chapter 1 flow",
    description: "Navigate the skyline, slope, gap, and custom comparison panels powered by the live dataset.",
  },
  loading: {
    label: "Loading data",
    description: "Fetching GDP per capita narratives and opportunity scores for Chapter 1.",
  },
  error: {
    label: "Unable to load",
    description: "Check the data pack paths or refresh to try again.",
  },
  empty: {
    label: "No countries loaded",
    description: "Add GDP per capita narratives to the data pack to unlock the visuals.",
  },
  skyline: {
    label: "Skyline",
    description: "Rich-to-poor snapshot of GDP per capita across the roster.",
  },
  slope: {
    label: "Slope",
    description: "Rotating cohorts climb the growth slope every 10 seconds.",
  },
  gap: {
    label: "Convergence band",
    description: "Watch the rich-to-poor gap compress as averages converge.",
  },
  "your-view": {
    label: "Your comparison",
    description: "Build a custom set of economies and toggle indexed momentum.",
  },
};

type OpportunityEntry = {
  country: string;
  score?: number;
  g?: number;
  i?: number;
  u?: number;
  g_years?: string;
};

type ManifestCountry = {
  iso3: string;
  name?: string;
  files?: {
    narrative?: string;
  };
};

type Manifest = {
  countries?: ManifestCountry[];
};

type NarrativeFact = {
  code?: string;
  year?: number;
  value?: number;
};

type NarrativeFile = {
  iso3?: string;
  country_name?: string;
  facts_used?: NarrativeFact[];
};

type YearRange = {
  start: number;
  end: number;
};

type ChapterCountry = {
  iso3: string;
  name: string;
  gdpPerCapita: number;
  growthRate: number | null;
  growthRange: YearRange;
  unemploymentRate: number | null;
  exportsShare: number | null;
  series: LineDatum[];
};

function parseYearRange(range?: string): YearRange {
  if (!range) {
    return { start: 2015, end: 2024 };
  }

  const matches = range.match(/\d{4}/g);
  if (!matches || matches.length < 2) {
    return { start: 2015, end: 2024 };
  }

  const [rawStart, rawEnd] = matches.map((value) => Number.parseInt(value, 10));
  const start = Number.isFinite(rawStart) ? rawStart : 2015;
  const end = Number.isFinite(rawEnd) ? rawEnd : Math.max(start, 2024);

  if (start > end) {
    return { start: end, end: start };
  }

  return { start, end };
}

function buildGrowthSeries(latestValue: number, growthRate: number | null, range: YearRange): LineDatum[] {
  if (!Number.isFinite(latestValue) || range.start > range.end) {
    return [];
  }

  const years: LineDatum[] = [];
  const steps = range.end - range.start;
  const rate = typeof growthRate === "number" && Number.isFinite(growthRate) ? growthRate / 100 : 0;
  const factor = 1 + rate;

  if (factor <= 0 || !Number.isFinite(factor)) {
    for (let year = range.start; year <= range.end; year += 1) {
      years.push({ x: year, y: latestValue });
    }
    return years;
  }

  const baseValue = steps > 0 ? latestValue / Math.pow(factor, steps) : latestValue;
  let value = baseValue;

  for (let year = range.start; year <= range.end; year += 1) {
    years.push({ x: year, y: value });
    value *= factor;
  }

  return years;
}

function formatUsdCompact(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`;
  }
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function averageSeries(countries: ChapterCountry[]): LineDatum[] {
  if (!countries.length) return [];
  const yearSets = countries.map((country) => country.series.map((point) => point.x));
  const sharedYears = yearSets.reduce<number[]>((acc, years) => {
    if (acc.length === 0) return years;
    return acc.filter((year) => years.includes(year));
  }, []);

  return sharedYears.map((year) => {
    const values = countries.map((country) => country.series.find((point) => point.x === year)?.y ?? 0);
    const average = values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
    return { x: year, y: average };
  });
}

const rotationIntervalMs = 10_000;
const maxSelections = 5;

const PromiseOfGrowth: React.FC = () => {
  const [countries, setCountries] = useState<ChapterCountry[]>([]);
  const [rosterNames, setRosterNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [activePanel, setActivePanel] = useState(0);
  const [cohortIndex, setCohortIndex] = useState(0);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [pendingCountry, setPendingCountry] = useState<string>("");
  const [mode, setMode] = useState<"level" | "indexed">("level");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [opportunityRes, manifestRes] = await Promise.all([
          fetch("/data/v1/ch1_opportunity.json"),
          fetch("/data/v1/index.json"),
        ]);

        if (!opportunityRes.ok) {
          throw new Error("Unable to load Chapter 1 opportunity data");
        }

        if (!manifestRes.ok) {
          throw new Error("Unable to load Chapter 1 manifest");
        }

        const opportunityData = (await opportunityRes.json()) as OpportunityEntry[];
        const manifest = (await manifestRes.json()) as Manifest;
        const manifestMap = new Map(
          (manifest.countries ?? []).map((entry) => [entry.iso3, entry])
        );

        const roster = opportunityData
          .map((entry) => {
            const iso3 = entry.country;
            const manifestEntry = manifestMap.get(iso3);
            const candidateName =
              manifestEntry?.name && manifestEntry.name.trim().length
                ? manifestEntry.name
                : iso3ToName[iso3] ?? iso3;
            return { iso3, name: candidateName };
          })
          .filter(
            (item, index, array) =>
              array.findIndex((other) => other.iso3 === item.iso3) === index
          )
          .sort((a, b) => a.name.localeCompare(b.name));

        if (!cancelled) {
          setRosterNames(roster.map((item) => item.name));
        }

        const prepared = await Promise.all(
          opportunityData.map(async (entry) => {
            const iso3 = entry.country;
            const manifestEntry = manifestMap.get(iso3);
            const narrativePath =
              manifestEntry?.files?.narrative ?? `/data/v1/countries/${iso3}_narrative.json`;
            const fallbackName =
              manifestEntry?.name && manifestEntry.name.trim().length
                ? manifestEntry.name
                : iso3ToName[iso3] ?? iso3;

            try {
              const narrativeRes = await fetch(narrativePath);
              if (!narrativeRes.ok) {
                throw new Error(`Missing narrative for ${iso3}`);
              }
              const narrative = (await narrativeRes.json()) as NarrativeFile;
              const gdpFact = narrative.facts_used?.find(
                (fact) => fact.code === "NY.GDP.PCAP.KD" && typeof fact.value === "number"
              );

              if (!gdpFact) {
                throw new Error(`Missing GDP per capita fact for ${iso3}`);
              }

              const name = narrative.country_name?.trim().length
                ? narrative.country_name
                : fallbackName;
              const growthRate =
                typeof entry.g === "number" && Number.isFinite(entry.g) ? entry.g : null;
              const growthRange = parseYearRange(entry.g_years);
              const series = buildGrowthSeries(gdpFact.value ?? 0, growthRate, growthRange);

              return {
                iso3,
                name,
                gdpPerCapita: gdpFact.value ?? 0,
                growthRate,
                growthRange,
                unemploymentRate: typeof entry.u === "number" ? entry.u : null,
                exportsShare: typeof entry.i === "number" ? entry.i : null,
                series,
              } as ChapterCountry;
            } catch (narrativeError) {
              console.warn(narrativeError);
              return null;
            }
          })
        );

        if (cancelled) {
          return;
        }

        const validCountries = prepared.filter(Boolean) as ChapterCountry[];
        const uniqueCountries = validCountries.filter(
          (country, index, array) =>
            array.findIndex((other) => other.iso3 === country.iso3) === index
        );

        setCountries(uniqueCountries);
        setSelectedCountries((previous) =>
          previous.length ? previous : uniqueCountries.slice(0, 4).map((country) => country.iso3)
        );
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load Chapter 1 data pack"
          );
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const countriesMap = useMemo(() => {
    return new Map(countries.map((country) => [country.iso3, country]));
  }, [countries]);

  const sortedByGdp = useMemo(() => {
    return [...countries].sort((a, b) => b.gdpPerCapita - a.gdpPerCapita);
  }, [countries]);

  const skylineData = useMemo(
    () => sortedByGdp.map((country) => ({ label: country.iso3, value: country.gdpPerCapita })),
    [sortedByGdp]
  );

  const richestCountry = sortedByGdp[0] ?? null;
  const poorestCountry = sortedByGdp[sortedByGdp.length - 1] ?? null;
  const skylineGap = richestCountry && poorestCountry
    ? richestCountry.gdpPerCapita - poorestCountry.gdpPerCapita
    : 0;
  const skylineRatio = richestCountry && poorestCountry && poorestCountry.gdpPerCapita
    ? richestCountry.gdpPerCapita / poorestCountry.gdpPerCapita
    : 0;

  const slopeEligible = useMemo(
    () => sortedByGdp.filter((country) => country.series.length > 0),
    [sortedByGdp]
  );

  const colorMap = useMemo(() => {
    const mapping: Record<string, string> = {};
    slopeEligible.forEach((country, index) => {
      mapping[country.iso3] = palette[index % palette.length];
    });
    return mapping;
  }, [slopeEligible]);

  const slopeCohorts = useMemo(() => {
    if (!slopeEligible.length) return [] as string[][];
    if (slopeEligible.length <= 4) {
      return [slopeEligible.map((country) => country.iso3)];
    }

    const top = slopeEligible.slice(0, Math.min(4, slopeEligible.length));
    const middleStart = Math.max(4, Math.floor(slopeEligible.length / 2) - 2);
    const middle = slopeEligible.slice(middleStart, middleStart + 4);
    const bottom = slopeEligible.slice(-4);

    return [top, middle, bottom]
      .map((group) => {
        const isoGroup = group.map((country) => country.iso3);
        return isoGroup.filter((iso, index) => isoGroup.indexOf(iso) === index);
      })
      .filter((group) => group.length > 0);
  }, [slopeEligible]);

  const activeCohortIso = useMemo(() => {
    if (!slopeCohorts.length) return [] as string[];
    return slopeCohorts[cohortIndex % slopeCohorts.length];
  }, [slopeCohorts, cohortIndex]);

  const activeSeries = useMemo(() => {
    return activeCohortIso
      .map((iso3) => {
        const country = countriesMap.get(iso3);
        if (!country) return null;
        return {
          id: country.name,
          color: colorMap[iso3],
          data: country.series,
        };
      })
      .filter(Boolean) as MultiLineSeries[];
  }, [activeCohortIso, countriesMap, colorMap]);

  useEffect(() => {
    if (slopeCohorts.length < 2) return;
    const id = window.setInterval(() => {
      setCohortIndex((previous) => (previous + 1) % slopeCohorts.length);
    }, rotationIntervalMs);
    return () => window.clearInterval(id);
  }, [slopeCohorts.length]);

  const transformSeries = useMemo(() => {
    const indexer = (series: LineDatum[]) => {
      if (!series.length) return [] as LineDatum[];
      const base = series[0].y || 1;
      return series.map((point) => ({ x: point.x, y: Number(((point.y / base) * 100).toFixed(1)) }));
    };
    return { indexer };
  }, []);

  const yourViewSeries = useMemo(() => {
    return selectedCountries
      .map((iso3) => {
        const country = countriesMap.get(iso3);
        if (!country) return null;
        const data = mode === "indexed" ? transformSeries.indexer(country.series) : country.series;
        return { id: country.name, color: colorMap[iso3], data };
      })
      .filter(Boolean) as MultiLineSeries[];
  }, [selectedCountries, mode, transformSeries, colorMap, countriesMap]);

  const formatterForMode = useMemo(() => {
    if (mode === "indexed") {
      return (value: number) => `${Math.round(value)} (base = 100)`;
    }
    return (value: number) => formatUsdCompact(value);
  }, [mode]);

  const bandRichGroup = useMemo(
    () => slopeEligible.slice(0, Math.min(3, slopeEligible.length)),
    [slopeEligible]
  );
  const bandPoorGroup = useMemo(
    () => slopeEligible.slice(-Math.min(3, slopeEligible.length)),
    [slopeEligible]
  );

  const bandSeries = useMemo(() => {
    return {
      upper: averageSeries(bandRichGroup),
      lower: averageSeries(bandPoorGroup),
    };
  }, [bandRichGroup, bandPoorGroup]);

  const ratioSeries = useMemo(() => {
    const upperMap = new Map(bandSeries.upper.map((point) => [point.x, point.y]));
    const lowerMap = new Map(bandSeries.lower.map((point) => [point.x, point.y]));
    const sharedYears = Array.from(upperMap.keys())
      .filter((year) => lowerMap.has(year))
      .sort((a, b) => a - b);
    return sharedYears.map((year) => {
      const upper = upperMap.get(year) ?? 0;
      const lower = lowerMap.get(year) ?? 0;
      return { x: year, y: lower ? upper / lower : 0 };
    });
  }, [bandSeries]);

  const firstRatio = ratioSeries[0]?.y ?? 0;
  const latestRatio = ratioSeries[ratioSeries.length - 1]?.y ?? 0;
  const richCohortNames = bandRichGroup.map((country) => country.name);
  const poorCohortNames = bandPoorGroup.map((country) => country.name);

  const availableCountryOptions = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    [countries]
  );
  const availableComparisonCount = availableCountryOptions.length;

  const earliestYear = useMemo(() => {
    const years = slopeEligible.flatMap((country) => country.series.map((point) => point.x));
    return years.length ? Math.min(...years) : null;
  }, [slopeEligible]);

  const handleAddCountry = (event: React.FormEvent) => {
    event.preventDefault();
    if (!pendingCountry) return;
    if (!countriesMap.has(pendingCountry)) return;
    setSelectedCountries((previous) => {
      if (previous.includes(pendingCountry) || previous.length >= maxSelections) {
        return previous;
      }
      return [...previous, pendingCountry];
    });
    setPendingCountry("");
  };

  const handleRemoveCountry = (iso3: string) => {
    setSelectedCountries((previous) => previous.filter((country) => country !== iso3));
  };

  const panelWrapperClasses =
    "snap-center snap-always w-full shrink-0 basis-full md:basis-[85vw] lg:basis-[960px] flex";
  const panelBaseClasses =
    "h-full w-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70";

  let panels: Array<{ id: string; content: React.ReactNode }> = [];

  if (loading) {
    panels = [
      {
        id: "loading",
        content: (
          <article className={panelBaseClasses}>
            <p className="text-sm text-slate-600 dark:text-slate-300">Loading Chapter 1 visuals…</p>
          </article>
        ),
      },
    ];
  } else if (error) {
    panels = [
      {
        id: "error",
        content: (
          <article className={panelBaseClasses}>
            <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
          </article>
        ),
      },
    ];
  } else if (!countries.length || !richestCountry || !poorestCountry) {
    panels = [
      {
        id: "empty",
        content: (
          <article className={panelBaseClasses}>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              We couldn’t find enough countries with GDP per capita data yet. Please check back once the data pack refreshes.
            </p>
          </article>
        ),
      },
    ];
  } else {
    panels = [
      {
        id: "skyline",
        content: (
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className={panelBaseClasses}
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Skyline</span>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Levels snapshot</h3>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Start with the skyline: GDP per capita ordered richest to poorest. It makes the gulf impossible to ignore—and sets the stage for why trajectories matter more than a static photo.
            </p>
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="relative">
                <BarChartSvg
                  data={skylineData}
                  width={760}
                  yLabel="GDP per capita (constant USD, latest)"
                  accent="#0ea5e9"
                  valueFormatter={formatUsdCompact}
                />
                <div className="absolute right-6 top-6 rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm dark:border-sky-500/40 dark:bg-slate-900/90 dark:text-sky-200">
                  Richest vs poorest gap: {formatUsdCompact(skylineGap)} ({skylineRatio.toFixed(1)}×)
                </div>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <strong>{richestCountry.name}</strong> tops the skyline at <strong>{formatUsdCompact(richestCountry.gdpPerCapita)}</strong>, while <strong>{poorestCountry.name}</strong> closes the ladder at <strong>{formatUsdCompact(poorestCountry.gdpPerCapita)}</strong>.
                </p>
                <p>
                  That spread—{formatUsdCompact(skylineGap)}—is the static gap. The next panels show why momentum and convergence make the story more interesting than a single year.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                    <span>Sorted by the latest constant-USD value pulled straight from the narratives.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                    <span>Labels lean on ISO3 codes so 40+ economies stay legible even on smaller screens.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                    <span>Gap annotation keeps the headline number anchored to the data.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.article>
        ),
      },
      {
        id: "slope",
        content: (
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className={panelBaseClasses}
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Slope</span>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Rotating cohorts</h3>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Every ten seconds a new cohort rotates in. The legend highlights the active set so you can see how steep the catch-up is versus the incumbents.
            </p>
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div>
                <MultiLineChartSvg
                  series={activeSeries}
                  xLabel="Year"
                  yLabel="GDP per capita (constant USD)"
                  formatter={formatUsdCompact}
                />
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700">Active cohort</span>
                  <span className="text-base font-medium text-slate-900 dark:text-white">
                    {activeCohortIso.map((iso3) => countriesMap.get(iso3)?.name ?? iso3).join(" • ")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {activeSeries.map((series) => (
                    <span
                      key={series.id}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-100"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: series.color }}
                        aria-hidden="true"
                      />
                      {series.id}
                    </span>
                  ))}
                </div>
                <p>
                  Rich incumbents crawl higher while newer members climb faster—illustrating why momentum matters more than the skyline snapshot.
                </p>
                <button
                  type="button"
                  onClick={() => setCohortIndex((prev) => (prev + 1) % Math.max(1, slopeCohorts.length))}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500"
                >
                  Next countries →
                </button>
              </div>
            </div>
          </motion.article>
        ),
      },
      {
        id: "gap",
        content: (
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className={panelBaseClasses}
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Gap</span>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Convergence band</h3>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Averaging the richest and poorest cohorts shades the convergence band. As poorer economies grow faster, the ratio compresses.
            </p>
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div>
                <BandChartSvg
                  upper={bandSeries.upper}
                  lower={bandSeries.lower}
                  xLabel="Year"
                  yLabel="Average GDP per capita (constant USD)"
                  formatter={formatUsdCompact}
                  fill="rgba(14, 165, 233, 0.18)"
                  strokeUpper="#0ea5e9"
                  strokeLower="#22c55e"
                />
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Rich cohort ({richCohortNames.join(", ")}) vs. poorer cohort ({poorCohortNames.join(", ")}). Ratio shrinks from <strong>{firstRatio.toFixed(1)}×</strong> at the start of the window to <strong>{latestRatio.toFixed(1)}×</strong> today.
                </p>
                <p>
                  The shaded band makes the compression visible; future annotations can call out milestones like EU accession or post-crisis recovery.
                </p>
                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                    <span>Band width = rich average − poor average.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                    <span>Ratio label updates automatically as cohorts converge.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                    <span>Next step: hover states to reveal each cohort member’s contribution.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.article>
        ),
      },
      {
        id: "your-view",
        content: (
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className={panelBaseClasses}
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Your view</span>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Build your own comparison</h3>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Let readers add up to five economies, toggle levels versus indexed momentum, and remove chips. The scaffolding now pulls directly from the Chapter 1 data pack.
            </p>
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div>
                <MultiLineChartSvg
                  series={yourViewSeries}
                  xLabel="Year"
                  yLabel={mode === "indexed" ? "Index (base year = 100)" : "GDP per capita (constant USD)"}
                  formatter={formatterForMode}
                />
              </div>
              <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
                <form onSubmit={handleAddCountry} className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                  <div>
                    <label htmlFor="country-picker" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Add a country
                    </label>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Plot {availableComparisonCount} economies pulled directly from the live data pack.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <select
                        id="country-picker"
                        value={pendingCountry}
                        onChange={(event) => setPendingCountry(event.target.value)}
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="">Select a country…</option>
                        {availableCountryOptions.map((country) => (
                          <option
                            key={country.iso3}
                            value={country.iso3}
                            disabled={selectedCountries.includes(country.iso3)}
                          >
                            {country.name} ({country.iso3})
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Mode</span>
                    <div className="mt-2 flex gap-3">
                      {[
                        { label: "USD levels", value: "level" as const },
                        { label: "Indexed (base = 100)", value: "indexed" as const },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-600 dark:text-slate-100"
                        >
                          <input
                            type="radio"
                            name="mode"
                            value={option.value}
                            checked={mode === option.value}
                            onChange={(event) => setMode(event.target.value as "level" | "indexed")}
                            className="h-3.5 w-3.5 border-slate-400 text-sky-500 focus:ring-sky-500"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </form>
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Selected countries</div>
                  <div className="flex flex-wrap gap-3">
                    {selectedCountries.map((iso3) => {
                      const country = countriesMap.get(iso3);
                      if (!country) return null;
                      return (
                        <span
                          key={iso3}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-100"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: colorMap[iso3] }}
                            aria-hidden="true"
                          />
                          {country.name} ({country.iso3})
                          <button
                            type="button"
                            onClick={() => handleRemoveCountry(iso3)}
                            className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    {selectedCountries.length === 0 ? (
                      <span className="text-xs text-slate-400">Pick a country to populate the chart.</span>
                    ) : null}
                  </div>
                </div>
                <p>
                  Indexed mode normalises each series to 100 in {earliestYear ?? "the first shared year"}, making momentum comparisons easier even when levels differ.
                </p>
              </div>
            </div>
          </motion.article>
        ),
      },
    ];
  }

  const panelCount = panels.length;
  const activePanelId = panels[activePanel]?.id ?? "";
  const activePanelMeta = panelMeta[activePanelId] ?? panelMeta.default;
  const panelPositionLabel =
    panelCount > 0
      ? `${String(Math.min(activePanel + 1, panelCount)).padStart(2, "0")} / ${String(panelCount).padStart(2, "0")}`
      : "00 / 00";

  const goToPanel = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = sliderRef.current;
      if (!container || !panelCount) return;

      const clamped = Math.max(0, Math.min(index, panelCount - 1));
      const node = panelRefs.current[clamped];
      if (!node) {
        setActivePanel(clamped);
        return;
      }

      const offset =
        node.offsetLeft -
        container.offsetLeft -
        (container.clientWidth - node.clientWidth) / 2;
      const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
      const target = Math.max(0, Math.min(offset, maxScroll));

      container.scrollTo({ left: target, behavior });
      setActivePanel(clamped);
    },
    [panelCount]
  );

  const handleStep = (direction: "prev" | "next") => {
    const target = direction === "next" ? activePanel + 1 : activePanel - 1;
    if (target < 0 || target >= panelCount) return;
    goToPanel(target);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = sliderRef.current;
    if (!container) return;

    const target = event.target as HTMLElement;
    if (target && target.closest("button, a, input, select, textarea")) {
      return;
    }

    dragState.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: container.scrollLeft,
    };

    container.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = sliderRef.current;
    if (!container || !dragState.current.active) return;

    event.preventDefault();
    const deltaX = event.clientX - dragState.current.startX;
    container.scrollLeft = dragState.current.scrollLeft - deltaX;
  };

  const endPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = sliderRef.current;
    if (!container || !dragState.current.active) return;

    dragState.current = { ...dragState.current, active: false };
    container.releasePointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = panelRefs.current.findIndex((panel) => panel === entry.target);
            if (index !== -1) {
              setActivePanel(index);
            }
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    panelRefs.current.slice(0, panelCount).forEach((panel) => {
      if (panel) observer.observe(panel);
    });

    return () => observer.disconnect();
  }, [panelCount]);

  useEffect(() => {
    if (panelCount) {
      goToPanel(0, "auto");
    }
  }, [goToPanel, panelCount]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-200">
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Promise of Growth
          </span>
          <span className="text-slate-500 dark:text-slate-400">{activePanelMeta.label}</span>
          <span className="sr-only">{activePanelMeta.description}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleStep("prev")}
            aria-label="Go to previous panel"
            disabled={activePanel === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-sm text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
          >
            <span aria-hidden="true">←</span>
          </button>
          <div className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:border-slate-600 dark:text-slate-300">
            {panelPositionLabel}
          </div>
          <button
            type="button"
            onClick={() => handleStep("next")}
            aria-label="Go to next panel"
            disabled={activePanel === panelCount - 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-sm text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="hide-scrollbar flex cursor-grab gap-6 overflow-x-auto scroll-smooth pb-6 snap-x snap-mandatory active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerLeave={endPointerDrag}
        onPointerCancel={endPointerDrag}
      >
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            ref={(node) => {
              panelRefs.current[index] = node;
            }}
            className={panelWrapperClasses}
            dir="ltr"
          >
            {panel.content}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: panelCount }).map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => goToPanel(index)}
            aria-label={`Go to panel ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              index === activePanel ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>

      {rosterNames.length ? (
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Countries in the data pack</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Chapter 1 currently covers <strong>{rosterNames.length}</strong> economies. Explore the full roster below.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
            {rosterNames.map((name) => (
              <li
                key={name}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm dark:border-slate-600 dark:bg-slate-800"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default PromiseOfGrowth;
