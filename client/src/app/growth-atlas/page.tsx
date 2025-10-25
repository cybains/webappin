"use client";

import React, { useEffect, useMemo, useState, useId } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Growth Atlas — visual dissertation scaffold
 * Stack: React + Framer Motion + Recharts + Tailwind (assumes Tailwind present)
 *
 * What you get:
 * 1) A storyboarded, scroll-driven homepage with five sections reflecting Susskind's thesis
 * 2) Reusable motion + layout primitives
 * 3) Data loader stubs for World Bank API & Maddison placeholder
 * 4) Example charts per section rendered with lightweight SVG helpers (with fake data seed + clear TODOs to wire live endpoints)
 *
 * How to use:
 * - Drop this file into your Next.js app (e.g., app/(marketing)/page.tsx or components/GrowthAtlas.tsx)
 * - Ensure Tailwind is configured. Optionally wrap with a container shell matching your design system.
 * - Replace FAKE_* data builders with real fetchers in the Data layer below.
 */

// -----------------------------
// Motion & UI primitives
// -----------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Section: React.FC<{
  id: string;
  eyebrow: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  bg?: string;
}> = ({ id, eyebrow, title, kicker, children, bg = "bg-white" }) => (
  <section id={id} className={`${bg} py-24 px-6 md:px-10`}>
    <div className="mx-auto max-w-6xl">
      <motion.p
        className="text-sm uppercase tracking-widest text-gray-500"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {title}
      </motion.h2>
      {kicker && (
        <motion.p
          className="mt-3 text-base md:text-lg text-gray-600 max-w-3xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {kicker}
        </motion.p>
      )}
      <div className="mt-8">{children}</div>
    </div>
  </section>
);

// -----------------------------
// Data layer (stubs → replace with real API calls)
// -----------------------------

// WORLD BANK v2 helper: GET json with pagination handling — replace with your fetcher or server route
async function fetchWorldBankJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WB fetch failed: ${res.status}`);
  return res.json();
}

// Example: GDP per capita (current US$) for a set of countries, long time series
// API: https://api.worldbank.org/v2/country/{codes}/indicator/NY.GDP.PCAP.CD?format=json&per_page=20000
type WorldBankSeriesEntry = {
  country?: { value?: string };
  countryiso3code?: string;
  date?: string;
  value?: number;
};

type NormalisedSeriesPoint = {
  country: string;
  code: string;
  year: number;
  value: number;
};

function isValidSeriesEntry(entry: WorldBankSeriesEntry): entry is Required<Pick<WorldBankSeriesEntry, "countryiso3code" | "date" | "value">> & { country?: { value?: string } } {
  return (
    typeof entry.countryiso3code === "string" &&
    typeof entry.date === "string" &&
    typeof entry.value === "number"
  );
}

async function getGDPpcSeries(countryCodes: string[]): Promise<NormalisedSeriesPoint[]> {
  const codes = countryCodes.join(";");
  const url = `https://api.worldbank.org/v2/country/${codes}/indicator/NY.GDP.PCAP.CD?format=json&per_page=20000`;
  const json = await fetchWorldBankJSON(url);
  // json = [metadata, data[]]
  const records = (Array.isArray(json?.[1]) ? json[1] : []) as WorldBankSeriesEntry[];
  // Normalize: { country, year, value }
  return records
    .filter(isValidSeriesEntry)
    .map((d) => ({
      country: d.country?.value ?? d.countryiso3code,
      code: d.countryiso3code,
      year: Number(d.date),
      value: d.value,
    }))
    .sort((a, b) => a.year - b.year);
}

// Example: Life expectancy series
async function getLifeExpectancySeries(countryCodes: string[]): Promise<NormalisedSeriesPoint[]> {
  const codes = countryCodes.join(";");
  const url = `https://api.worldbank.org/v2/country/${codes}/indicator/SP.DYN.LE00.IN?format=json&per_page=20000`;
  const json = await fetchWorldBankJSON(url);
  const records = (Array.isArray(json?.[1]) ? json[1] : []) as WorldBankSeriesEntry[];
  return records
    .filter(isValidSeriesEntry)
    .map((d) => ({
      country: d.country?.value ?? d.countryiso3code,
      code: d.countryiso3code,
      year: Number(d.date),
      value: d.value,
    }))
    .sort((a, b) => a.year - b.year);
}

// FAKE fallback data (in case API blocked during local dev)
function makeFakeSeries(kind: "gdp" | "life", code: string, label: string = code): NormalisedSeriesPoint[] {
  const arr: NormalisedSeriesPoint[] = [];
  for (let y = 1960; y <= 2024; y++) {
    const base =
      kind === "gdp"
        ? 500 + (y - 1960) ** 2
        : 45 + Math.log(y - 1959) * 8;
    arr.push({ year: y, value: Number(base.toFixed(2)), country: label, code });
  }
  return arr;
}

// -----------------------------
// Chart helpers
// -----------------------------

function formatYear(tick: number) {
  return String(tick);
}

function formatCompact(n?: number) {
  if (n == null) return "";
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

type LineDatum = { x: number; y: number };

function buildLinePath(points: LineDatum[], width: number, height: number, margin: number) {
  if (!points.length) return "";
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const usableWidth = width - margin * 2;
  const usableHeight = height - margin * 2;
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  return points
    .map((point, index) => {
      const x = margin + ((point.x - minX) / xRange) * usableWidth;
      const y = height - margin - ((point.y - minY) / yRange) * usableHeight;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

type ScatterDatum = { x: number; y: number; r?: number; label?: string };

function mapScatterPoints(points: ScatterDatum[], width: number, height: number, margin: number) {
  if (!points.length) return [] as Array<ScatterDatum & { cx: number; cy: number; radius: number }>;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const usableWidth = width - margin * 2;
  const usableHeight = height - margin * 2;
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;
  const radii = points.map((p) => p.r ?? 5);
  const minR = Math.min(...radii);
  const maxR = Math.max(...radii);
  const rRange = maxR - minR || 1;

  return points.map((point) => {
    const cx = margin + ((point.x - minX) / xRange) * usableWidth;
    const cy = height - margin - ((point.y - minY) / yRange) * usableHeight;
    const radius = 4 + (((point.r ?? minR) - minR) / rRange) * 12;
    return { ...point, cx, cy, radius };
  });
}

function LineChartSvg({
  data,
  width = 360,
  height = 240,
  color = "#2563eb",
  formatter,
}: {
  data: Array<{ x: number; y: number }>;
  width?: number;
  height?: number;
  color?: string;
  formatter?: (value: number) => string;
}) {
  const margin = 32;
  const gradientId = useId();
  if (!data.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
        <rect
          x={margin}
          y={margin}
          width={width - margin * 2}
          height={height - margin * 2}
          rx={12}
          fill="rgba(148, 163, 184, 0.08)"
          stroke="#e2e8f0"
        />
        <text x={width / 2} y={height / 2} textAnchor="middle" fontSize={12} fill="#475569">
          No data yet
        </text>
      </svg>
    );
  }
  const path = buildLinePath(data, width, height, margin);
  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  const xTicks = Array.from({ length: 4 }, (_, i) => minX + (i / 3) * xRange);
  const yTicks = Array.from({ length: 4 }, (_, i) => minY + (i / 3) * yRange);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
      <rect
        x={margin}
        y={margin}
        width={width - margin * 2}
        height={height - margin * 2}
        fill={`url(#${gradientId})`}
        stroke="#e2e8f0"
        strokeWidth={1}
        rx={12}
      />
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(148, 163, 184, 0.08)" />
          <stop offset="100%" stopColor="rgba(148, 163, 184, 0.18)" />
        </linearGradient>
      </defs>
      <g>
        {xTicks.map((tick, idx) => {
          const x =
            margin + ((tick - minX) / (xRange || 1)) * (width - margin * 2);
          return <line key={`x-${idx}`} x1={x} x2={x} y1={margin} y2={height - margin} stroke="rgba(226,232,240,0.7)" />;
        })}
        {yTicks.map((tick, idx) => {
          const y =
            height - margin - ((tick - minY) / (yRange || 1)) * (height - margin * 2);
          return <line key={`y-${idx}`} x1={margin} x2={width - margin} y1={y} y2={y} stroke="rgba(226,232,240,0.7)" />;
        })}
      </g>
      <path d={path} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <g>
        {xTicks.map((tick) => {
          const x = margin + ((tick - minX) / (xRange || 1)) * (width - margin * 2);
          return (
            <text key={tick} x={x} y={height - margin + 20} fontSize={11} textAnchor="middle" fill="#475569">
              {formatYear(Math.round(tick))}
            </text>
          );
        })}
        {yTicks.map((tick) => {
          const y = height - margin - ((tick - minY) / (yRange || 1)) * (height - margin * 2);
          return (
            <text key={tick} x={margin - 12} y={y} fontSize={11} textAnchor="end" alignmentBaseline="middle" fill="#475569">
              {formatter ? formatter(tick) : Math.round(tick).toLocaleString()}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function ScatterChartSvg({
  data,
  width = 360,
  height = 240,
  color = "#38bdf8",
  referenceLines,
  xLabel,
  yLabel,
}: {
  data: ScatterDatum[];
  width?: number;
  height?: number;
  color?: string;
  referenceLines?: { x?: number; y?: number };
  xLabel?: string;
  yLabel?: string;
}) {
  const margin = 40;
  if (!data.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
        <rect
          x={margin}
          y={margin}
          width={width - margin * 2}
          height={height - margin * 2}
          rx={12}
          fill="rgba(148, 163, 184, 0.08)"
          stroke="#e2e8f0"
        />
        <text x={width / 2} y={height / 2} textAnchor="middle" fontSize={12} fill="#475569">
          No data yet
        </text>
      </svg>
    );
  }
  const mapped = mapScatterPoints(data, width, height, margin);
  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;
  const usableWidth = width - margin * 2;
  const usableHeight = height - margin * 2;
  const xTicks = Array.from({ length: 4 }, (_, i) => minX + (i / 3) * xRange);
  const yTicks = Array.from({ length: 4 }, (_, i) => minY + (i / 3) * yRange);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
      <rect
        x={margin}
        y={margin}
        width={usableWidth}
        height={usableHeight}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
      />
      {xTicks.map((tick, idx) => {
        const x = margin + ((tick - minX) / (xRange || 1)) * usableWidth;
        return <line key={`x-grid-${idx}`} x1={x} x2={x} y1={margin} y2={height - margin} stroke="rgba(226,232,240,0.55)" />;
      })}
      {yTicks.map((tick, idx) => {
        const y = height - margin - ((tick - minY) / (yRange || 1)) * usableHeight;
        return <line key={`y-grid-${idx}`} x1={margin} x2={width - margin} y1={y} y2={y} stroke="rgba(226,232,240,0.55)" />;
      })}
      {referenceLines?.x != null ? (
        <line
          x1={margin + ((referenceLines.x - minX) / (xRange || 1)) * usableWidth}
          x2={margin + ((referenceLines.x - minX) / (xRange || 1)) * usableWidth}
          y1={margin}
          y2={height - margin}
          stroke="rgba(59, 130, 246, 0.7)"
          strokeDasharray="4 4"
        />
      ) : null}
      {referenceLines?.y != null ? (
        <line
          x1={margin}
          x2={width - margin}
          y1={height - margin - ((referenceLines.y - minY) / (yRange || 1)) * usableHeight}
          y2={height - margin - ((referenceLines.y - minY) / (yRange || 1)) * usableHeight}
          stroke="rgba(59, 130, 246, 0.7)"
          strokeDasharray="4 4"
        />
      ) : null}
      {mapped.map((point, idx) => (
        <circle key={idx} cx={point.cx} cy={point.cy} r={point.radius} fill={color} opacity={0.75} />
      ))}
      {xTicks.map((tick) => {
        const x = margin + ((tick - minX) / (xRange || 1)) * usableWidth;
        return (
          <text key={`x-label-${tick}`} x={x} y={height - margin + 18} fontSize={11} textAnchor="middle" fill="#475569">
            {Math.round(tick).toLocaleString()}
          </text>
        );
      })}
      {yTicks.map((tick) => {
        const y = height - margin - ((tick - minY) / (yRange || 1)) * usableHeight;
        return (
          <text
            key={`y-label-${tick}`}
            x={margin - 10}
            y={y}
            fontSize={11}
            textAnchor="end"
            alignmentBaseline="middle"
            fill="#475569"
          >
            {Math.round(tick).toLocaleString()}
          </text>
        );
      })}
      {xLabel ? (
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="#475569">
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text transform={`translate(12 ${height / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="#475569">
          {yLabel}
        </text>
      ) : null}
    </svg>
  );
}

// -----------------------------
// Section Components
// -----------------------------

// 1) Promise of Growth — GDPpc + Life Expectancy (dual visuals)
const PromiseOfGrowth: React.FC = () => {
  const [gdp, setGdp] = useState<NormalisedSeriesPoint[]>([]);
  const [le, setLe] = useState<NormalisedSeriesPoint[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [gdpS, leS] = await Promise.all([
          getGDPpcSeries(["AUT", "IND", "DEU", "NLD"]).catch(() => makeFakeSeries("gdp", "AUT", "Austria")),
          getLifeExpectancySeries(["AUT", "IND", "DEU", "NLD"]).catch(() => makeFakeSeries("life", "AUT", "Austria")),
        ]);
        // For demo, reduce to 2 lines by aggregating per year (world vs sample) or filter for 2 codes
        const pick = (arr: NormalisedSeriesPoint[], code: string) => arr.filter((d) => d.code === code);
        setGdp(pick(gdpS, "AUT"));
        setLe(pick(leS, "AUT"));
      } catch {
        setGdp(makeFakeSeries("gdp", "AUT", "Austria"));
        setLe(makeFakeSeries("life", "AUT", "Austria"));
      }
    })();
  }, []);

  const gdpSeries = useMemo(() => gdp.map((point) => ({ x: point.year, y: point.value })), [gdp]);
  const leSeries = useMemo(() => le.map((point) => ({ x: point.year, y: point.value })), [le]);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
        <h3 className="mb-1 font-medium">GDP per capita (sample)</h3>
        <p className="mb-4 text-sm text-gray-600">Log-scaled y-axis recommended in final build; here linear for simplicity.</p>
        <div className="h-72">
          <LineChartSvg data={gdpSeries} formatter={(value) => formatCompact(Math.round(value))} />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
        <h3 className="mb-1 font-medium">Life expectancy (sample)</h3>
        <p className="mb-4 text-sm text-gray-600">Correlates with rising incomes over the long run.</p>
        <div className="h-72">
          <LineChartSvg
            data={leSeries}
            color="#059669"
            formatter={(value) => `${value.toFixed(1)}`}
          />
        </div>
      </motion.div>
    </div>
  );
};

// 2) Uneven Growth — Inequality choropleth placeholder + migration scatter (stub visuals)
const UnevenGrowth: React.FC = () => {
  // For now: a scatter approximating "origin vs destination" pressure
  const data = useMemo(() => {
    const arr: Array<{ x: number; y: number; z: number; name: string }> = [];
    for (let i = 0; i < 30; i++) {
      arr.push({ x: 3 + Math.random() * 8, y: 50 + Math.random() * 40, z: 1 + Math.random() * 20, name: `C${i}` });
    }
    return arr;
  }, []);
  const scatterPoints = useMemo(
    () => data.map((point) => ({ x: point.x, y: point.y, r: point.z })),
    [data],
  );

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
        <h3 className="mb-1 font-medium">Migration pressure proxy</h3>
        <p className="mb-4 text-sm text-gray-600">x: unemployment (origin), y: job vacancies (destination), size: population (fake data).</p>
        <div className="h-72">
          <ScatterChartSvg
            data={scatterPoints}
            xLabel="Origin unemployment %"
            yLabel="Destination vacancies index"
          />
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
        <h3 className="mb-1 font-medium">Inequality (choropleth placeholder)</h3>
        <p className="mb-4 text-sm text-gray-600">Integrate a map lib (e.g., react-simple-maps) to render Gini by country.</p>
        <div className="h-72 grid place-items-center text-gray-500">[ Map placeholder ]</div>
      </motion.div>
    </div>
  );
};

// 3) Change the Nature — Decoupling quadrant (ΔGDPpc vs ΔCO2pc)
const DecouplingQuadrant: React.FC = () => {
  const data = useMemo(() => {
    // Fake country deltas 2010→2023
    const mk = (name: string) => ({ name, dGDP: -1 + Math.random() * 4, dCO2: -2 + Math.random() * 3 });
    return [mk("AUT"), mk("DEU"), mk("NLD"), mk("IND"), mk("POL"), mk("ESP")];
  }, []);
  const points = useMemo(
    () => data.map((entry) => ({ x: entry.dGDP, y: entry.dCO2, label: entry.name, r: 10 })),
    [data],
  );

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
      <h3 className="mb-1 font-medium">Decoupling quadrant (2010→latest)</h3>
      <p className="mb-4 text-sm text-gray-600">x: ΔGDP per capita (pp), y: ΔCO₂ per capita (t/person). Goal: top-left quadrant (↑GDP, ↓CO₂).</p>
      <div className="h-80">
        <ScatterChartSvg
          data={points}
          color="#f97316"
          referenceLines={{ x: 0, y: 0 }}
          xLabel="ΔGDP per capita (pp)"
          yLabel="ΔCO₂ per capita (t/person)"
        />
      </div>
      <div className="mt-3 text-sm text-gray-600">
        <p>TODO: compute true deltas from WB series (2010 vs latest) per country.</p>
        <p>Optional: animate trails (2010→2023) using multi-point segments per country.</p>
      </div>
    </motion.div>
  );
};

// 4) Diffusion (S-curve) — Internet users with logistic overlay (overlay stub)
const DiffusionSCurve: React.FC = () => {
  // Fake adoption curve ~ logistic
  const series = useMemo(() => {
    const arr: Array<{ year: number; usersPct: number }> = [];
    for (let t = 1990; t <= 2024; t++) {
      const L = 95,
        k = 0.22,
        t0 = 2005;
      const f = L / (1 + Math.exp(-k * (t - t0)));
      arr.push({ year: t, usersPct: Number(f.toFixed(2)) });
    }
    return arr;
  }, []);
  const line = useMemo(() => series.map((point) => ({ x: point.year, y: point.usersPct })), [series]);

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
      <h3 className="mb-1 font-medium">Technology diffusion (Internet users % of population)</h3>
      <p className="mb-4 text-sm text-gray-600">Overlay logistic fit parameters (L, k, t₀) once you fetch real series.</p>
      <div className="h-72">
        <LineChartSvg data={line} color="#6366f1" formatter={(value) => `${value.toFixed(0)}%`} />
      </div>
    </motion.div>
  );
};

// 5) Human Capital — R&D % GDP vs GDP growth (bivariate)
const HumanCapitalIdeas: React.FC = () => {
  const pts = useMemo(() => {
    const mk = (name: string, rd: number, g: number) => ({ name, rd, g });
    return [
      mk("AUT", 3.2, 1.5),
      mk("DEU", 3.1, 1.2),
      mk("NLD", 2.3, 1.7),
      mk("SWE", 3.4, 1.8),
      mk("KOR", 4.9, 2.5),
      mk("ISR", 5.4, 2.2),
    ];
  }, []);
  const scatter = useMemo(
    () => pts.map((entry) => ({ x: entry.rd, y: entry.g, label: entry.name, r: 12 })),
    [pts],
  );

  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="rounded-2xl border p-4">
      <h3 className="mb-1 font-medium">Idea intensity vs growth</h3>
      <p className="mb-4 text-sm text-gray-600">x: R&D expenditure (% GDP), y: avg GDP pc growth (pp). Use WB + compute 5–10y CAGR.</p>
      <div className="h-72">
        <ScatterChartSvg
          data={scatter}
          color="#14b8a6"
          xLabel="R&D % GDP"
          yLabel="GDP pc growth (pp)"
        />
      </div>
    </motion.div>
  );
};

// CTA panel tying back to Skillaxis value prop
const ValueProp: React.FC = () => (
  <div className="grid md:grid-cols-3 gap-6">
    {[
      {
        title: "Connect surplus skills to shortages",
        body: "We map origin-country supply to destination demand—ethically and compliantly.",
      },
      { title: "Operate where growth is better", body: "We prioritize sectors and partners aligned with decoupling and fair pay." },
      { title: "Move ideas, not just people", body: "Language, credentials, and training pathways built-in." },
    ].map((c, i) => (
      <motion.div
        key={i}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="rounded-2xl border p-5"
      >
        <h4 className="font-medium text-lg">{c.title}</h4>
        <p className="mt-2 text-gray-600 text-sm">{c.body}</p>
        <button className="mt-4 inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">Talk to us →</button>
      </motion.div>
    ))}
  </div>
);

// -----------------------------
// Page shell
// -----------------------------

const Hero: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <motion.div style={{ scale, opacity }} className="mx-auto max-w-6xl px-6 md:px-10 pt-28 pb-16">
        <motion.h1 className="text-4xl md:text-6xl font-semibold tracking-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          Growth, Reimagined
        </motion.h1>
        <motion.p className="mt-4 max-w-3xl text-gray-600" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
          A visual dissertation inspired by Daniel Susskind: not just more growth—but better growth. Built with open data.
        </motion.p>
        <div className="mt-8 flex gap-3">
          <a href="#promise" className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
            Start the story
          </a>
          <a href="#value" className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
            Work with us
          </a>
        </div>
      </motion.div>
    </div>
  );
};

const Footer: React.FC = () => (
  <footer className="py-10 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} UAB Skillaxis · Data from the World Bank and public sources.
  </footer>
);

const GrowthAtlasPage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Hero />

      <Section id="promise" eyebrow="Chapter 1" title="The Promise of Growth" kicker="Modern sustained growth is historically recent—and it bought longer lives.">
        <PromiseOfGrowth />
      </Section>

      <Section id="uneven" eyebrow="Chapter 2" title="The Uneven Growth" kicker="Benefits are real but uneven—people move to where opportunity lives." bg="bg-gray-50">
        <UnevenGrowth />
      </Section>

      <Section id="nature" eyebrow="Chapter 3" title="Change the Nature of Growth" kicker="Richer with fewer tons and joules: decoupling in practice.">
        <DecouplingQuadrant />
      </Section>

      <Section id="diffusion" eyebrow="Chapter 4" title="Diffusion & S‑Curves" kicker="Transformation is nonlinear—slow, then fast, then done." bg="bg-gray-50">
        <DiffusionSCurve />
      </Section>

      <Section id="ideas" eyebrow="Chapter 5" title="Human Capital & Ideas" kicker="Enduring growth is idea‑intensive—ultimately about people.">
        <HumanCapitalIdeas />
      </Section>

      <Section id="value" eyebrow="Apply" title="What this means for employers & partners" kicker="We turn this thesis into hiring and mobility outcomes." bg="bg-gray-50">
        <ValueProp />
      </Section>

      <Footer />
    </main>
  );
};

export default GrowthAtlasPage;
