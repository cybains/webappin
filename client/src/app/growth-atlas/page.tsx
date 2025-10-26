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
// Data layer placeholder
// -----------------------------

// Data loading hooks will live alongside the visual components once the Chapter 1 pack is wired in.

// -----------------------------
// Chart helpers
// -----------------------------

function formatYear(tick: number) {
  return String(tick);
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

function mapLinePoints(points: LineDatum[], width: number, height: number, margin: number) {
  if (!points.length) return [] as Array<LineDatum & { px: number; py: number }>;
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

  return points.map((point) => {
    const px = margin + ((point.x - minX) / xRange) * usableWidth;
    const py = height - margin - ((point.y - minY) / yRange) * usableHeight;
    return { ...point, px, py };
  });
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

type BarDatum = { label: string; value: number; color?: string };

function BarChartSvg({
  data,
  width = 420,
  height = 280,
  accent = "#0ea5e9",
  yLabel,
  valueFormatter = (value: number) => `${Math.round(value).toLocaleString()}`,
}: {
  data: BarDatum[];
  width?: number;
  height?: number;
  accent?: string;
  yLabel?: string;
  valueFormatter?: (value: number) => string;
}) {
  const margin = 48;
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

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const usableWidth = width - margin * 2;
  const usableHeight = height - margin * 2;
  const barGap = usableWidth / data.length;
  const barWidth = Math.min(48, barGap * 0.7);

  const yTicks = Array.from({ length: 4 }, (_, i) => (i / 3) * maxValue);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[22rem] w-full">
      <rect
        x={margin}
        y={margin}
        width={usableWidth}
        height={usableHeight}
        rx={16}
        fill="rgba(148, 163, 184, 0.06)"
        stroke="#e2e8f0"
      />
      <line
        x1={margin}
        y1={height - margin}
        x2={width - margin}
        y2={height - margin}
        stroke="#cbd5f5"
        strokeWidth={1.25}
      />
      {yTicks.map((tick) => {
        const y = height - margin - (tick / (maxValue || 1)) * usableHeight;
        return (
          <g key={`y-${tick}`}>
            <line x1={margin} y1={y} x2={width - margin} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
            <text
              x={margin - 10}
              y={y}
              fontSize={11}
              textAnchor="end"
              alignmentBaseline="middle"
              fill="#475569"
            >
              {valueFormatter(tick)}
            </text>
          </g>
        );
      })}
      {data.map((entry, index) => {
        const barHeight = (entry.value / (maxValue || 1)) * usableHeight;
        const x = margin + index * barGap + (barGap - barWidth) / 2;
        const y = height - margin - barHeight;
        return (
          <g key={entry.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={8}
              fill={entry.color ?? accent}
              opacity={index === 0 || index === data.length - 1 ? 1 : 0.9}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              fontSize={12}
              textAnchor="middle"
              fill="#0f172a"
              fontWeight={600}
            >
              {valueFormatter(entry.value)}
            </text>
            <text x={x + barWidth / 2} y={height - margin + 18} fontSize={12} textAnchor="middle" fill="#475569">
              {entry.label}
            </text>
          </g>
        );
      })}
      {yLabel ? (
        <text transform={`translate(14 ${height / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="#475569">
          {yLabel}
        </text>
      ) : null}
    </svg>
  );
}

type MultiLineSeries = {
  id: string;
  color: string;
  data: LineDatum[];
};

function MultiLineChartSvg({
  series,
  width = 420,
  height = 260,
  xLabel,
  yLabel,
  formatter,
  showDots = true,
}: {
  series: MultiLineSeries[];
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  formatter?: (value: number) => string;
  showDots?: boolean;
}) {
  const margin = 44;
  const flattened = series.flatMap((s) => s.data);
  if (!flattened.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
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

  const xs = flattened.map((point) => point.x);
  const ys = flattened.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const usableWidth = width - margin * 2;
  const usableHeight = height - margin * 2;
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  const xTicks = Array.from({ length: 4 }, (_, i) => Math.round(minX + (i / 3) * xRange));
  const yTicks = Array.from({ length: 4 }, (_, i) => minY + (i / 3) * yRange);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[20rem] w-full">
      <rect
        x={margin}
        y={margin}
        width={usableWidth}
        height={usableHeight}
        rx={16}
        fill="rgba(148, 163, 184, 0.06)"
        stroke="#e2e8f0"
      />
      <line
        x1={margin}
        y1={height - margin}
        x2={width - margin}
        y2={height - margin}
        stroke="#cbd5f5"
        strokeWidth={1.25}
      />
      {xTicks.map((tick) => {
        const x = margin + ((tick - minX) / (xRange || 1)) * usableWidth;
        return (
          <g key={`x-${tick}`}>
            <line x1={x} y1={margin} x2={x} y2={height - margin} stroke="#e2e8f0" strokeDasharray="4 6" />
            <text x={x} y={height - margin + 18} fontSize={11} textAnchor="middle" fill="#475569">
              {formatYear(tick)}
            </text>
          </g>
        );
      })}
      {yTicks.map((tick) => {
        const y = height - margin - ((tick - minY) / (yRange || 1)) * usableHeight;
        return (
          <g key={`y-${tick}`}>
            <line x1={margin} y1={y} x2={width - margin} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
            <text
              x={margin - 10}
              y={y}
              fontSize={11}
              textAnchor="end"
              alignmentBaseline="middle"
              fill="#475569"
            >
              {formatter ? formatter(tick) : Math.round(tick).toLocaleString()}
            </text>
          </g>
        );
      })}
      {series.map((line) => {
        const path = buildLinePath(line.data, width, height, margin);
        const points = mapLinePoints(line.data, width, height, margin);
        return (
          <g key={line.id}>
            <path d={path} fill="none" stroke={line.color} strokeWidth={2.4} strokeLinecap="round" />
            {showDots
              ? points.map((point) => (
                  <circle key={`${line.id}-${point.x}`} cx={point.px} cy={point.py} r={3.6} fill={line.color} />
                ))
              : null}
          </g>
        );
      })}
      {xLabel ? (
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="#475569">
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text transform={`translate(14 ${height / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="#475569">
          {yLabel}
        </text>
      ) : null}
    </svg>
  );
}

function BandChartSvg({
  upper,
  lower,
  width = 420,
  height = 260,
  fill = "rgba(56, 189, 248, 0.25)",
  strokeUpper = "#0ea5e9",
  strokeLower = "#22c55e",
  xLabel,
  yLabel,
  formatter,
}: {
  upper: LineDatum[];
  lower: LineDatum[];
  width?: number;
  height?: number;
  fill?: string;
  strokeUpper?: string;
  strokeLower?: string;
  xLabel?: string;
  yLabel?: string;
  formatter?: (value: number) => string;
}) {
  const margin = 44;
  const flattened = [...upper, ...lower];
  if (!flattened.length) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
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

  const xs = flattened.map((point) => point.x);
  const ys = flattened.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const usableWidth = width - margin * 2;
  const usableHeight = height - margin * 2;
  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;

  const xTicks = Array.from({ length: 4 }, (_, i) => Math.round(minX + (i / 3) * xRange));
  const yTicks = Array.from({ length: 4 }, (_, i) => minY + (i / 3) * yRange);

  const upperPoints = mapLinePoints(upper, width, height, margin);
  const lowerPoints = mapLinePoints(lower, width, height, margin);
  const areaPath = [
    upperPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point.px.toFixed(2)},${point.py.toFixed(2)}`).join(" "),
    lowerPoints
      .slice()
      .reverse()
      .map((point) => `L${point.px.toFixed(2)},${point.py.toFixed(2)}`)
      .join(" "),
    "Z",
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[20rem] w-full">
      <rect
        x={margin}
        y={margin}
        width={usableWidth}
        height={usableHeight}
        rx={16}
        fill="rgba(148, 163, 184, 0.06)"
        stroke="#e2e8f0"
      />
      <line
        x1={margin}
        y1={height - margin}
        x2={width - margin}
        y2={height - margin}
        stroke="#cbd5f5"
        strokeWidth={1.25}
      />
      {xTicks.map((tick) => {
        const x = margin + ((tick - minX) / (xRange || 1)) * usableWidth;
        return (
          <g key={`band-x-${tick}`}>
            <line x1={x} y1={margin} x2={x} y2={height - margin} stroke="#e2e8f0" strokeDasharray="4 6" />
            <text x={x} y={height - margin + 18} fontSize={11} textAnchor="middle" fill="#475569">
              {formatYear(tick)}
            </text>
          </g>
        );
      })}
      {yTicks.map((tick) => {
        const y = height - margin - ((tick - minY) / (yRange || 1)) * usableHeight;
        return (
          <g key={`band-y-${tick}`}>
            <line x1={margin} y1={y} x2={width - margin} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
            <text
              x={margin - 10}
              y={y}
              fontSize={11}
              textAnchor="end"
              alignmentBaseline="middle"
              fill="#475569"
            >
              {formatter ? formatter(tick) : Math.round(tick).toLocaleString()}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill={fill} stroke="none" />
      <path d={buildLinePath(upper, width, height, margin)} fill="none" stroke={strokeUpper} strokeWidth={2.4} />
      <path d={buildLinePath(lower, width, height, margin)} fill="none" stroke={strokeLower} strokeWidth={2.4} />
      {xLabel ? (
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="#475569">
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text transform={`translate(14 ${height / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="#475569">
          {yLabel}
        </text>
      ) : null}
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

// 1) Promise of Growth — fully sketched Chapter 1 visuals
const palette = ["#0ea5e9", "#f97316", "#22c55e", "#6366f1", "#ec4899", "#14b8a6", "#9333ea", "#facc15", "#06b6d4", "#ef4444"];

export const PromiseOfGrowth: React.FC = () => {
  const skylineData = useMemo(
    () => [
      { label: "Lux", value: 134_000 },
      { label: "Irl", value: 103_000 },
      { label: "Nld", value: 57_500 },
      { label: "Deu", value: 52_000 },
      { label: "Esp", value: 40_000 },
      { label: "Pol", value: 35_700 },
      { label: "Rou", value: 32_900 },
      { label: "Bgr", value: 27_500 },
    ],
    [],
  );

  const skylineFormatter = (value: number) => `€${Math.round(value / 1000)}k`;
  const richest = skylineData[0];
  const poorest = skylineData[skylineData.length - 1];
  const skylineGap = richest.value - poorest.value;
  const skylineRatio = richest.value / (poorest.value || 1);

  const slopeYears = useMemo(() => [2000, 2005, 2010, 2015, 2020, 2023], []);
  const slopeSeriesRaw = useMemo(
    () =>
      [
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
      ],
    [slopeYears],
  );

  const colorMap = useMemo(() => {
    const mapping: Record<string, string> = {};
    slopeSeriesRaw.forEach((series, index) => {
      mapping[series.id] = palette[index % palette.length];
    });
    return mapping;
  }, [slopeSeriesRaw]);

  const slopeCohorts = useMemo(
    () => [
      ["Luxembourg", "Ireland", "Netherlands", "Germany"],
      ["Spain", "Portugal", "Greece", "Czechia"],
      ["Poland", "Romania", "Bulgaria", "Estonia"],
    ],
    [],
  );

  const [cohortIndex, setCohortIndex] = useState(0);

  useEffect(() => {
    if (!slopeCohorts.length) return;
    const timer = window.setInterval(() => {
      setCohortIndex((prev) => (prev + 1) % slopeCohorts.length);
    }, 10_000);
    return () => window.clearInterval(timer);
  }, [slopeCohorts.length]);

  const activeSeries = useMemo(() => {
    if (!slopeCohorts.length) return [] as MultiLineSeries[];
    const current = slopeCohorts[cohortIndex % slopeCohorts.length];
    return current
      .map((id) => {
        const series = slopeSeriesRaw.find((entry) => entry.id === id);
        if (!series) return null;
        return { id: series.id, color: colorMap[series.id], data: series.data };
      })
      .filter(Boolean) as MultiLineSeries[];
  }, [cohortIndex, slopeCohorts, slopeSeriesRaw, colorMap]);

  const richCohort = useMemo(() => ["Luxembourg", "Ireland", "Germany"], []);
  const poorCohort = useMemo(() => ["Poland", "Romania", "Bulgaria"], []);

  const bandSeries = useMemo(() => {
    if (!slopeSeriesRaw.length) {
      return { upper: [] as LineDatum[], lower: [] as LineDatum[], ratios: [] as Array<{ year: number; ratio: number }> };
    }
    const referenceYears = slopeSeriesRaw[0].data.map((point) => point.x);
    const lookup = new Map(slopeSeriesRaw.map((series) => [series.id, series.data]));
    const upper: LineDatum[] = [];
    const lower: LineDatum[] = [];
    const ratios: Array<{ year: number; ratio: number }> = [];

    referenceYears.forEach((year, index) => {
      const upperAvg =
        richCohort.reduce((sum, id) => sum + (lookup.get(id)?.[index]?.y ?? 0), 0) / (richCohort.length || 1);
      const lowerAvg =
        poorCohort.reduce((sum, id) => sum + (lookup.get(id)?.[index]?.y ?? 0), 0) / (poorCohort.length || 1);
      upper.push({ x: year, y: Number(upperAvg.toFixed(0)) });
      lower.push({ x: year, y: Number(lowerAvg.toFixed(0)) });
      ratios.push({ year, ratio: upperAvg / (lowerAvg || 1) });
    });

    return { upper, lower, ratios };
  }, [poorCohort, richCohort, slopeSeriesRaw]);

  const firstRatio = bandSeries.ratios[0]?.ratio ?? 0;
  const latestRatio = bandSeries.ratios[bandSeries.ratios.length - 1]?.ratio ?? 0;

  const availableCountries = useMemo(() => slopeSeriesRaw.map((series) => series.id), [slopeSeriesRaw]);
  const [selectedCountries, setSelectedCountries] = useState(() => ["Ireland", "Poland", "Romania"]);
  const [mode, setMode] = useState<"level" | "indexed">("level");
  const [pendingCountry, setPendingCountry] = useState<string>("Luxembourg");

  useEffect(() => {
    if (!availableCountries.length) return;
    if (!pendingCountry || !availableCountries.includes(pendingCountry)) {
      setPendingCountry(availableCountries[0]);
    }
  }, [availableCountries, pendingCountry]);

  const maxSelections = 5;
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
  }, [selectedCountries, mode, slopeSeriesRaw, transformSeries, colorMap]);

  const formatterForMode = useMemo(() => {
    if (mode === "indexed") {
      return (value: number) => `${Math.round(value)} (2000 = 100)`;
    }
    return (value: number) => `€${Math.round(value / 1000)}k`;
  }, [mode]);

  return (
    <div className="space-y-16">
      <motion.article
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
      >
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Skyline</span>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Levels snapshot</h3>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Start with the classic skyline: GDP per capita ordered richest to poorest. It makes the gulf impossible to ignore—and
          sets the stage for why momentum matters more than this static picture.
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
              {richest.label} tops the skyline at <strong>{skylineFormatter(richest.value)}</strong>, while {poorest.label} closes the ladder at
              <strong> {skylineFormatter(poorest.value)}</strong>.
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

      <motion.article
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
      >
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Slope</span>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Rotating cohorts</h3>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Every ten seconds we rotate four economies into view so readers can compare trajectories. The legend shows the active
          cohort; tap the button to fast-forward.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <MultiLineChartSvg series={activeSeries} xLabel="Year" yLabel="GDP per capita (EUR, PPP)" formatter={(value) => `€${Math.round(value / 1000)}k`} />
          </div>
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700">
                Active cohort
              </span>
              <span className="text-base font-medium text-slate-900 dark:text-white">{slopeCohorts[cohortIndex % slopeCohorts.length].join(" • ")}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {activeSeries.map((series) => (
                <span key={series.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-100">
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

      <motion.article
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
      >
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">Gap</span>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Convergence band</h3>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Averaging the richest and poorest cohorts shades the convergence band. The ratio drops as poorer economies grow faster,
          narrowing the skyline gap.
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
              Rich cohort (Luxembourg, Ireland, Germany) vs. poorer cohort (Poland, Romania, Bulgaria). Ratio shrinks from
              <strong> {firstRatio.toFixed(1)}×</strong> at the start of the century to <strong>{latestRatio.toFixed(1)}×</strong> today.
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

      <motion.article
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
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
            <MultiLineChartSvg series={yourViewSeries} xLabel="Year" yLabel={mode === "indexed" ? "Index (base year = 100)" : "GDP per capita (EUR, PPP)"} formatter={formatterForMode} />
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
                  {(
                    [
                      { label: "Euro levels", value: "level" as const },
                      { label: "Indexed (2000 = 100)", value: "indexed" as const },
                    ]
                  ).map((option) => (
                    <label key={option.value} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-600 dark:text-slate-100">
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
                  <span key={country} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-100">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorMap[country] }} aria-hidden="true" />
                    {country}
                    <button type="button" onClick={() => handleRemoveCountry(country)} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
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
