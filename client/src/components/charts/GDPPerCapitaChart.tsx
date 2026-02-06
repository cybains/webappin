"use client";

import React, { useMemo } from "react";

const gdpPerCapitaEU = [
  { year: 2000, AT: 28000, DE: 25500, PL: 12500, RO: 8000 },
  { year: 2005, AT: 34000, DE: 31000, PL: 16000, RO: 10500 },
  { year: 2010, AT: 42000, DE: 39500, PL: 22000, RO: 14500 },
  { year: 2015, AT: 47000, DE: 44000, PL: 27000, RO: 19500 },
  { year: 2020, AT: 52000, DE: 50000, PL: 31500, RO: 24500 },
  { year: 2024, AT: 56000, DE: 54000, PL: 35500, RO: 28500 },
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

export const GDPPerCapitaChart = () => {
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
