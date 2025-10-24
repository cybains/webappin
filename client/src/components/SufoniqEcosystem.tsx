"use client";

import { useMemo } from "react";
import LocalEuropeMap, { type LocalEuropeLink, type LocalEuropeNode } from "./LocalEuropeMap";
import {
  useEcosystemData,
  type EcosystemCountry,
  type IndicatorCode,
} from "@/lib/ecosystem-data";
import { iso3ToViewBoxPosition } from "@/lib/europe-positions";

type RankingEntry = { iso3: string; name: string; value: number };

type IndicatorMeta = {
  label: string;
  unit?: "usd" | "percent" | "pp" | "years";
  lowerIsBetter?: boolean;
};

const INDICATOR_META: Record<IndicatorCode, IndicatorMeta> = {
  "NY.GDP.PCAP.KD": { label: "GDP per capita", unit: "usd" },
  "SL.UEM.TOTL.ZS": { label: "Unemployment", unit: "percent", lowerIsBetter: true },
  "IT.NET.USER.ZS": { label: "Internet users", unit: "percent" },
  "NE.EXP.GNFS.ZS": { label: "Exports of goods & services", unit: "percent" },
  "SP.DYN.LE00.IN": { label: "Life expectancy", unit: "years" },
  "FP.CPI.TOTL.ZG": { label: "Inflation", unit: "percent", lowerIsBetter: true },
};

const HEATMAP_INDICATORS: IndicatorCode[] = [
  "IT.NET.USER.ZS",
  "NY.GDP.PCAP.KD",
  "NE.EXP.GNFS.ZS",
  "SL.UEM.TOTL.ZS",
  "SP.DYN.LE00.IN",
  "FP.CPI.TOTL.ZG",
];

function formatIndicatorValue(code: IndicatorCode, value?: number): string {
  if (value == null || Number.isNaN(value)) return "—";
  const meta = INDICATOR_META[code];
  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2,
    minimumFractionDigits: Math.abs(value) >= 100 ? 0 : 0,
  });

  switch (meta?.unit) {
    case "usd":
      return `$${formatter.format(value)}`;
    case "percent": {
      const percentFormatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: Math.abs(value) < 1 ? 2 : 1,
      });
      return `${percentFormatter.format(value)}%`;
    }
    case "pp":
      return `${formatter.format(value)} pp`;
    case "years": {
      const yearFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
      return `${yearFormatter.format(value)} yrs`;
    }
    default:
      return formatter.format(value);
  }
}

function averageIndicator(countries: EcosystemCountry[], code: IndicatorCode): number | null {
  const values = countries
    .map((country) => country.indicators[code]?.value)
    .filter((value): value is number => typeof value === "number" && !Number.isNaN(value));
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildRanking(
  countries: EcosystemCountry[],
  code: IndicatorCode,
  options: { limit?: number; direction?: "asc" | "desc"; filterIsoSet?: Set<string> } = {},
): RankingEntry[] {
  const direction = options.direction ?? "desc";
  let list = countries
    .map((country) => {
      const value = country.indicators[code]?.value;
      if (typeof value !== "number" || Number.isNaN(value)) return null;
      return { iso3: country.iso3, name: country.name, value } satisfies RankingEntry;
    })
    .filter((entry): entry is RankingEntry => Boolean(entry));

  if (options.filterIsoSet) {
    list = list.filter((entry) => options.filterIsoSet!.has(entry.iso3));
  }

  list.sort((a, b) => (direction === "asc" ? a.value - b.value : b.value - a.value));

  if (typeof options.limit === "number") {
    list = list.slice(0, options.limit);
  }

  return list;
}

function colorForDigital(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return {
      solid: "var(--primary)",
      halo: "rgba(14, 165, 233, 0.28)",
    };
  }

  const clamped = Math.max(0, Math.min(100, value));
  const hue = 160 - clamped * 0.5;
  const saturation = 70;
  const baseLightness = 68 - clamped * 0.2;
  const haloLightness = Math.min(90, baseLightness + 18);

  return {
    solid: `hsl(${Math.round(hue)}, ${saturation}%, ${Math.round(baseLightness)}%)`,
    halo: `hsla(${Math.round(hue)}, ${saturation}%, ${Math.round(haloLightness)}%, 0.32)`,
  };
}

function buildNodes(entries: RankingEntry[], options: { limit?: number } = {}): LocalEuropeNode[] {
  const limit = options.limit ?? 18;
  const limited = entries
    .filter((entry) => Boolean(iso3ToViewBoxPosition(entry.iso3)))
    .slice(0, limit);

  if (!limited.length) return [];

  const topValue = limited[0]?.value ?? 0;

  return limited
    .map((entry) => {
      const position = iso3ToViewBoxPosition(entry.iso3);
      if (!position) return null;
      const { solid, halo } = colorForDigital(entry.value);
      const weight = topValue > 0 ? 0.45 + (entry.value / topValue) * 0.75 : 0.6;

      return {
        id: entry.iso3,
        label: entry.name,
        x: position.x,
        y: position.y,
        weight,
        metricLabel: `${formatIndicatorValue("IT.NET.USER.ZS", entry.value)} online`,
        color: solid,
        haloColor: halo,
        value: entry.value,
      } satisfies LocalEuropeNode;
    })
    .filter(Boolean) as LocalEuropeNode[];
}

function buildNetworkLinks(countries: EcosystemCountry[], nodes: LocalEuropeNode[]): LocalEuropeLink[] {
  if (nodes.length < 2) return [];
  const isoSet = new Set(nodes.map((node) => node.id));

  const exportEntries = countries
    .map((country) => {
      const value = country.indicators["NE.EXP.GNFS.ZS"]?.value;
      if (typeof value !== "number" || Number.isNaN(value)) return null;
      if (!isoSet.has(country.iso3)) return null;
      return { iso3: country.iso3, value };
    })
    .filter((entry): entry is { iso3: string; value: number } => Boolean(entry));

  if (!exportEntries.length) return [];

  const values = exportEntries.map((entry) => entry.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 0.0001);
  const valueByIso = new Map(exportEntries.map((entry) => [entry.iso3, entry.value]));

  const links: LocalEuropeLink[] = [];
  const seen = new Set<string>();

  nodes.forEach((node) => {
    let closest: { target: LocalEuropeNode; distance: number } | null = null;
    nodes.forEach((candidate) => {
      if (candidate.id === node.id) return;
      const dx = candidate.x - node.x;
      const dy = candidate.y - node.y;
      const distance = Math.hypot(dx, dy);
      if (!closest || distance < closest.distance) {
        closest = { target: candidate, distance };
      }
    });

    if (!closest) return;
    const key = [node.id, closest.target.id].sort().join("↔");
    if (seen.has(key)) return;
    seen.add(key);

    const exportValue = valueByIso.get(node.id) ?? valueByIso.get(closest.target.id) ?? min;
    const normalised = (exportValue - min) / range;

    links.push({
      id: `flow:${node.id}-${closest.target.id}`,
      from: node.id,
      to: closest.target.id,
      strength: 0.35 + normalised * 0.6,
      tooltip: `Exports ${formatIndicatorValue("NE.EXP.GNFS.ZS", exportValue)}`,
    });
  });

  const exportLeaders = [...exportEntries]
    .sort((a, b) => b.value - a.value)
    .slice(0, Math.min(6, exportEntries.length));

  for (let i = 0; i < exportLeaders.length - 1; i += 1) {
    const current = exportLeaders[i];
    const next = exportLeaders[i + 1];
    const normalised = (current.value - min) / range;
    links.push({
      id: `export:${current.iso3}→${next.iso3}`,
      from: current.iso3,
      to: next.iso3,
      strength: 0.45 + normalised * 0.5,
      tooltip: `Exports ${formatIndicatorValue("NE.EXP.GNFS.ZS", current.value)}`,
    });
  }

  return links;
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-primary">{value}</div>
      {helper ? <p className="mt-1 text-sm text-[var(--muted)]">{helper}</p> : null}
    </div>
  );
}

function colorForPercentileScore(score: number | null | undefined) {
  if (score == null || Number.isNaN(score)) {
    return "rgba(148, 163, 184, 0.18)";
  }
  const clamped = Math.max(0, Math.min(100, score));
  const hue = 10 + (clamped / 100) * 110;
  const saturation = 70;
  const lightness = 95 - (clamped / 100) * 45;
  return `hsl(${Math.round(hue)}, ${saturation}%, ${Math.round(lightness)}%)`;
}

function formatPercentileLabel(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "No rank";
  return `${Math.round(value)}th pct`;
}

function IndicatorHeatmap({
  entries,
  countryByIso,
}: {
  entries: RankingEntry[];
  countryByIso: Map<string, EcosystemCountry>;
}) {
  const rows = entries.filter((entry) => countryByIso.has(entry.iso3));

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-semibold text-primary">Peer percentile heatmap</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Once indicators load you&rsquo;ll see how the network&rsquo;s digital leaders rank across every metric.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
      <h3 className="text-lg font-semibold text-primary">Peer percentile heatmap</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">
        World percentile positions for our most connected countries. For unemployment and inflation lower values are better,
        so cells are inverted.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="text-left">Country</th>
              {HEATMAP_INDICATORS.map((indicator) => (
                <th key={indicator} className="px-2 text-left">
                  {INDICATOR_META[indicator]?.label ?? indicator}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => {
              const country = countryByIso.get(entry.iso3)!;
              return (
                <tr key={entry.iso3}>
                  <th className="whitespace-nowrap pr-4 text-left text-sm font-medium text-primary">{entry.name}</th>
                  {HEATMAP_INDICATORS.map((indicator) => {
                    const meta = INDICATOR_META[indicator];
                    const summary = country.indicators[indicator];
                    const percentile = summary?.percentiles?.world ?? null;
                    const score =
                      percentile == null
                        ? null
                        : meta?.lowerIsBetter
                        ? 100 - percentile
                        : percentile;
                    const background = colorForPercentileScore(score);
                    const textColor = score != null && score > 65 ? "#0f172a" : "var(--foreground)";
                    const valueLabel = summary?.value != null ? formatIndicatorValue(indicator, summary.value) : "—";

                    return (
                      <td key={`${entry.iso3}-${indicator}`} className="px-2 py-1 align-top">
                        <div
                          className="rounded-xl px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                          style={{ background, color: textColor }}
                        >
                          <div className="text-sm font-medium">{valueLabel}</div>
                          <div className="text-xs opacity-80">{formatPercentileLabel(percentile)}</div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DistributionCard({
  indicator,
  countries,
  title,
  helper,
}: {
  indicator: IndicatorCode;
  countries: EcosystemCountry[];
  title: string;
  helper?: string;
}) {
  const meta = INDICATOR_META[indicator];
  const data = countries
    .map((country) => {
      const value = country.indicators[indicator]?.value;
      if (typeof value !== "number" || Number.isNaN(value)) return null;
      return { iso3: country.iso3, name: country.name, value };
    })
    .filter((entry): entry is RankingEntry => Boolean(entry))
    .sort((a, b) => a.value - b.value);

  if (!data.length) {
    return (
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">We&rsquo;re still collecting values for this indicator.</p>
      </div>
    );
  }

  const min = data[0].value;
  const max = data[data.length - 1].value;
  const range = Math.max(max - min, 0.0001);
  const avg = data.reduce((sum, entry) => sum + entry.value, 0) / data.length;
  const chartWidth = 320;
  const chartHeight = 120;
  const paddingX = 24;
  const paddingY = 24;
  const usableWidth = chartWidth - paddingX * 2;
  const step = usableWidth / data.length;
  const highlightSet = new Set(
    (meta?.lowerIsBetter ? data.slice(0, 3) : data.slice(-3)).map((entry) => entry.iso3),
  );
  const topEntry = meta?.lowerIsBetter ? data[0] : data[data.length - 1];
  const bottomEntry = meta?.lowerIsBetter ? data[data.length - 1] : data[0];
  const avgX = paddingX + ((avg - min) / range) * usableWidth;

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      {helper ? <p className="mt-1 text-sm text-[var(--muted)]">{helper}</p> : null}
      <div className="mt-4">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-32 w-full"
          role="img"
          aria-label={`${title} distribution across countries`}
        >
          <rect
            x={paddingX - 2}
            y={paddingY - 6}
            width={usableWidth + 4}
            height={chartHeight - paddingY + 6}
            rx={12}
            fill="rgba(148, 163, 184, 0.08)"
          />
          {data.map((entry, index) => {
            const normalised = (entry.value - min) / range;
            const barHeight = 12 + normalised * (chartHeight - paddingY * 2 - 12);
            const x = paddingX + index * step;
            const y = chartHeight - paddingY - barHeight;
            const width = Math.max(2, step - 3);
            const fill = highlightSet.has(entry.iso3)
              ? "rgba(14, 165, 233, 0.85)"
              : "rgba(100, 116, 139, 0.35)";

            return <rect key={entry.iso3} x={x} y={y} width={width} height={barHeight} rx={width / 3} fill={fill} />;
          })}
          <line
            x1={avgX}
            x2={avgX}
            y1={paddingY - 6}
            y2={chartHeight - paddingY}
            stroke="rgba(59, 130, 246, 0.6)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <circle cx={avgX} cy={paddingY - 6} r={3} fill="rgba(59, 130, 246, 0.75)" />
        </svg>
        <div className="mt-3 flex flex-col gap-1 text-xs text-[var(--muted)]">
          <span>
            <strong className="text-primary">Top performer:</strong> {topEntry.name} · {formatIndicatorValue(indicator, topEntry.value)}
          </span>
          <span>
            <strong className="text-primary">Network average:</strong> {formatIndicatorValue(indicator, avg)}
          </span>
          <span>
            <strong className="text-primary">Lagging country:</strong> {bottomEntry.name} · {formatIndicatorValue(indicator, bottomEntry.value)}
          </span>
        </div>
      </div>
    </div>
  );
}

function TopList({
  title,
  indicator,
  entries,
  helper,
}: {
  title: string;
  indicator: IndicatorCode;
  entries: RankingEntry[];
  helper?: string;
}) {
  const meta = INDICATOR_META[indicator];

  if (!entries.length) {
    return (
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">Data is still loading.</p>
      </div>
    );
  }

  const values = entries.map((entry) => entry.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 0.0001);
  const lowerIsBetter = Boolean(meta?.lowerIsBetter);

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      {helper ? <p className="mt-1 text-sm text-[var(--muted)]">{helper}</p> : null}
      <ul className="mt-4 space-y-3 text-sm">
        {entries.map((entry) => {
          const rawPosition = lowerIsBetter
            ? 1 - (entry.value - min) / range
            : (entry.value - min) / range;
          const clamped = Math.max(0, Math.min(1, rawPosition));
          const width = Math.max(0.12, clamped) * 100;
          return (
            <li key={entry.iso3}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-primary">{entry.name}</span>
                <span className="text-[var(--muted)]">{formatIndicatorValue(indicator, entry.value)}</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${width}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MapPlaceholder() {
  return (
    <div className="flex h-full min-h-[16rem] items-center justify-center">
      <div className="animate-pulse text-sm text-[var(--muted)]">Loading ecosystem map…</div>
    </div>
  );
}

export default function SufoniqEcosystem() {
  const { data, loading, error } = useEcosystemData();
  const countries = useMemo(() => data ?? [], [data]);

  const countryByIso = useMemo(() => {
    const map = new Map<string, EcosystemCountry>();
    countries.forEach((country) => {
      map.set(country.iso3, country);
    });
    return map;
  }, [countries]);

  const digitalRanking = useMemo(
    () => buildRanking(countries, "IT.NET.USER.ZS", { limit: 24, direction: "desc" }),
    [countries],
  );
  const mapNodes = useMemo(() => buildNodes(digitalRanking, { limit: 18 }), [digitalRanking]);
  const mapLinks = useMemo(() => buildNetworkLinks(countries, mapNodes), [countries, mapNodes]);

  const topGdp = useMemo(() => buildRanking(countries, "NY.GDP.PCAP.KD", { limit: 1 })[0], [countries]);
  const avgDigital = useMemo(() => averageIndicator(countries, "IT.NET.USER.ZS"), [countries]);
  const lowestUnemployment = useMemo(
    () => buildRanking(countries, "SL.UEM.TOTL.ZS", { limit: 1, direction: "asc" })[0],
    [countries],
  );

  const digitalLeadersList = useMemo(() => digitalRanking.slice(0, 5), [digitalRanking]);
  const gdpLeaders = useMemo(
    () => buildRanking(countries, "NY.GDP.PCAP.KD", { limit: 5, direction: "desc" }),
    [countries],
  );
  const exportLeaders = useMemo(
    () => buildRanking(countries, "NE.EXP.GNFS.ZS", { limit: 5, direction: "desc" }),
    [countries],
  );

  const percentileRows = useMemo(() => digitalRanking.slice(0, 6), [digitalRanking]);

  const totalCountries = countries.length;
  const ready = Boolean(mapNodes.length && countries.length);

  return (
    <section className="relative z-10 bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Sufoniq Ecosystem in Motion</p>
          <h2 className="text-3xl font-semibold">We connect Europe&rsquo;s talent, opportunity, and mobility data.</h2>
          <p className="text-lg text-[var(--muted)]">
            Each country brief feeds a shared knowledge graph. These visualisations aggregate live indicators from
            {" "}
            {totalCountries ? `${totalCountries} countries` : "our monitored countries"} to show where skills, exports,
            and connectivity are accelerating.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
          <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            {ready ? <LocalEuropeMap nodes={mapNodes} links={mapLinks} /> : <MapPlaceholder />}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <MetricCard
              label="Countries monitored"
              value={totalCountries ? `${totalCountries}` : loading ? "Loading" : "—"}
              helper="Narratives synced from our country intelligence database"
            />
            <MetricCard
              label="Top GDP per capita"
              value={topGdp ? topGdp.name : loading ? "Loading" : "—"}
              helper={topGdp ? formatIndicatorValue("NY.GDP.PCAP.KD", topGdp.value) : undefined}
            />
            <MetricCard
              label="Average digital adoption"
              value={avgDigital != null ? formatIndicatorValue("IT.NET.USER.ZS", avgDigital) : loading ? "Loading" : "—"}
              helper="Share of population online across the network"
            />
            <MetricCard
              label="Lowest unemployment"
              value={lowestUnemployment ? lowestUnemployment.name : loading ? "Loading" : "—"}
              helper={
                lowestUnemployment
                  ? formatIndicatorValue("SL.UEM.TOTL.ZS", lowestUnemployment.value)
                  : undefined
              }
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <IndicatorHeatmap entries={percentileRows} countryByIso={countryByIso} />
          <div className="grid gap-6">
            <DistributionCard
              indicator="NY.GDP.PCAP.KD"
              countries={countries}
              title="Economic output distribution"
              helper="GDP per capita spread across the network"
            />
            <DistributionCard
              indicator="SL.UEM.TOTL.ZS"
              countries={countries}
              title="Employment resilience"
              helper="Tracking the countries with the lowest unemployment"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <TopList
            title="Digital adoption leaders"
            indicator="IT.NET.USER.ZS"
            entries={digitalLeadersList}
            helper="Share of residents using the internet"
          />
          <TopList
            title="High-value economies"
            indicator="NY.GDP.PCAP.KD"
            entries={gdpLeaders}
            helper="GDP per capita in constant USD"
          />
          <TopList
            title="Export intensity"
            indicator="NE.EXP.GNFS.ZS"
            entries={exportLeaders}
            helper="Exports of goods & services as % of GDP"
          />
        </div>

        {error ? (
          <p className="text-sm text-red-500">Some ecosystem metrics failed to load. Refresh to try again.</p>
        ) : null}
      </div>
    </section>
  );
}
