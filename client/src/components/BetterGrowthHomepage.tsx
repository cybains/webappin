"use client";

import React, { useMemo } from "react";
import { Brain, Factory, Leaf, LineChart, Map, Users } from "lucide-react";

// ------------------------------------------------------------
// Better Growth — Homepage Dissertation (React)
// Light theme (black on white), witty/dry tone
// Uses mock data placeholders — swap with World Bank API later.
// Includes simple runtime smoke tests for data shape.
// ------------------------------------------------------------

const gdpPerCapitaEU = [
  { year: 2000, AT: 28000, DE: 25500, PL: 12500, RO: 8000 },
  { year: 2005, AT: 34000, DE: 31000, PL: 16000, RO: 10500 },
  { year: 2010, AT: 42000, DE: 39500, PL: 22000, RO: 14500 },
  { year: 2015, AT: 47000, DE: 44000, PL: 27000, RO: 19500 },
  { year: 2020, AT: 52000, DE: 50000, PL: 31500, RO: 24500 },
  { year: 2024, AT: 56000, DE: 54000, PL: 35500, RO: 28500 },
];

const rndVsGrowth = [
  { country: "AT", rnd: 3.2, gdp: 1.7 },
  { country: "DE", rnd: 3.1, gdp: 1.5 },
  { country: "NL", rnd: 2.4, gdp: 1.9 },
  { country: "PL", rnd: 1.4, gdp: 3.0 },
  { country: "RO", rnd: 0.5, gdp: 3.2 },
  { country: "EE", rnd: 1.8, gdp: 2.5 },
];

const gdpVsCO2 = [
  { year: 2000, gdp: 100, co2: 100 },
  { year: 2005, gdp: 115, co2: 105 },
  { year: 2010, gdp: 125, co2: 98 },
  { year: 2015, gdp: 135, co2: 90 },
  { year: 2020, gdp: 140, co2: 82 },
  { year: 2024, gdp: 150, co2: 78 },
];

const migrationBalance = [
  { route: "IN → AT", people: 3.2 },
  { route: "IN → DE", people: 7.8 },
  { route: "AE → AT", people: 1.1 },
  { route: "QA → DE", people: 0.9 },
  { route: "IN → NL", people: 2.0 },
];

const growthVsInequality = [
  { country: "AT", growth: 1.6, gini: 30 },
  { country: "DE", growth: 1.4, gini: 32 },
  { country: "NL", growth: 1.8, gini: 28 },
  { country: "PL", growth: 3.1, gini: 31 },
  { country: "RO", growth: 3.0, gini: 35 },
  { country: "ES", growth: 2.0, gini: 34 },
];

const createLinearScale = (domain: [number, number], range: [number, number]) => {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d0 === d1) {
    return () => (r0 + r1) / 2;
  }
  return (value: number) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
};

const formatEuroThousands = (value: number) => `€${(value / 1000).toFixed(0)}k`;


// --- Runtime smoke tests ("test cases") ----------------------
function runSmokeTests() {
  try {
    console.assert(Array.isArray(gdpPerCapitaEU) && gdpPerCapitaEU.length > 0, "gdpPerCapitaEU missing");
    console.assert(gdpPerCapitaEU[0] && typeof gdpPerCapitaEU[0].year === "number", "gdpPerCapitaEU.year missing");
    console.assert(Array.isArray(rndVsGrowth) && rndVsGrowth.every(d => "rnd" in d && "gdp" in d), "rndVsGrowth shape");
    console.assert(Array.isArray(gdpVsCO2) && gdpVsCO2.every(d => "year" in d && "gdp" in d && "co2" in d), "gdpVsCO2 shape");
    console.assert(Array.isArray(migrationBalance) && migrationBalance.every(d => "route" in d && "people" in d), "migrationBalance shape");
    console.assert(Array.isArray(growthVsInequality) && growthVsInequality.every(d => "growth" in d && "gini" in d), "growthVsInequality shape");
  } catch (e) {
    // Non-fatal; diagnostics only
    console.warn("Smoke tests failed:", e);
  }
}
runSmokeTests();

type SectionProps = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  kicker: string;
  children: React.ReactNode;
  lede?: React.ReactNode;
};

type CardProps = {
  children: React.ReactNode;
};

// --- UI primitives -------------------------------------------
const Section = ({ id, icon: Icon, title, kicker, children, lede }: SectionProps) => (
  <section id={id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {lede && (
      <div className="mb-6 text-base md:text-lg text-slate-600">{lede}</div>
    )}
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-5 h-5" />
      <p className="uppercase tracking-widest text-xs opacity-70">{kicker}</p>
    </div>
    <h2 className="text-2xl md:text-4xl font-semibold mb-4">{title}</h2>
    <div className="prose prose-slate max-w-none mb-8">{children}</div>
  </section>
);

const Card = ({ children }: CardProps) => (
  <div className="rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm bg-white">
    {children}
  </div>
);

const GDPPerCapitaChart = () => {
  const width = 620;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 28, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const years = gdpPerCapitaEU.map((d) => d.year);
  const values = gdpPerCapitaEU.flatMap((d) => [d.AT, d.DE, d.PL, d.RO]);
  const xScale = createLinearScale([Math.min(...years), Math.max(...years)], [0, innerWidth]);
  const yScale = createLinearScale([Math.min(...values), Math.max(...values)], [innerHeight, 0]);

  const colorByKey: Record<string, string> = {
    AT: "#1d4ed8",
    DE: "#16a34a",
    PL: "#f97316",
    RO: "#9333ea",
  };

  const yTicks = useMemo(() => {
    const count = 4;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const step = (max - min) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(min + step * i));
  }, [values]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Grid */}
        {yTicks.map((tick) => (
          <line
            key={`grid-y-${tick}`}
            x1={0}
            y1={yScale(tick)}
            x2={innerWidth}
            y2={yScale(tick)}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />
        ))}
        {years.map((year) => (
          <line
            key={`grid-x-${year}`}
            x1={xScale(year)}
            y1={0}
            x2={xScale(year)}
            y2={innerHeight}
            stroke="#f1f5f9"
          />
        ))}

        {/* Axes */}
        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#94a3b8" />
        <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#94a3b8" />

        {yTicks.map((tick) => (
          <text
            key={`label-y-${tick}`}
            x={-12}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-slate-500 text-[10px]"
          >
            {formatEuroThousands(tick)}
          </text>
        ))}

        {years.map((year) => (
          <text
            key={`label-x-${year}`}
            x={xScale(year)}
            y={innerHeight + 18}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {year}
          </text>
        ))}

        {Object.keys(colorByKey).map((key) => {
          const path = gdpPerCapitaEU
            .map((d, i) => {
              const x = xScale(d.year);
              const y = yScale((d as Record<string, number>)[key]);
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");
          return (
            <path
              key={key}
              d={path}
              fill="none"
              stroke={colorByKey[key]}
              strokeWidth={2.2}
            />
          );
        })}
      </g>

      {/* Legend */}
      <g transform={`translate(${margin.left},${height - 8})`}>
        {Object.entries(colorByKey).map(([key, color], index) => (
          <g key={key} transform={`translate(${index * 120},0)`}>
            <rect width={12} height={4} y={-8} rx={2} fill={color} />
            <text x={16} y={-5} className="fill-slate-600 text-[10px]">
              {key === "AT"
                ? "Austria"
                : key === "DE"
                ? "Germany"
                : key === "PL"
                ? "Poland"
                : "Romania"}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

const ScatterRndVsGrowth = () => {
  const width = 620;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 32, left: 52 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const rndValues = rndVsGrowth.map((d) => d.rnd);
  const gdpValues = rndVsGrowth.map((d) => d.gdp);

  const xScale = createLinearScale(
    [Math.min(...rndValues) * 0.85, Math.max(...rndValues) * 1.05],
    [0, innerWidth],
  );
  const yScale = createLinearScale(
    [Math.min(...gdpValues) * 0.85, Math.max(...gdpValues) * 1.1],
    [innerHeight, 0],
  );

  const xTicks = useMemo(() => {
    const min = Math.floor(Math.min(...rndValues));
    const max = Math.ceil(Math.max(...rndValues));
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [rndValues]);

  const yTicks = useMemo(() => {
    const min = Math.floor(Math.min(...gdpValues));
    const max = Math.ceil(Math.max(...gdpValues));
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [gdpValues]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {yTicks.map((tick) => (
          <line
            key={`grid-y-${tick}`}
            x1={0}
            y1={yScale(tick)}
            x2={innerWidth}
            y2={yScale(tick)}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />
        ))}
        {xTicks.map((tick) => (
          <line
            key={`grid-x-${tick}`}
            x1={xScale(tick)}
            y1={0}
            x2={xScale(tick)}
            y2={innerHeight}
            stroke="#f1f5f9"
          />
        ))}

        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#94a3b8" />
        <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#94a3b8" />

        {yTicks.map((tick) => (
          <text
            key={`label-y-${tick}`}
            x={-10}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-slate-500 text-[10px]"
          >
            {`${tick}%`}
          </text>
        ))}

        {xTicks.map((tick) => (
          <text
            key={`label-x-${tick}`}
            x={xScale(tick)}
            y={innerHeight + 16}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {`${tick}%`}
          </text>
        ))}

        {/* Reference line at 2% R&D */}
        <line
          x1={xScale(2)}
          y1={0}
          x2={xScale(2)}
          y2={innerHeight}
          stroke="#6366f1"
          strokeDasharray="4 4"
        />

        {rndVsGrowth.map((point) => (
          <g key={point.country} transform={`translate(${xScale(point.rnd)},${yScale(point.gdp)})`}>
            <circle r={6} fill="#0f172a" fillOpacity={0.12} />
            <circle r={3} fill="#0f172a" />
            <text y={-10} textAnchor="middle" className="fill-slate-600 text-[10px]">
              {point.country}
            </text>
          </g>
        ))}
      </g>

      <text
        x={margin.left + innerWidth / 2}
        y={height - 4}
        textAnchor="middle"
        className="fill-slate-500 text-[10px]"
      >
        R&D spend (% GDP)
      </text>
      <text
        transform={`translate(12 ${margin.top + innerHeight / 2}) rotate(-90)`}
        textAnchor="middle"
        className="fill-slate-500 text-[10px]"
      >
        GDP growth (%)
      </text>
    </svg>
  );
};

const GDPVsCO2AreaChart = () => {
  const width = 620;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 28, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const years = gdpVsCO2.map((d) => d.year);
  const values = gdpVsCO2.flatMap((d) => [d.gdp, d.co2]);

  const xScale = createLinearScale([Math.min(...years), Math.max(...years)], [0, innerWidth]);
  const yScale = createLinearScale([Math.min(...values), Math.max(...values)], [innerHeight, 0]);

  const baseValue = Math.min(...values);

  const buildPath = (key: "gdp" | "co2") =>
    gdpVsCO2
      .map((d, i) => {
        const x = xScale(d.year);
        const y = yScale(d[key]);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  const areaPath = (key: "gdp" | "co2") => {
    const forward = gdpVsCO2.map((d, i) => {
      const x = xScale(d.year);
      const y = yScale(d[key]);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    });
    const reverse = [...gdpVsCO2]
      .reverse()
      .map((d, i) => {
        const x = xScale(d.year);
        const y = yScale(baseValue);
        return `${i === 0 ? "L" : "L"} ${x} ${y}`;
      });
    return `${forward.join(" ")} ${reverse.join(" ")} Z`;
  };

  const yTicks = useMemo(() => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const count = 5;
    const step = (max - min) / count;
    return Array.from({ length: count + 1 }, (_, i) => Math.round(min + step * i));
  }, [values]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <linearGradient id="gdpGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.05} />
        </linearGradient>
        <linearGradient id="co2Gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
        </linearGradient>
      </defs>

      <g transform={`translate(${margin.left},${margin.top})`}>
        {yTicks.map((tick) => (
          <line
            key={`grid-${tick}`}
            x1={0}
            y1={yScale(tick)}
            x2={innerWidth}
            y2={yScale(tick)}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />
        ))}

        {years.map((year) => (
          <line
            key={`grid-x-${year}`}
            x1={xScale(year)}
            y1={0}
            x2={xScale(year)}
            y2={innerHeight}
            stroke="#f1f5f9"
          />
        ))}

        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#94a3b8" />
        <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#94a3b8" />

        {yTicks.map((tick) => (
          <text
            key={`label-${tick}`}
            x={-10}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-slate-500 text-[10px]"
          >
            {tick}
          </text>
        ))}

        {years.map((year) => (
          <text
            key={`label-x-${year}`}
            x={xScale(year)}
            y={innerHeight + 16}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {year}
          </text>
        ))}

        <path d={areaPath("co2")} fill="url(#co2Gradient)" stroke="none" />
        <path d={areaPath("gdp")} fill="url(#gdpGradient)" stroke="none" />
        <path d={buildPath("co2")} stroke="#ef4444" strokeWidth={2} fill="none" />
        <path d={buildPath("gdp")} stroke="#1d4ed8" strokeWidth={2} fill="none" />
      </g>

      <g transform={`translate(${margin.left},${height - 8})`}>
        <g className="text-[10px] fill-slate-600" transform="translate(0,-6)">
          <rect width={12} height={4} y={-6} rx={2} fill="#1d4ed8" />
          <text x={16} y={-3}>GDP Index</text>
        </g>
        <g className="text-[10px] fill-slate-600" transform="translate(120,-6)">
          <rect width={12} height={4} y={-6} rx={2} fill="#ef4444" />
          <text x={16} y={-3}>CO₂ Index</text>
        </g>
      </g>
    </svg>
  );
};

const MobilityBarChart = () => {
  const width = 620;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 40, left: 52 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxValue = Math.max(...migrationBalance.map((d) => d.people));
  const yScale = createLinearScale([0, maxValue * 1.2], [innerHeight, 0]);
  const barWidth = innerWidth / migrationBalance.length - 16;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <g transform={`translate(${margin.left},${margin.top})`}>
        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#94a3b8" />
        <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#94a3b8" />

        {Array.from({ length: 4 }, (_, i) => (i + 1) * (maxValue / 4)).map((tick) => (
          <g key={tick}>
            <line
              x1={0}
              y1={yScale(tick)}
              x2={innerWidth}
              y2={yScale(tick)}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
            <text
              x={-10}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-slate-500 text-[10px]"
            >
              {`${tick.toFixed(1)}k`}
            </text>
          </g>
        ))}

        {migrationBalance.map((route, index) => {
          const x = index * (barWidth + 16) + 8;
          const barHeight = innerHeight - yScale(route.people);
          return (
            <g key={route.route} transform={`translate(${x},${yScale(route.people)})`}>
              <rect
                width={barWidth}
                height={barHeight}
                rx={6}
                fill="#0f172a"
                fillOpacity={0.85}
              />
              <text
                x={barWidth / 2}
                y={-6}
                textAnchor="middle"
                className="fill-slate-500 text-[10px]"
              >
                {`${route.people.toFixed(1)}k`}
              </text>
              <text
                x={barWidth / 2}
                y={barHeight + 16}
                textAnchor="middle"
                className="fill-slate-600 text-[10px]"
              >
                {route.route}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

const BalancedScatter = () => {
  const width = 620;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 32, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const growthValues = growthVsInequality.map((d) => d.growth);
  const giniValues = growthVsInequality.map((d) => d.gini);

  const xScale = createLinearScale(
    [Math.min(...growthValues) * 0.85, Math.max(...growthValues) * 1.1],
    [0, innerWidth],
  );
  const yScale = createLinearScale(
    [Math.max(...giniValues) * 1.05, Math.min(...giniValues) * 0.9],
    [0, innerHeight],
  );

  const xTicks = useMemo(() => {
    const min = Math.floor(Math.min(...growthValues));
    const max = Math.ceil(Math.max(...growthValues));
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [growthValues]);

  const yTicks = useMemo(() => {
    const min = Math.floor(Math.min(...giniValues));
    const max = Math.ceil(Math.max(...giniValues));
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [giniValues]);

  const highlightLeft = Math.min(xScale(1.5), xScale(3.5));
  const highlightWidth = Math.abs(xScale(3.5) - xScale(1.5));
  const highlightTop = Math.min(yScale(32), yScale(26));
  const highlightHeight = Math.abs(yScale(32) - yScale(26));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <g transform={`translate(${margin.left},${margin.top})`}>
        <rect
          x={highlightLeft}
          y={highlightTop}
          width={highlightWidth}
          height={highlightHeight}
          fill="#22c55e"
          opacity={0.08}
          stroke="#22c55e"
          strokeDasharray="4 4"
        />

        {yTicks.map((tick) => (
          <line
            key={`grid-y-${tick}`}
            x1={0}
            y1={yScale(tick)}
            x2={innerWidth}
            y2={yScale(tick)}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />
        ))}
        {xTicks.map((tick) => (
          <line
            key={`grid-x-${tick}`}
            x1={xScale(tick)}
            y1={0}
            x2={xScale(tick)}
            y2={innerHeight}
            stroke="#f1f5f9"
          />
        ))}

        <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#94a3b8" />
        <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#94a3b8" />

        {yTicks.map((tick) => (
          <text
            key={`label-y-${tick}`}
            x={-12}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-slate-500 text-[10px]"
          >
            {tick}
          </text>
        ))}

        {xTicks.map((tick) => (
          <text
            key={`label-x-${tick}`}
            x={xScale(tick)}
            y={innerHeight + 16}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {`${tick}%`}
          </text>
        ))}

        {growthVsInequality.map((point) => (
          <g key={point.country} transform={`translate(${xScale(point.growth)},${yScale(point.gini)})`}>
            <circle r={6} fill="#0f172a" fillOpacity={0.15} />
            <circle r={3} fill="#0f172a" />
            <text y={-10} textAnchor="middle" className="fill-slate-600 text-[10px]">
              {point.country}
            </text>
          </g>
        ))}
      </g>

      <text
        x={margin.left + innerWidth / 2}
        y={height - 6}
        textAnchor="middle"
        className="fill-slate-500 text-[10px]"
      >
        GDP growth (%)
      </text>
      <text
        transform={`translate(12 ${margin.top + innerHeight / 2}) rotate(-90)`}
        textAnchor="middle"
        className="fill-slate-500 text-[10px]"
      >
        Gini (lower is fairer)
      </text>
    </svg>
  );
};

const UnevenGrowth = () => (
  <Section
    id="uneven"
    icon={Factory}
    kicker="Chapter 1"
    title="Growth is uneven. Your strategy shouldn’t be."
    lede="Economy, without the drama. We measure what matters, ignore what doesn’t, and nudge growth toward something clever, clean, and actually useful."
  >
    <p>
      Some regions sprint. Others tie their shoes for twenty years. We chart divergence so you can
      make convergence happen — profitably.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">GDP per capita — selected EU economies</h3>
        <div className="h-64">
          <GDPPerCapitaChart />
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          Convergence is real — and incomplete. Strategy tip: aim hiring pipelines where the slope is
          steepest, not where the skyline is tallest.
        </p>
      </Card>
    </div>
  </Section>
);

const BrainsNotBrawn = () => (
  <Section id="brains" icon={Brain} kicker="Chapter 2" title="Growth needs brains. (And decent Wi‑Fi)">
    <p>
      Ideas scale. Smokestacks don’t. We map R&D to growth to find places where cleverness
      compounds.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">R&D (% GDP) vs Real GDP growth</h3>
        <div className="h-64">
          <ScatterRndVsGrowth />
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          Put talent where the ideas budget isn’t just a press release. High R&D ecosystems amplify
          skilled people — and margins.
        </p>
      </Card>
    </div>
  </Section>
);

const Limits = () => (
  <Section id="limits" icon={Leaf} kicker="Chapter 3" title="Growth has limits. Math says hi.">
    <p>
      Infinite curves are cute until the planet disagrees. We look for decoupling — more value, less
      damage — and build hiring that supports it.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">Index: GDP vs CO₂ (2000 = 100)</h3>
        <div className="h-64">
          <GDPVsCO2AreaChart />
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          Decoupling isn’t magic; it’s policy + technology + better choices. We prioritise sectors
          where output rises and footprints drop.
        </p>
      </Card>
    </div>
  </Section>
);

const PeopleFlows = () => (
  <Section id="people" icon={Users} kicker="Chapter 4" title="Growth is people. Borders are paperwork.">
    <p>
      Europe runs on human movement. We make it ethical, legal, and pleasantly uneventful.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">Indicative mobility routes (scaled)</h3>
        <div className="h-64">
          <MobilityBarChart />
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          The shortest path between talent and demand is paperwork done right. We handle the dull
          bits so Europe keeps moving.
        </p>
      </Card>
    </div>
  </Section>
);

const Balanced = () => (
  <Section id="balanced" icon={LineChart} kicker="Chapter 5" title="Better growth is balanced. (Yes, like a budget)">
    <p>
      More GDP with less inequality is a thing. Rare, but a thing. We aim hiring where the balance is
      feasible — and help make it feasible where it isn’t.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2">GDP growth vs Gini (lower is fairer)</h3>
        <div className="h-64">
          <BalancedScatter />
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-medium mb-2">Takeaway</h3>
        <p className="text-slate-700">
          Growth that actually lands in people’s lives is the only kind that lasts. We optimise for
          durable demand — not quarterly applause.
        </p>
      </Card>
    </div>
  </Section>
);

const Services = () => (
  <Section id="services" icon={Map} kicker="Chapter 6" title="What we actually do (apart from tidy charts)">
    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Brain className="w-5 h-5" /><h4 className="font-medium">Market Intelligence</h4></div>
          <p className="text-slate-700">World‑Bank‑powered dashboards that find where talent meets demand — without the guesswork.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5" /><h4 className="font-medium">Ethical Mobility</h4></div>
          <p className="text-slate-700">Recruitment, compliance, visas. Legal, boring, effective — the holy trinity.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Factory className="w-5 h-5" /><h4 className="font-medium">Sector Pipelines</h4></div>
          <p className="text-slate-700">Building repeatable hiring for logistics, seasonal, and clean‑industry roles.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Leaf className="w-5 h-5" /><h4 className="font-medium">Sustainability by Design</h4></div>
          <p className="text-slate-700">Prioritising decoupling sectors: more output, less footprint, fewer headaches.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><LineChart className="w-5 h-5" /><h4 className="font-medium">Custom Visual Essays</h4></div>
          <p className="text-slate-700">We’ll tailor this dissertation to your boardroom. Bring questions; we’ll bring receipts.</p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Map className="w-5 h-5" /><h4 className="font-medium">Partner Programs</h4></div>
          <p className="text-slate-700">Licensed local partners for leasing; direct placements where it’s simpler. Sensible beats flashy.</p>
        </Card>
      </li>
    </ul>
  </Section>
);

// --- Page shell ----------------------------------------------
export default function BetterGrowthHomepage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <UnevenGrowth />
      <BrainsNotBrawn />
      <Limits />
      <PeopleFlows />
      <Balanced />
      <Services />
      <footer className="border-y border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-700 text-center space-y-2">
          <p className="font-medium tracking-wide uppercase">© 2025 UAB Skillaxis — We measure twice; Europe grows once.</p>
          <p className="text-slate-600">A visual dissertation of better growth, built on data, shipped with taste.</p>
        </div>
      </footer>
    </div>
  );
}
