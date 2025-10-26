"use client";

import React, { useEffect, useMemo, useRef, useId } from "react";
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

// 1) Promise of Growth — horizontal scroller highlighting the four Chapter 1 visuals
type ChapterOnePanel = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  highlights: string[];
};

const chapterOnePanels: ChapterOnePanel[] = [
  {
    id: "skyline",
    eyebrow: "Skyline",
    title: "Levels snapshot",
    description:
      "Kick off with the richest-to-poorest skyline so readers see the stark spread that Susskind critiques before we pivot to motion.",
    placeholder: "SKYLINE BAR CHART",
    highlights: [
      "Order economies by latest GDP per capita pulled from the Chapter 1 pack.",
      "Annotate the richest versus poorest gap to anchor the visual story.",
      "Underline that this is the familiar static picture the rest of the chapter complicates.",
    ],
  },
  {
    id: "slope",
    eyebrow: "Slope",
    title: "Rotating cohorts",
    description:
      "Scroll again to meet the moving window of four countries. This panel previews how we rotate cohorts every few seconds to emphasise trajectories.",
    placeholder: "ROTATING COHORTS",
    highlights: [
      "Cycle through opportunity clusters without leaving the horizontal flow.",
      "Pair motion copy with the growth-rate slope the eventual chart will plot.",
      "Provide a manual “Next countries” affordance alongside the auto-rotation.",
    ],
  },
  {
    id: "gap",
    eyebrow: "Gap",
    title: "Convergence band",
    description:
      "The third card introduces the shaded convergence band that averages rich and poor cohorts to show the gap compressing over time.",
    placeholder: "CONVERGENCE BAND",
    highlights: [
      "Shade between cohort averages to depict the shrinking ratio.",
      "Annotate the rich-to-poor multiple so the narrative stays quantitative.",
      "Cue supporting text that points back to the skyline for contrast.",
    ],
  },
  {
    id: "your-view",
    eyebrow: "Your view",
    title: "Reader agency tools",
    description:
      "Finally, invite the reader to craft their own comparison with a picker that accepts up to five countries and toggles euro levels vs indexed growth.",
    placeholder: "INTERACTIVE CONTROLS",
    highlights: [
      "List the chips, toggles, and helper copy that empower exploration.",
      "Explain how we surface GDP-per-capita levels alongside indexed progress.",
      "Encourage readers to validate the convergence story with their own mix.",
    ],
  },
];

const PromiseOfGrowth: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const raf = requestAnimationFrame(() => {
      const maxScroll = Math.max(0, node.scrollWidth - node.clientWidth);
      node.scrollTo({ left: maxScroll });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleStep = (direction: "forward" | "backward") => {
    const node = scrollRef.current;
    if (!node) return;
    const delta = node.clientWidth * 0.85;
    const step = direction === "forward" ? -delta : delta;
    node.scrollBy({ left: step, behavior: "smooth" });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleStep("forward");
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleStep("backward");
    }
  };

  return (
    <div className="relative">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Scroll the argument</p>
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">A right-to-left reel for Chapter 1</h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Glide sideways to preview each piece of the convergence story—skyline, slope, gap, and your view—before we drop in the live data visualisations.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleStep("backward")}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => handleStep("forward")}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80"
          aria-hidden="true"
        />
        <div
          ref={scrollRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="hide-scrollbar relative flex flex-row-reverse snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth rounded-3xl border border-slate-200 bg-white/80 px-6 py-10 shadow-sm backdrop-blur-md focus:outline-none dark:border-slate-800 dark:bg-slate-900/60"
          aria-label="Chapter 1 visualisation storyline scroller"
        >
          {chapterOnePanels.map((panel) => (
            <article
              key={panel.id}
              className="snap-end shrink-0 w-[min(90vw,420px)] rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">{panel.eyebrow}</span>
              <h4 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{panel.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{panel.description}</p>
              <div className="mt-6 flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 dark:border-slate-600 dark:from-slate-800 dark:to-slate-900 dark:text-slate-500">
                {panel.placeholder}
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {panel.highlights.map((item, index) => (
                  <li key={`${panel.id}-${index}`} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
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
