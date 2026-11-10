"use client";

import { useTranslation } from "@/lib/i18n/client";

import React, { useMemo } from "react";
import { Brain, Factory, Leaf, LineChart, Map, Users } from "lucide-react";

import { GDPPerCapitaChart } from "@/components/charts/GDPPerCapitaChart";

// ------------------------------------------------------------
// Better Growth — Homepage Dissertation (React)
// Light theme (black on white), witty/dry tone
// Uses mock data placeholders — swap with World Bank API later.
// Includes simple runtime smoke tests for data shape.
// ------------------------------------------------------------

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

const GrowthText = ({text}:{text:string}) => { const {t}=useTranslation(); return <>{t(text)}</>; };

// --- UI primitives -------------------------------------------
const Section = ({ id, icon: Icon, title, kicker, children, lede }: SectionProps) => (
  <section id={id} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {lede && (
      <div className="mb-6 text-base md:text-lg text-slate-600">{typeof lede === "string" ? <GrowthText text={lede} /> : lede}</div>
    )}
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-5 h-5" />
      <p className="uppercase tracking-widest text-xs opacity-70"><GrowthText text={kicker} /></p>
    </div>
    <h2 className="text-2xl md:text-4xl font-semibold mb-4"><GrowthText text={title} /></h2>
    <div className="prose prose-slate max-w-none mb-8">{children}</div>
  </section>
);

const Card = ({ children }: CardProps) => (
  <div className="rounded-2xl border border-slate-200 p-4 md:p-6 shadow-sm bg-white">
    {children}
  </div>
);

const ScatterRndVsGrowth = () => {
  const {t}=useTranslation();
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
    <svg role="img" aria-label={t("Illustrative comparison of research spending and GDP growth")} viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
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
      ><GrowthText text={"R&D spend (% GDP)"} /></text>
      <text
        transform={`translate(12 ${margin.top + innerHeight / 2}) rotate(-90)`}
        textAnchor="middle"
        className="fill-slate-500 text-[10px]"
      ><GrowthText text={"GDP growth (%)"} /></text>
    </svg>
  );
};

const GDPVsCO2AreaChart = () => {
  const {t}=useTranslation();
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
    <svg role="img" aria-label={t("Illustrative GDP and CO₂ index trends")} viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
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
          <text x={16} y={-3}><GrowthText text={"GDP Index"} /></text>
        </g>
        <g className="text-[10px] fill-slate-600" transform="translate(120,-6)">
          <rect width={12} height={4} y={-6} rx={2} fill="#ef4444" />
          <text x={16} y={-3}><GrowthText text={"CO₂ Index"} /></text>
        </g>
      </g>
    </svg>
  );
};

const MobilityBarChart = () => {
  const {t,locale}=useTranslation();
  const width = 620;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 40, left: 52 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxValue = Math.max(...migrationBalance.map((d) => d.people));
  const yScale = createLinearScale([0, maxValue * 1.2], [innerHeight, 0]);
  const barWidth = innerWidth / migrationBalance.length - 16;

  return (
    <svg role="img" aria-label={t("Illustrative migration routes")} viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
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
              {`${tick.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:1})}k`}
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
                {`${route.people.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:1})}k`}
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
  const {t}=useTranslation();
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
    <svg role="img" aria-label={t("Illustrative comparison of GDP growth and inequality")} viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
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
      ><GrowthText text={"GDP growth (%)"} /></text>
      <text
        transform={`translate(12 ${margin.top + innerHeight / 2}) rotate(-90)`}
        textAnchor="middle"
        className="fill-slate-500 text-[10px]"
      ><GrowthText text={"Gini (lower is fairer)"} /></text>
    </svg>
  );
};

const UnevenGrowth = () => (
  <Section
    id="uneven"
    icon={Factory}
    kicker="Chapter 1"
    title="Growth is uneven. Your strategy shouldn’t be."
    lede="Economy, without the drama: what matters, measured — and a direction worth growing toward."
  >
    <p><GrowthText text={"Some regions sprint. Others tie their shoes for twenty years. The chart maps the divergence; turning it into convergence is where the work starts."} /></p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2"><GrowthText text={"GDP per capita — selected EU economies"} /></h3>
        <div className="h-64">
          <GDPPerCapitaChart />
        </div>
      </Card>
      <Card>
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Interpretation"} /></p>
            <p className="text-slate-700"><GrowthText text={"Convergence is real — regions with the steepest productivity slopes tend to attract fresh momentum."} /></p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Boundary"} /></p>
            <p className="text-slate-700"><GrowthText text={"This does not claim that every low per-capita economy is immediately ready for scaling."} /></p>
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

const BrainsNotBrawn = () => (
  <Section id="brains" icon={Brain} kicker="Chapter 2" title="Growth needs brains. (And decent Wi‑Fi)">
    <p><GrowthText text={"Ideas scale. Smokestacks plateau. The chart plots R&D against growth to show where cleverness compounds."} /></p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2"><GrowthText text={"R&D (% GDP) vs Real GDP growth"} /></h3>
        <div className="h-64">
          <ScatterRndVsGrowth />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600"><GrowthText text="Illustrative data only — these values demonstrate a relationship, not observed statistics or a hiring forecast." /></p>
      </Card>
      <Card>
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Interpretation"} /></p>
            <p className="text-slate-700"><GrowthText text={"High R&D ecosystems amplify skilled people and expand margin potential when ideas scale."} /></p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Boundary"} /></p>
            <p className="text-slate-700"><GrowthText text={"This is not suggesting R&D spending alone guarantees meaningful outcomes."} /></p>
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

const Limits = () => (
  <Section id="limits" icon={Leaf} kicker="Chapter 3" title="Growth has limits. Math says hi.">
    <p><GrowthText text={"Infinite curves are cute until the planet disagrees. We look for decoupling — more value, less damage — and build hiring that supports it."} /></p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2"><GrowthText text={"Index: GDP vs CO₂ (2000 = 100)"} /></h3>
        <div className="h-64">
          <GDPVsCO2AreaChart />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600"><GrowthText text="Illustrative data only — these values demonstrate a relationship, not observed statistics or a hiring forecast." /></p>
      </Card>
      <Card>
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Interpretation"} /></p>
            <p className="text-slate-700"><GrowthText text={"Decoupling happens when policy, technology, and choices align so output rises while footprints ease."} /></p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Boundary"} /></p>
            <p className="text-slate-700"><GrowthText text={"This analysis does not promise any specific sector will always drop emissions."} /></p>
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

const PeopleFlows = () => (
  <Section id="people" icon={Users} kicker="Chapter 4" title="Growth is people. Borders are paperwork.">
    <p><GrowthText text={"Europe runs on human movement. The work is keeping it legal, ethical, and pleasantly uneventful."} /></p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2"><GrowthText text={"Indicative mobility routes (scaled)"} /></h3>
        <div className="h-64">
          <MobilityBarChart />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600"><GrowthText text="Illustrative data only — these values demonstrate a relationship, not observed statistics or a hiring forecast." /></p>
      </Card>
      <Card>
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Interpretation"} /></p>
            <p className="text-slate-700"><GrowthText text={"When paperwork is tidy and compliant, talent movement remains ethical and predictable."} /></p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Boundary"} /></p>
            <p className="text-slate-700"><GrowthText text={"This is not a promise that any route will be effortless or without jurisdictional effort."} /></p>
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

const Balanced = () => (
  <Section id="balanced" icon={LineChart} kicker="Chapter 5" title="Better growth is balanced. (Yes, like a budget)">
    <p><GrowthText text={"GDP growth with less inequality happens rarely, and this chart shows where. We aim hiring at that balance — and help build it where it’s missing."} /></p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <Card>
        <h3 className="text-lg font-medium mb-2"><GrowthText text={"GDP growth vs Gini (lower is fairer)"} /></h3>
        <div className="h-64">
          <BalancedScatter />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600"><GrowthText text="Illustrative data only — these values demonstrate a relationship, not observed statistics or a hiring forecast." /></p>
      </Card>
      <Card>
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Interpretation"} /></p>
            <p className="text-slate-700"><GrowthText text={"Growth tied to durable demand tends to endure longer than applause-driven spikes."} /></p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500"><GrowthText text={"Boundary"} /></p>
            <p className="text-slate-700"><GrowthText text={"This is not declaring other growth patterns invalid; it simply notes which ones last."} /></p>
          </div>
        </div>
      </Card>
    </div>
  </Section>
);

const Services = () => (
  <Section id="services" icon={Map} kicker="Chapter 6" title="What we actually do (apart from tidy charts)">
    <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Brain className="w-5 h-5" /><h4 className="font-medium"><GrowthText text={"Market Intelligence"} /></h4></div>
          <p className="text-slate-700"><GrowthText text={"World‑Bank‑powered dashboards that find where talent meets demand — without the guesswork."} /></p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5" /><h4 className="font-medium"><GrowthText text={"Ethical Mobility"} /></h4></div>
          <p className="text-slate-700"><GrowthText text={"Recruitment, compliance, visas. Legal, boring, effective — the holy trinity."} /></p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Factory className="w-5 h-5" /><h4 className="font-medium"><GrowthText text={"Sector Pipelines"} /></h4></div>
          <p className="text-slate-700"><GrowthText text={"Building repeatable hiring for logistics, seasonal, and clean‑industry roles."} /></p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Leaf className="w-5 h-5" /><h4 className="font-medium"><GrowthText text={"Sustainability by Design"} /></h4></div>
          <p className="text-slate-700"><GrowthText text={"Prioritising decoupling sectors: more output, less footprint, fewer headaches."} /></p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><LineChart className="w-5 h-5" /><h4 className="font-medium"><GrowthText text={"Custom Visual Essays"} /></h4></div>
          <p className="text-slate-700"><GrowthText text={"We’ll tailor this dissertation to your boardroom. Bring questions; we’ll bring receipts."} /></p>
        </Card>
      </li>
      <li>
        <Card>
          <div className="flex items-center gap-3 mb-2"><Map className="w-5 h-5" /><h4 className="font-medium"><GrowthText text={"Partner Programs"} /></h4></div>
          <p className="text-slate-700"><GrowthText text={"Licensed local partners for leasing; direct placements where it’s simpler. Sensible beats flashy."} /></p>
        </Card>
      </li>
    </ul>
  </Section>
);

export function BetterGrowthChapters() {
  return (
    <>
      <UnevenGrowth />
      <BrainsNotBrawn />
      <Limits />
      <PeopleFlows />
      <Balanced />
    </>
  );
}

export { ScatterRndVsGrowth, GDPVsCO2AreaChart, MobilityBarChart, BalancedScatter };

// --- Page shell ----------------------------------------------
export default function BetterGrowthHomepage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <BetterGrowthChapters />
      <Services />
      <footer className="border-y border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-700 text-center space-y-2">
          <p className="font-medium tracking-wide uppercase"><GrowthText text={"© 2025 UAB Skillaxis — We measure twice; Europe grows once."} /></p>
          <p className="text-slate-600"><GrowthText text={"A visual dissertation of better growth, built on data, shipped with taste."} /></p>
        </div>
      </footer>
    </div>
  );
}
