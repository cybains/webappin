"use client";

import React, { useId } from "react";

type LineDatum = { x: number; y: number };

type ScatterDatum = { x: number; y: number; r?: number; label?: string };

type MultiLineSeries = {
  id: string;
  color?: string;
  data: LineDatum[];
};

function formatYear(tick: number) {
  return String(tick);
}

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

export function LineChartSvg({
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

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.24} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={width} height={height} rx={16} fill="white" className="dark:fill-slate-900" />
      <rect
        x={margin}
        y={margin}
        width={width - margin * 2}
        height={height - margin * 2}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
        className="dark:stroke-slate-700"
      />
      <path d={`${path} L${margin + (width - margin * 2)} ${height - margin} L${margin} ${height - margin} Z`} fill={`url(#${gradientId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
      {mapLinePoints(data, width, height, margin).map((point, index) => (
        <g key={index}>
          <circle cx={point.px} cy={point.py} r={4.5} fill="white" stroke={color} strokeWidth={2} />
          <text x={point.px} y={point.py - 10} textAnchor="middle" fontSize={11} fill="#475569">
            {formatter ? formatter(point.y) : point.y.toFixed(1)}
          </text>
        </g>
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = margin + (1 - ratio) * (height - margin * 2);
        const value = minY + ratio * (maxY - minY);
        return (
          <text key={ratio} x={margin - 12} y={y + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
            {formatter ? formatter(value) : value.toFixed(0)}
          </text>
        );
      })}
      {data.map((point, index) => {
        const x = margin + ((point.x - minX) / xRange) * (width - margin * 2);
        return (
          <text key={index} x={x} y={height - margin + 16} textAnchor="middle" fontSize={11} fill="#94a3b8">
            {formatYear(point.x)}
          </text>
        );
      })}
    </svg>
  );
}

export function MultiLineChartSvg({
  series,
  width = 360,
  height = 240,
  formatter,
  xLabel,
  yLabel,
}: {
  series: Array<{ id: string; color?: string; data: LineDatum[] }>;
  width?: number;
  height?: number;
  formatter?: (value: number) => string;
  xLabel?: string;
  yLabel?: string;
}) {
  const margin = 36;
  const mappedSeries = series.map((line) => ({
    id: line.id,
    color: line.color ?? "#2563eb",
    data: mapLinePoints(line.data, width, height, margin),
  }));

  const ys = mappedSeries.flatMap((line) => line.data.map((point) => point.y));
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const yTicks = 4;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
      <rect x={0} y={0} width={width} height={height} rx={16} fill="white" className="dark:fill-slate-900" />
      <rect
        x={margin}
        y={margin}
        width={width - margin * 2}
        height={height - margin * 2}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
        className="dark:stroke-slate-700"
      />
      {mappedSeries.map((line) => {
        const path = buildLinePath(line.data, width, height, margin);
        return <path key={line.id} d={path} fill="none" stroke={line.color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />;
      })}
      {mappedSeries.map((line) =>
        line.data.map((point, index) => (
          <circle key={`${line.id}-${index}`} cx={point.px} cy={point.py} r={4} fill="white" stroke={line.color} strokeWidth={2} />
        )),
      )}
      {Array.from({ length: yTicks + 1 }).map((_, index) => {
        const ratio = index / yTicks;
        const y = margin + (1 - ratio) * (height - margin * 2);
        const value = minY + ratio * (maxY - minY);
        return (
          <g key={index}>
            <line x1={margin} y1={y} x2={width - margin} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" className="dark:stroke-slate-700" />
            <text x={margin - 12} y={y + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
              {formatter ? formatter(value) : value.toFixed(0)}
            </text>
          </g>
        );
      })}
      {Array.from({ length: series[0]?.data.length ?? 0 }).map((_, index) => {
        const x = margin + (index / ((series[0]?.data.length ?? 1) - 1 || 1)) * (width - margin * 2);
        const value = series[0]?.data[index]?.x ?? 0;
        return (
          <text key={index} x={x} y={height - margin + 16} textAnchor="middle" fontSize={11} fill="#94a3b8">
            {formatYear(value)}
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

export function BandChartSvg({
  upper,
  lower,
  width = 360,
  height = 240,
  formatter,
  fill = "rgba(37, 99, 235, 0.16)",
  strokeUpper = "#2563eb",
  strokeLower = "#22c55e",
  xLabel,
  yLabel,
}: {
  upper: LineDatum[];
  lower: LineDatum[];
  width?: number;
  height?: number;
  formatter?: (value: number) => string;
  fill?: string;
  strokeUpper?: string;
  strokeLower?: string;
  xLabel?: string;
  yLabel?: string;
}) {
  const margin = 36;
  const mappedUpper = mapLinePoints(upper, width, height, margin);
  const mappedLower = mapLinePoints(lower, width, height, margin);

  const xs = [...mappedUpper, ...mappedLower].map((point) => point.x);
  const ys = [...mappedUpper, ...mappedLower].map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const areaPath = `${buildLinePath(mappedUpper, width, height, margin)} ${buildLinePath([...mappedLower].reverse(), width, height, margin)} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
      <rect x={0} y={0} width={width} height={height} rx={16} fill="white" className="dark:fill-slate-900" />
      <rect
        x={margin}
        y={margin}
        width={width - margin * 2}
        height={height - margin * 2}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
        className="dark:stroke-slate-700"
      />
      <path d={areaPath} fill={fill} stroke="none" opacity={0.6} />
      <path d={buildLinePath(upper, width, height, margin)} fill="none" stroke={strokeUpper} strokeWidth={2.4} />
      <path d={buildLinePath(lower, width, height, margin)} fill="none" stroke={strokeLower} strokeWidth={2.4} />
      {Array.from({ length: 5 }).map((_, index) => {
        const ratio = index / 4;
        const y = margin + (1 - ratio) * (height - margin * 2);
        const value = minY + ratio * (maxY - minY);
        return (
          <g key={index}>
            <line x1={margin} y1={y} x2={width - margin} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" className="dark:stroke-slate-700" />
            <text x={margin - 12} y={y + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
              {formatter ? formatter(value) : value.toFixed(0)}
            </text>
          </g>
        );
      })}
      {upper.map((point, index) => {
        const x = margin + ((point.x - minX) / (maxX - minX || 1)) * (width - margin * 2);
        return (
          <text key={index} x={x} y={height - margin + 16} textAnchor="middle" fontSize={11} fill="#94a3b8">
            {formatYear(point.x)}
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

export function BarChartSvg({
  data,
  width = 360,
  height = 240,
  accent = "#0ea5e9",
  valueFormatter,
  yLabel,
}: {
  data: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
  accent?: string;
  valueFormatter?: (value: number) => string;
  yLabel?: string;
}) {
  const margin = 48;
  const barGap = 12;
  const chartHeight = height - margin * 2;
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
      <rect x={0} y={0} width={width} height={height} rx={16} fill="white" className="dark:fill-slate-900" />
      <rect
        x={margin}
        y={margin / 2}
        width={width - margin * 2}
        height={height - margin * 1.5}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
        className="dark:stroke-slate-700"
      />
      {data.map((item, index) => {
        const barWidth = (width - margin * 2 - barGap * (data.length - 1)) / data.length;
        const x = margin + index * (barWidth + barGap);
        const barHeight = (item.value / (maxValue || 1)) * chartHeight;
        const y = height - margin - barHeight;
        return (
          <g key={item.label}>
            <rect x={x} y={y} width={barWidth} height={barHeight} fill={accent} rx={8} />
            <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize={11} fill="#475569">
              {valueFormatter ? valueFormatter(item.value) : item.value.toLocaleString()}
            </text>
            <text x={x + barWidth / 2} y={height - margin + 16} textAnchor="middle" fontSize={11} fill="#475569">
              {item.label}
            </text>
          </g>
        );
      })}
      {yLabel ? (
        <text transform={`translate(16 ${height / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="#475569">
          {yLabel}
        </text>
      ) : null}
    </svg>
  );
}

export function ScatterChartSvg({
  data,
  width = 360,
  height = 240,
  color = "#2563eb",
  xLabel,
  yLabel,
}: {
  data: ScatterDatum[];
  width?: number;
  height?: number;
  color?: string;
  xLabel?: string;
  yLabel?: string;
}) {
  const margin = 48;
  const mapped = mapScatterPoints(data, width, height, margin);
  const xs = mapped.map((point) => point.x);
  const ys = mapped.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
      <rect x={0} y={0} width={width} height={height} rx={16} fill="white" className="dark:fill-slate-900" />
      <rect
        x={margin}
        y={margin}
        width={width - margin * 2}
        height={height - margin * 2}
        rx={12}
        fill="rgba(148, 163, 184, 0.08)"
        stroke="#e2e8f0"
        className="dark:stroke-slate-700"
      />
      {mapped.map((point, index) => (
        <g key={index}>
          <circle cx={point.cx} cy={point.cy} r={point.radius} fill={color} opacity={0.65} />
          {point.label ? (
            <text x={point.cx} y={point.cy - point.radius - 6} textAnchor="middle" fontSize={11} fill="#475569">
              {point.label}
            </text>
          ) : null}
        </g>
      ))}
      {Array.from({ length: 5 }).map((_, index) => {
        const ratio = index / 4;
        const y = margin + (1 - ratio) * (height - margin * 2);
        const value = minY + ratio * (maxY - minY);
        return (
          <g key={index}>
            <line x1={margin} y1={y} x2={width - margin} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" className="dark:stroke-slate-700" />
            <text x={margin - 12} y={y + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
              {value.toFixed(0)}
            </text>
          </g>
        );
      })}
      {Array.from({ length: 5 }).map((_, index) => {
        const ratio = index / 4;
        const x = margin + ratio * (width - margin * 2);
        const value = minX + ratio * (maxX - minX);
        return (
          <text key={index} x={x} y={height - margin + 16} textAnchor="middle" fontSize={11} fill="#94a3b8">
            {value.toFixed(1)}
          </text>
        );
      })}
      {xLabel ? (
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="#475569">
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text transform={`translate(16 ${height / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="#475569">
          {yLabel}
        </text>
      ) : null}
    </svg>
  );
}

export type { LineDatum, ScatterDatum, MultiLineSeries };
