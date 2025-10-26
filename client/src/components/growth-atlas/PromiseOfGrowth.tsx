"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
  BandChartSvg,
  BarChartSvg,
  MultiLineChartSvg,
  type LineDatum,
  type MultiLineSeries,
} from "./ChartPrimitives";
import ch1Opportunity from "../../../public/data/v1/ch1_opportunity.json";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const palette = ["#0ea5e9", "#f97316", "#22c55e", "#6366f1", "#ec4899", "#14b8a6", "#9333ea", "#facc15", "#06b6d4", "#ef4444"];

const slopeYears = [2000, 2005, 2010, 2015, 2020, 2023];

const slopeSeriesRaw = [
  {
    id: "Luxembourg",
    data: slopeYears.map((year, index) => ({ x: year, y: [73_000, 84_000, 98_000, 110_000, 118_000, 134_000][index] })),
  },
  {
    id: "Ireland",
    data: slopeYears.map((year, index) => ({ x: year, y: [38_000, 47_000, 54_000, 64_000, 81_000, 103_000][index] })),
  },
  {
    id: "Netherlands",
    data: slopeYears.map((year, index) => ({ x: year, y: [34_000, 39_000, 44_000, 50_000, 56_000, 57_500][index] })),
  },
  {
    id: "Germany",
    data: slopeYears.map((year, index) => ({ x: year, y: [32_000, 36_000, 41_000, 46_000, 52_000, 52_000][index] })),
  },
  {
    id: "Spain",
    data: slopeYears.map((year, index) => ({ x: year, y: [25_000, 29_000, 33_000, 36_000, 38_000, 40_000][index] })),
  },
  {
    id: "Poland",
    data: slopeYears.map((year, index) => ({ x: year, y: [11_000, 15_000, 21_000, 28_000, 34_000, 35_700][index] })),
  },
  {
    id: "Romania",
    data: slopeYears.map((year, index) => ({ x: year, y: [7_000, 10_000, 16_000, 22_000, 29_000, 32_900][index] })),
  },
  {
    id: "Bulgaria",
    data: slopeYears.map((year, index) => ({ x: year, y: [6_000, 9_000, 14_000, 19_000, 25_000, 27_500][index] })),
  },
  {
    id: "Portugal",
    data: slopeYears.map((year, index) => ({ x: year, y: [19_000, 22_000, 26_000, 29_000, 33_000, 35_000][index] })),
  },
  {
    id: "Czechia",
    data: slopeYears.map((year, index) => ({ x: year, y: [16_000, 21_000, 28_000, 35_000, 42_000, 45_000][index] })),
  },
  {
    id: "Estonia",
    data: slopeYears.map((year, index) => ({ x: year, y: [12_000, 18_000, 24_000, 32_000, 38_000, 41_000][index] })),
  },
  {
    id: "Greece",
    data: slopeYears.map((year, index) => ({ x: year, y: [19_000, 22_000, 26_000, 28_000, 30_000, 32_000][index] })),
  },
];

const slopeCohorts = [
  ["Luxembourg", "Ireland", "Netherlands", "Germany"],
  ["Spain", "Portugal", "Greece", "Czechia"],
  ["Poland", "Romania", "Bulgaria", "Estonia"],
];

const skylineData = [
  { label: "Lux", value: 134_000 },
  { label: "Irl", value: 103_000 },
  { label: "Nld", value: 57_500 },
  { label: "Deu", value: 52_000 },
  { label: "Esp", value: 40_000 },
  { label: "Pol", value: 35_700 },
  { label: "Rou", value: 32_900 },
  { label: "Bgr", value: 27_500 },
];

const skylineFormatter = (value: number) => `€${Math.round(value / 1000)}k`;

function computeBandSeries() {
  const rich = ["Luxembourg", "Ireland", "Germany"];
  const poor = ["Poland", "Romania", "Bulgaria"];

  const upper: LineDatum[] = slopeYears.map((year, index) => {
    const values = rich.map((country) => slopeSeriesRaw.find((entry) => entry.id === country)?.data[index]?.y ?? 0);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    return { x: year, y: average };
  });

  const lower: LineDatum[] = slopeYears.map((year, index) => {
    const values = poor.map((country) => slopeSeriesRaw.find((entry) => entry.id === country)?.data[index]?.y ?? 0);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    return { x: year, y: average };
  });

  return { upper, lower };
}

const bandSeries = computeBandSeries();
const ratioSeries = bandSeries.upper.map((point, index) => {
  const lowerValue = bandSeries.lower[index]?.y ?? 1;
  return { x: point.x, y: point.y / lowerValue };
});

const availableCountries = slopeSeriesRaw.map((entry) => entry.id).sort();

const initialSelection = ["Luxembourg", "Germany", "Poland", "Romania"];

const maxSelections = 5;

const rotationIntervalMs = 10_000;

const useCohortRotation = (activeIndex: number, setActiveIndex: React.Dispatch<React.SetStateAction<number>>) => {
  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slopeCohorts.length);
    }, rotationIntervalMs);
    return () => window.clearInterval(id);
  }, [setActiveIndex]);

  return slopeCohorts[activeIndex % slopeCohorts.length];
};

type OpportunityCountry = {
  iso3: string;
};

const opportunityCountries = (ch1Opportunity as OpportunityCountry[]) ?? [];
const opportunityCountryCount = opportunityCountries.length;

const PromiseOfGrowth: React.FC = () => {
  const richest = skylineData[0];
  const poorest = skylineData[skylineData.length - 1];
  const skylineGap = richest.value - poorest.value;
  const skylineRatio = richest.value / (poorest.value || 1);

  const [cohortIndex, setCohortIndex] = useState(0);
  const activeCohort = useCohortRotation(cohortIndex, setCohortIndex);

  const sliderRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activePanel, setActivePanel] = useState(0);

  const colorMap = useMemo(() => {
    const mapping: Record<string, string> = {};
    slopeSeriesRaw.forEach((series, index) => {
      mapping[series.id] = palette[index % palette.length];
    });
    return mapping;
  }, []);

  const activeSeries = useMemo(() => {
    return slopeSeriesRaw
      .filter((series) => activeCohort.includes(series.id))
      .map((series) => ({ id: series.id, color: colorMap[series.id], data: series.data }));
  }, [activeCohort, colorMap]);

  const [selectedCountries, setSelectedCountries] = useState<string[]>(initialSelection);
  const [pendingCountry, setPendingCountry] = useState<string>("");
  const [mode, setMode] = useState<"level" | "indexed">("level");

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
      .map((country) => {
        const source = slopeSeriesRaw.find((entry) => entry.id === country);
        if (!source) return null;
        const data = mode === "indexed" ? transformSeries.indexer(source.data) : source.data;
        return { id: country, color: colorMap[country], data };
      })
      .filter(Boolean) as MultiLineSeries[];
  }, [selectedCountries, mode, transformSeries, colorMap]);

  const formatterForMode = useMemo(() => {
    if (mode === "indexed") {
      return (value: number) => `${Math.round(value)} (2000 = 100)`;
    }
    return (value: number) => `€${Math.round(value / 1000)}k`;
  }, [mode]);

  const firstRatio = ratioSeries[0]?.y ?? 0;
  const latestRatio = ratioSeries[ratioSeries.length - 1]?.y ?? 0;

  const handleAddCountry = (event: React.FormEvent) => {
    event.preventDefault();
    if (!pendingCountry) return;
    setSelectedCountries((prev) => {
      if (prev.includes(pendingCountry) || prev.length >= maxSelections) return prev;
      return [...prev, pendingCountry];
    });
  };

  const handleRemoveCountry = (country: string) => {
    setSelectedCountries((prev) => prev.filter((item) => item !== country));
  };

  const panelBaseClasses =
    "w-full shrink-0 basis-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm md:basis-[85vw] lg:basis-[960px] dark:border-slate-800 dark:bg-slate-900/70";

  const panels = [
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
            Start with the classic skyline: GDP per capita ordered richest to poorest. It makes the gulf impossible to ignore—
            and sets the stage for why momentum matters more than this static picture.
          </p>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="relative">
              <BarChartSvg data={skylineData} yLabel="GDP per capita (EUR, 2023)" accent="#0ea5e9" valueFormatter={skylineFormatter} />
              <div className="absolute right-6 top-6 rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
                Richest vs poorest gap: {skylineFormatter(skylineGap)} ({skylineRatio.toFixed(1)}×)
              </div>
            </div>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>
                {richest.label} tops the skyline at <strong>{skylineFormatter(richest.value)}</strong>, while {poorest.label} closes the ladder at<strong> {skylineFormatter(poorest.value)}</strong>.
              </p>
              <p>
                The spread—{skylineFormatter(skylineGap)}—is the static gap Susskind critiques. The next visuals show why trajectories matter more than the snapshot.
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                  <span>Sorted by latest GDP per capita in purchasing-power terms.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                  <span>Labels condensed for quick scanning on mobile.</span>
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
            Every ten seconds we rotate four economies into view so readers can compare trajectories. The legend shows the active cohort; tap the button to fast-forward.
          </p>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div>
              <MultiLineChartSvg
                series={activeSeries}
                xLabel="Year"
                yLabel="GDP per capita (EUR, PPP)"
                formatter={(value) => `€${Math.round(value / 1000)}k`}
              />
            </div>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700">
                  Active cohort
                </span>
                <span className="text-base font-medium text-slate-900 dark:text-white">{activeCohort.join(" • ")}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {activeSeries.map((series) => (
                  <span
                    key={series.id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-100"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: series.color }} aria-hidden="true" />
                    {series.id}
                  </span>
                ))}
              </div>
              <p>
                Rich-country lines stay high but flatter; the catch-up economies show steeper slopes as human capital and market access compound.
              </p>
              <button
                type="button"
                onClick={() => setCohortIndex((prev) => (prev + 1) % slopeCohorts.length)}
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
            Averaging the richest and poorest cohorts shades the convergence band. The ratio drops as poorer economies grow faster, narrowing the skyline gap.
          </p>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div>
              <BandChartSvg
                upper={bandSeries.upper}
                lower={bandSeries.lower}
                xLabel="Year"
                yLabel="Average GDP per capita (EUR, PPP)"
                formatter={(value) => `€${Math.round(value / 1000)}k`}
                fill="rgba(14, 165, 233, 0.18)"
                strokeUpper="#0ea5e9"
                strokeLower="#22c55e"
              />
            </div>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>
                Rich cohort (Luxembourg, Ireland, Germany) vs. poorer cohort (Poland, Romania, Bulgaria). Ratio shrinks from<strong> {firstRatio.toFixed(1)}×</strong> at the start of the century to <strong>{latestRatio.toFixed(1)}×</strong> today.
              </p>
              <p>
                The shaded band makes the compression visible; annotations will call out milestones (EU accession, recovery from the financial crisis) once the narrative copy is wired in.
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
                  <span>Future work: hover states to reveal each cohort member.</span>
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
            Let readers add up to five economies, toggle levels vs. indexed growth, and remove chips. This scaffolding will wire into the Chapter 1 data pack so the narrative stays interactive.
          </p>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div>
              <MultiLineChartSvg
                series={yourViewSeries}
                xLabel="Year"
                yLabel={mode === "indexed" ? "Index (base year = 100)" : "GDP per capita (EUR, PPP)"}
                formatter={formatterForMode}
              />
            </div>
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
              <form onSubmit={handleAddCountry} className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <div>
                  <label htmlFor="country-picker" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Add a country
                  </label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <select
                      id="country-picker"
                      value={pendingCountry}
                      onChange={(event) => setPendingCountry(event.target.value)}
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:border-slate-700 dark:bg-slate-900"
                    >
                      {availableCountries.map((country) => (
                        <option key={country} value={country} disabled={selectedCountries.includes(country)}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500"
                      disabled={!pendingCountry || selectedCountries.includes(pendingCountry) || selectedCountries.length >= maxSelections}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Mode</span>
                  <div className="mt-2 flex gap-3">
                    {[
                      { label: "Euro levels", value: "level" as const },
                      { label: "Indexed (2000 = 100)", value: "indexed" as const },
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
                  {selectedCountries.map((country) => (
                    <span
                      key={country}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-100"
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorMap[country] }} aria-hidden="true" />
                      {country}
                      <button
                        type="button"
                        onClick={() => handleRemoveCountry(country)}
                        className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedCountries.length === 0 ? <span className="text-xs text-slate-400">Pick a country to populate the chart.</span> : null}
                </div>
              </div>
              <p>
                Indexed mode will normalise each series to 100 in {slopeYears[0]}, making it easier to compare momentum even when levels differ. Euro mode keeps the skyline context visible.
              </p>
            </div>
          </div>
        </motion.article>
      ),
    },
  ];

  const panelCount = panels.length;

  const goToPanel = (index: number, behavior: ScrollBehavior = "smooth") => {
    const clamped = Math.max(0, Math.min(index, panelCount - 1));
    const node = panelRefs.current[clamped];
    if (node) {
      node.scrollIntoView({ behavior, inline: "center", block: "nearest" });
    }
    setActivePanel(clamped);
  };

  const handleStep = (direction: "prev" | "next") => {
    const target = direction === "next" ? activePanel + 1 : activePanel - 1;
    if (target < 0 || target >= panelCount) return;
    goToPanel(target);
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

    panelRefs.current.forEach((panel) => {
      if (panel) observer.observe(panel);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (panelRefs.current[0]) {
      panelRefs.current[0].scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    }
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-slate-600 dark:text-slate-300">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Chapter 1 coverage</p>
          <p className="text-sm">
            The Chapter 1 opportunity data pack currently tracks <strong>{opportunityCountryCount}</strong> countries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleStep("prev")}
            disabled={activePanel === 0}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={() => handleStep("next")}
            disabled={activePanel === panelCount - 1}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500"
          >
            Next →
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="hide-scrollbar flex flex-row-reverse gap-6 overflow-x-auto scroll-smooth pb-6"
        dir="rtl"
      >
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            ref={(node) => {
              panelRefs.current[index] = node;
            }}
            className="snap-end"
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
    </div>
  );
};

export default PromiseOfGrowth;
