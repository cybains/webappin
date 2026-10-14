"use client";

import React, { useId } from "react";
import gdpData from "@/data/homepage-gdp.json";

const gdpPerCapitaEU = gdpData.rows;

const createLinearScale = (domain: [number, number], range: [number, number]) => {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d0 === d1) {
    return () => (r0 + r1) / 2;
  }
  return (value: number) => r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
};

const formatDollarThousands = (value: number) => `US$${(value / 1000).toFixed(0)}k`;

export const GDPPerCapitaChart = () => {
  const titleId = useId();
  const descriptionId = useId();
  const width = 620;
  const height = 240;
  const margin = { top: 20, right: 20, bottom: 44, left: 64 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const years = gdpPerCapitaEU.map((d) => d.year);
  const yearTicks = years.filter((year) => year % 5 === 0 || year === gdpData.endYear);
  const values = gdpPerCapitaEU.flatMap((d) => [d.AT, d.DE, d.PL, d.RO]);
  const xScale = createLinearScale([Math.min(...years), Math.max(...years)], [0, innerWidth]);
  const yMax = Math.ceil(Math.max(...values) / 10000) * 10000;
  const yScale = createLinearScale([0, yMax], [innerHeight, 0]);

  const colorByKey: Record<string, string> = {
    AT: "#1d4ed8",
    DE: "#16a34a",
    PL: "#f97316",
    RO: "#9333ea",
  };

  const yTicks = Array.from({ length: yMax / 10000 + 1 }, (_, i) => i * 10000);

  return (
    <figure className="flex h-full w-full flex-col">
      <figcaption className="mb-1 text-xs text-slate-600">
        GDP per capita · {gdpData.unit} · {gdpData.startYear}–{gdpData.endYear}
      </figcaption>
    <svg viewBox={`0 0 ${width} ${height}`} className="min-h-0 w-full flex-1" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
      <title id={titleId}>{`GDP per capita in Austria, Germany, Poland and Romania, ${gdpData.startYear}–${gdpData.endYear}`}</title>
      <desc id={descriptionId}>Annual World Bank data in constant 2015 US dollars, adjusted for inflation. The vertical axis starts at zero. Economic context, not wages or a measure of hiring availability. Exact figures follow in a table.</desc>
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
        {yearTicks.map((year) => (
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
            {formatDollarThousands(tick)}
          </text>
        ))}

        {yearTicks.map((year) => (
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
      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
        Source: <a href={gdpData.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">World Bank WDI</a> · CC BY 4.0 · Retrieved {gdpData.retrievedAt.slice(0, 10)}.
        {" "}Inflation-adjusted US dollars; not wages or purchasing-power-adjusted figures.
      </p>
      <table className="sr-only">
        <caption>GDP per capita, {gdpData.unit}. Source: World Bank World Development Indicators.</caption>
        <thead><tr><th scope="col">Year</th>{gdpData.countries.map(country => <th key={country.code} scope="col">{country.name}</th>)}</tr></thead>
        <tbody>{gdpPerCapitaEU.map(row => <tr key={row.year}><th scope="row">{row.year}</th>{gdpData.countries.map(country => <td key={country.code}>{(row as Record<string, number>)[country.code].toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>)}</tr>)}</tbody>
      </table>
    </figure>
  );
};
