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

// Shared palette for multi-series visuals
const DEFAULT_SERIES_COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
  "#fb7185",
  "#eab308",
];

type MultiLineSeries = {
  id: string;
  label: string;
  color: string;
  values: LineDatum[];
};

function MultiLineChartSvg({
  series,
  width = 520,
  height = 320,
  valueFormatter,
}: {
  series: MultiLineSeries[];
  width?: number;
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  const margin = { top: 32, right: 24, bottom: 44, left: 64 };
  const populated = series.filter((s) => s.values.length);

  if (!populated.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full">
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
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

  const points = populated.flatMap((s) => s.values);
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;
  const xTicks = Array.from({ length: 5 }, (_, i) => minX + (i / 4) * xRange);
  const yTicks = Array.from({ length: 5 }, (_, i) => minY + (i / 4) * yRange);

  const scaleX = (x: number) => margin.left + ((x - minX) / (xRange || 1)) * innerWidth;
  const scaleY = (y: number) => margin.top + innerHeight - ((y - minY) / (yRange || 1)) * innerHeight;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full">
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
      />
      {xTicks.map((tick, idx) => {
        const x = scaleX(tick);
        return <line key={`x-grid-${idx}`} x1={x} x2={x} y1={margin.top} y2={height - margin.bottom} stroke="rgba(226,232,240,0.55)" />;
      })}
      {yTicks.map((tick, idx) => {
        const y = scaleY(tick);
        return <line key={`y-grid-${idx}`} x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke="rgba(226,232,240,0.55)" />;
      })}
      {populated.map((serie) => {
        const d = serie.values
          .map((point, index) => `${index === 0 ? "M" : "L"}${scaleX(point.x).toFixed(2)},${scaleY(point.y).toFixed(2)}`)
          .join(" ");
        const latest = serie.values[serie.values.length - 1];
        return (
          <g key={serie.id}>
            <path d={d} fill="none" stroke={serie.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={scaleX(latest.x)} cy={scaleY(latest.y)} r={4.5} fill={serie.color} />
          </g>
        );
      })}
      {xTicks.map((tick) => {
        const x = scaleX(tick);
        return (
          <text key={`x-label-${tick}`} x={x} y={height - margin.bottom + 18} fontSize={11} textAnchor="middle" fill="#475569">
            {Math.round(tick).toString()}
          </text>
        );
      })}
      {yTicks.map((tick) => {
        const y = scaleY(tick);
        return (
          <text
            key={`y-label-${tick}`}
            x={margin.left - 12}
            y={y}
            fontSize={11}
            textAnchor="end"
            alignmentBaseline="middle"
            fill="#475569"
          >
            {valueFormatter ? valueFormatter(tick) : Math.round(tick).toLocaleString()}
          </text>
        );
      })}
    </svg>
  );
}

type BarDatum = { label: string; value: number; color?: string };

function VerticalBarChartSvg({
  data,
  width = 520,
  height = 320,
  valueFormatter,
}: {
  data: BarDatum[];
  width?: number;
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  const margin = { top: 32, right: 24, bottom: 80, left: 72 };
  if (!data.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full">
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
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

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const barWidth = innerWidth / sorted.length;
  const maxValue = Math.max(...sorted.map((d) => d.value));
  const yTicks = Array.from({ length: 5 }, (_, i) => (i / 4) * maxValue);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full">
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
      />
      {yTicks.map((tick, idx) => {
        const y = margin.top + innerHeight - ((tick / (maxValue || 1)) * innerHeight || 0);
        return <line key={`y-grid-${idx}`} x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke="rgba(226,232,240,0.55)" />;
      })}
      {sorted.map((datum, idx) => {
        const x = margin.left + idx * barWidth;
        const barHeight = ((datum.value / (maxValue || 1)) * innerHeight || 0);
        const y = margin.top + innerHeight - barHeight;
        return (
          <g key={datum.label}>
            <rect
              x={x + barWidth * 0.1}
              y={y}
              width={barWidth * 0.8}
              height={barHeight}
              rx={6}
              fill={datum.color ?? "#1d4ed8"}
              opacity={0.85}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              fontSize={11}
              textAnchor="middle"
              fill="#1f2937"
            >
              {valueFormatter ? valueFormatter(datum.value) : Math.round(datum.value).toLocaleString()}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - margin.bottom + 32}
              transform={`rotate(-45 ${x + barWidth / 2} ${height - margin.bottom + 32})`}
              fontSize={11}
              textAnchor="end"
              fill="#475569"
            >
              {datum.label}
            </text>
          </g>
        );
      })}
      {yTicks.map((tick) => {
        const y = margin.top + innerHeight - ((tick / (maxValue || 1)) * innerHeight || 0);
        return (
          <text
            key={`y-label-${tick}`}
            x={margin.left - 14}
            y={y}
            fontSize={11}
            alignmentBaseline="middle"
            textAnchor="end"
            fill="#475569"
          >
            {valueFormatter ? valueFormatter(tick) : Math.round(tick).toLocaleString()}
          </text>
        );
      })}
    </svg>
  );
}

type BandSeries = { upper: LineDatum[]; lower: LineDatum[] };

function BandAreaChartSvg({
  band,
  width = 720,
  height = 320,
  valueFormatter,
}: {
  band: BandSeries;
  width?: number;
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  const margin = { top: 32, right: 24, bottom: 44, left: 72 };
  const { upper, lower } = band;
  if (!upper.length || !lower.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full">
        <rect
          x={margin.left}
          y={margin.top}
          width={width - margin.left - margin.right}
          height={height - margin.top - margin.bottom}
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

  const points = [...upper, ...lower];
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  const scaleX = (x: number) => margin.left + ((x - minX) / (xRange || 1)) * innerWidth;
  const scaleY = (y: number) => margin.top + innerHeight - ((y - minY) / (yRange || 1)) * innerHeight;

  const areaPath = upper
    .map((point, index) => `${index === 0 ? "M" : "L"}${scaleX(point.x).toFixed(2)},${scaleY(point.y).toFixed(2)}`)
    .join(" ");
  const lowerPath = lower
    .slice()
    .reverse()
    .map((point) => `L${scaleX(point.x).toFixed(2)},${scaleY(point.y).toFixed(2)}`)
    .join(" ");

  const xTicks = Array.from({ length: 5 }, (_, i) => minX + (i / 4) * xRange);
  const yTicks = Array.from({ length: 5 }, (_, i) => minY + (i / 4) * yRange);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full">
      <rect
        x={margin.left}
        y={margin.top}
        width={innerWidth}
        height={innerHeight}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
      />
      <path d={`${areaPath} ${lowerPath} Z`} fill="rgba(37, 99, 235, 0.18)" stroke="none" />
      <path d={areaPath} fill="none" stroke="#1d4ed8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={lower
          .map((point, index) => `${index === 0 ? "M" : "L"}${scaleX(point.x).toFixed(2)},${scaleY(point.y).toFixed(2)}`)
          .join(" ")}
        fill="none"
        stroke="#0369a1"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {xTicks.map((tick) => {
        const x = scaleX(tick);
        return (
          <text key={`x-label-${tick}`} x={x} y={height - margin.bottom + 18} fontSize={11} textAnchor="middle" fill="#475569">
            {Math.round(tick).toString()}
          </text>
        );
      })}
      {yTicks.map((tick) => {
        const y = scaleY(tick);
        return (
          <text
            key={`y-label-${tick}`}
            x={margin.left - 14}
            y={y}
            fontSize={11}
            alignmentBaseline="middle"
            textAnchor="end"
            fill="#475569"
          >
            {valueFormatter ? valueFormatter(tick) : Math.round(tick).toLocaleString()}
          </text>
        );
      })}
    </svg>
  );
}

const ChartCard: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, actions, className = "", children }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-100px" }}
    className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
  >
    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex-shrink-0 text-sm text-slate-600">{actions}</div> : null}
    </div>
    <div className="mt-4">{children}</div>
  </motion.div>
);

// -----------------------------
// Section Components
// -----------------------------

// 1) Promise of Growth — interactive convergence studio
const PromiseOfGrowth: React.FC = () => {
  type OpportunityRecord = {
    country: string;
    score: number;
    g: number;
    i: number;
    u: number;
    g_years: string;
    i_year: number;
    u_year: number;
  };

  type NarrativeSnapshot = {
    iso3: string;
    country_name?: string;
    facts_used?: Array<{ code: string; value?: number; year?: number }>;
  };

  type CountrySeries = {
    iso3: string;
    name: string;
    latestValue?: number;
    growthRate: number;
    startYear: number;
    endYear: number;
    values: LineDatum[];
  };

  const [opportunity, setOpportunity] = useState<OpportunityRecord[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, NarrativeSnapshot>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [customSelection, setCustomSelection] = useState<string[]>([]);
  const [indexedView, setIndexedView] = useState(false);
  const [pickerValue, setPickerValue] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [opportunityRes, indexRes] = await Promise.all([
          fetch("/data/v1/ch1_opportunity.json"),
          fetch("/data/v1/index.json"),
        ]);
        if (!opportunityRes.ok) throw new Error("Failed to load opportunity dataset");
        if (!indexRes.ok) throw new Error("Failed to load index dataset");
        const [opportunityJson, indexJson] = await Promise.all([
          opportunityRes.json(),
          indexRes.json(),
        ]);
        if (cancelled) return;
        const records = Array.isArray(opportunityJson) ? (opportunityJson as OpportunityRecord[]) : [];
        setOpportunity(records);

        const countryEntries: Array<{ iso3: string; path: string }> = Array.isArray(indexJson?.countries)
          ? (indexJson.countries as Array<{ iso3: string; files?: { narrative?: string } }>).
              map((entry) => ({ iso3: entry.iso3, path: entry.files?.narrative ?? "" }))
              .filter((entry) => entry.path)
          : [];

        const neededIso = new Set(records.map((record) => record.country));
        const relevantEntries = countryEntries.filter((entry) => neededIso.has(entry.iso3));

        const narrativePairs = await Promise.all(
          relevantEntries.map(async (entry) => {
            try {
              const res = await fetch(entry.path);
              if (!res.ok) throw new Error(`Failed to load narrative for ${entry.iso3}`);
              const json = (await res.json()) as NarrativeSnapshot;
              return [entry.iso3, json] as const;
            } catch (err) {
              console.warn(err);
              return [entry.iso3, { iso3: entry.iso3 }] as const;
            }
          }),
        );
        if (cancelled) return;
        setSnapshots(Object.fromEntries(narrativePairs));
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(err instanceof Error ? err.message : "Failed to load chapter data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const seriesList = useMemo<CountrySeries[]>(() => {
    if (!opportunity.length) return [];
    return opportunity
      .reduce<CountrySeries[]>((acc, record) => {
        const narrative = snapshots[record.country];
        const gdpFact = narrative?.facts_used?.find((fact) => fact.code === "NY.GDP.PCAP.KD");
        const latestValue = gdpFact?.value;
        const [startYear, endYear] = (() => {
          const match = record.g_years?.split(/–|-/);
          if (match?.length === 2) {
            const start = Number(match[0].replace(/[^0-9]/g, ""));
            const end = Number(match[1].replace(/[^0-9]/g, ""));
            if (!Number.isNaN(start) && !Number.isNaN(end) && end > start) {
              return [start, end] as const;
            }
          }
          return [2015, 2024] as const;
        })();
        const span = endYear - startYear;
        const growthRate = Number.isFinite(record.g) ? record.g / 100 : 0;
        if (!latestValue || span <= 0) {
          return acc;
        }
        const base = latestValue / Math.pow(1 + growthRate, span);
        const values: LineDatum[] = [];
        for (let year = startYear; year <= endYear; year++) {
          const yearsSinceStart = year - startYear;
          const value = base * Math.pow(1 + growthRate, yearsSinceStart);
          values.push({ x: year, y: Number(value.toFixed(2)) });
        }
        acc.push({
          iso3: record.country,
          name: narrative?.country_name ?? record.country,
          latestValue,
          growthRate,
          startYear,
          endYear,
          values,
        });
        return acc;
      }, [])
      .sort((a, b) => b.growthRate - a.growthRate);
  }, [opportunity, snapshots]);

  const colorByIso = useMemo(() => {
    const map = new Map<string, string>();
    seriesList.forEach((series, idx) => {
      map.set(series.iso3, DEFAULT_SERIES_COLORS[idx % DEFAULT_SERIES_COLORS.length]);
    });
    return map;
  }, [seriesList]);

  const skylineData = useMemo(
    () =>
      [...seriesList]
        .filter((series) => Number.isFinite(series.latestValue))
        .sort((a, b) => (b.latestValue ?? 0) - (a.latestValue ?? 0))
        .map((series) => ({
          label: series.name,
          value: series.latestValue ?? 0,
          color: colorByIso.get(series.iso3),
        })),
    [seriesList, colorByIso],
  );

  const skylineGap = useMemo(() => {
    if (!skylineData.length) return null;
    const sorted = [...skylineData].sort((a, b) => b.value - a.value);
    const richest = sorted[0]?.value ?? 0;
    const poorest = sorted[sorted.length - 1]?.value ?? 0;
    if (!richest || !poorest) return null;
    return richest / poorest;
  }, [skylineData]);

  useEffect(() => {
    if (seriesList.length && customSelection.length === 0) {
      setCustomSelection(seriesList.slice(0, Math.min(3, seriesList.length)).map((series) => series.iso3));
    }
  }, [seriesList, customSelection.length]);

  const rotationOrder = useMemo(() => seriesList.map((series) => series.iso3), [seriesList]);
  const rotationWindow = Math.min(4, rotationOrder.length || 0);

  useEffect(() => {
    if (!rotationOrder.length || rotationWindow === 0) return;
    setRotationIndex(0);
    const interval = window.setInterval(() => {
      setRotationIndex((prev) => (prev + rotationWindow) % rotationOrder.length);
    }, 10000);
    return () => window.clearInterval(interval);
  }, [rotationOrder, rotationWindow]);

  const rotatingIds = useMemo(() => {
    if (!rotationOrder.length) return [] as string[];
    return Array.from({ length: rotationWindow }, (_, offset) => rotationOrder[(rotationIndex + offset) % rotationOrder.length]);
  }, [rotationOrder, rotationIndex, rotationWindow]);

  const rotatingSeries = useMemo(() => {
    return rotatingIds
      .map((iso) => {
        const found = seriesList.find((series) => series.iso3 === iso);
        if (!found) return null;
        return {
          id: found.iso3,
          label: `${found.name} (${(found.growthRate * 100).toFixed(1)}% CAGR)`,
          color: colorByIso.get(found.iso3) ?? DEFAULT_SERIES_COLORS[0],
          values: found.values.map((value) => ({ x: value.x, y: value.y })),
        };
      })
      .filter((entry): entry is MultiLineSeries => Boolean(entry));
  }, [rotatingIds, seriesList, colorByIso]);

  const handleRotate = () => {
    if (!rotationOrder.length) return;
    setRotationIndex((prev) => (prev + rotationWindow) % rotationOrder.length);
  };

  const availableForPicker = useMemo(() => {
    return [...seriesList]
      .filter((series) => !customSelection.includes(series.iso3))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [seriesList, customSelection]);

  const userSeries = useMemo(() => {
    return customSelection
      .map((iso) => {
        const found = seriesList.find((series) => series.iso3 === iso);
        if (!found) return null;
        const base = found.values[0]?.y ?? 1;
        const values = found.values.map((value) => ({
          x: value.x,
          y: indexedView && base ? Number(((value.y / base) * 100).toFixed(2)) : value.y,
        }));
        return {
          id: found.iso3,
          label: found.name,
          color: colorByIso.get(found.iso3) ?? DEFAULT_SERIES_COLORS[0],
          values,
        };
      })
      .filter((entry): entry is MultiLineSeries => Boolean(entry));
  }, [customSelection, seriesList, indexedView, colorByIso]);

  const bandData = useMemo(() => {
    if (seriesList.length < 6) return null;
    const sorted = [...seriesList].sort((a, b) => {
      const baseA = a.values[0]?.y ?? 0;
      const baseB = b.values[0]?.y ?? 0;
      return baseA - baseB;
    });
    const groupSize = Math.min(5, Math.floor(sorted.length / 2));
    if (groupSize <= 0) return null;
    const poorest = sorted.slice(0, groupSize);
    const richest = sorted.slice(-groupSize);
    const years = richest[0]?.values.map((value) => value.x) ?? [];
    if (!years.length) return null;
    const averageSeries = (group: CountrySeries[]) =>
      years.map((year) => {
        const total = group.reduce((sum, series) => {
          const match = series.values.find((value) => value.x === year);
          return sum + (match?.y ?? 0);
        }, 0);
        return { x: year, y: Number((total / group.length).toFixed(2)) };
      });
    const upper = averageSeries(richest);
    const lower = averageSeries(poorest);
    const ratioStart = lower[0]?.y ? upper[0].y / lower[0].y : null;
    const ratioEnd = lower[lower.length - 1]?.y
      ? upper[upper.length - 1].y / lower[lower.length - 1].y
      : null;
    return { upper, lower, ratioStart, ratioEnd };
  }, [seriesList]);

  const formatEuro = (value: number) => `€${formatCompact(Math.round(value))}`;
  const formatIndexed = (value: number) => `${value.toFixed(0)}`;

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Loading chapter visuals">
          <p className="text-sm text-slate-600">We are preparing the convergence panels…</p>
        </ChartCard>
      </div>
    );
  }

  if (error) {
    return (
      <ChartCard title="Unable to load data" subtitle="Chapter 1 dataset">
        <p className="text-sm text-rose-600">{error}</p>
      </ChartCard>
    );
  }

  if (!seriesList.length) {
    return (
      <ChartCard title="No data available">
        <p className="text-sm text-slate-600">The static data bundle is missing GDP per capita snapshots.</p>
      </ChartCard>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <ChartCard
          title="The skyline — GDP per capita (2024)"
          subtitle="Sorts every European economy by its latest GDP per capita level."
        >
          <div className="h-80">
            <VerticalBarChartSvg data={skylineData} valueFormatter={formatEuro} />
          </div>
          {skylineGap ? (
            <p className="mt-4 text-sm text-slate-600">
              The richest country still earns roughly {skylineGap.toFixed(1)}× more per person than the poorest, underscoring why
              level snapshots alone feel so unequal.
            </p>
          ) : null}
        </ChartCard>

        <ChartCard
          title="The slope — rotating cohorts"
          subtitle="Every 10 seconds, a fresh set of economies shows its catch-up path."
          actions={
            <button
              type="button"
              onClick={handleRotate}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
              disabled={!rotationWindow}
            >
              Next countries
            </button>
          }
        >
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            {rotatingSeries.map((series) => (
              <span key={series.id} className="inline-flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                {series.label}
              </span>
            ))}
            {rotatingSeries.length === 0 ? (
              <span className="text-sm text-slate-500">Waiting for cohorts…</span>
            ) : null}
          </div>
          <div className="mt-4 h-80">
            <MultiLineChartSvg series={rotatingSeries} valueFormatter={formatEuro} />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            The message: don’t stare at the skyline. Watch the slope — convergence is a motion story.
          </p>
        </ChartCard>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ChartCard
          className="lg:col-span-2"
          title="The gap — richest vs poorest band"
          subtitle="Average GDP per capita for the top and bottom cohorts, 2015–2024."
        >
          <div className="h-80">
            {bandData ? (
              <BandAreaChartSvg band={{ upper: bandData.upper, lower: bandData.lower }} valueFormatter={formatEuro} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Need at least six comparable countries to form the convergence band.
              </div>
            )}
          </div>
          {bandData?.ratioStart && bandData?.ratioEnd ? (
            <p className="mt-4 text-sm text-slate-600">
              Rich/poor ratio squeezes from {bandData.ratioStart.toFixed(1)}× to {bandData.ratioEnd.toFixed(1)}× across the decade.
            </p>
          ) : null}
        </ChartCard>

        <ChartCard
          className="lg:col-span-2"
          title="Your view — choose any cohort"
          subtitle="Pick up to five countries and toggle between absolute and indexed growth."
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="country-picker" className="text-sm font-medium text-slate-700">
                Add country
              </label>
              <select
                id="country-picker"
                value={pickerValue}
                onChange={(event) => setPickerValue(event.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none"
              >
                <option value="">Select…</option>
                {availableForPicker.map((series) => (
                  <option key={series.iso3} value={series.iso3}>
                    {series.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!pickerValue) return;
                  setCustomSelection((prev) => {
                    if (prev.includes(pickerValue)) return prev;
                    const next = [...prev, pickerValue].slice(0, 5);
                    return next;
                  });
                  setPickerValue("");
                }}
                className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!pickerValue}
              >
                Add
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                checked={indexedView}
                onChange={(event) => setIndexedView(event.target.checked)}
              />
              Indexed view (start year = 100)
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {customSelection.map((iso) => {
              const label = seriesList.find((series) => series.iso3 === iso)?.name ?? iso;
              const color = colorByIso.get(iso) ?? DEFAULT_SERIES_COLORS[0];
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setCustomSelection((prev) => prev.filter((entry) => entry !== iso))}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                  <span aria-hidden>×</span>
                </button>
              );
            })}
            {customSelection.length === 0 ? (
              <span className="text-sm text-slate-500">Select up to five countries to draw your own comparison.</span>
            ) : null}
          </div>
          <div className="mt-4 h-80">
            <MultiLineChartSvg
              series={userSeries}
              valueFormatter={indexedView ? formatIndexed : formatEuro}
            />
          </div>
        </ChartCard>
      </div>
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
