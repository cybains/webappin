"use client";

import { useMemo } from "react";
import LocalEuropeMap, { type LocalEuropeLink, type LocalEuropeNode } from "./LocalEuropeMap";
import {
  useEcosystemData,
  type EcosystemCountry,
  type IndicatorCode,
} from "@/lib/ecosystem-data";

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

function buildNodes(entries: RankingEntry[]): LocalEuropeNode[] {
  if (!entries.length) return [];
  const radiusX = 33;
  const radiusY = 22;
  const topValue = entries[0]?.value ?? 0;

  return entries.map((entry, index) => {
    const angle = (index / entries.length) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + radiusX * Math.cos(angle);
    const y = 35 + radiusY * Math.sin(angle);
    const weight = topValue > 0 ? entry.value / topValue : 0.5;

    return {
      id: entry.iso3,
      label: entry.name,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      weight,
      metricLabel: `${formatIndicatorValue("IT.NET.USER.ZS", entry.value)} online`,
    } satisfies LocalEuropeNode;
  });
}

function buildLinks(entries: RankingEntry[]): LocalEuropeLink[] {
  if (entries.length < 2) return [];
  const max = entries[0].value;
  const min = entries[entries.length - 1].value;
  const range = Math.max(max - min, 0.0001);

  return entries.map((entry, index) => {
    const next = entries[(index + 1) % entries.length];
    const normalised = (entry.value - min) / range;
    return {
      id: `exports:${entry.iso3}→${next.iso3}`,
      from: entry.iso3,
      to: next.iso3,
      strength: 0.35 + normalised * 0.65,
      tooltip: `Exports ${formatIndicatorValue("NE.EXP.GNFS.ZS", entry.value)}`,
    } satisfies LocalEuropeLink;
  });
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

  const digitalRanking = useMemo(
    () => buildRanking(countries, "IT.NET.USER.ZS", { limit: 12, direction: "desc" }),
    [countries],
  );
  const mapNodes = useMemo(() => buildNodes(digitalRanking), [digitalRanking]);
  const nodeIsoSet = useMemo(() => new Set(mapNodes.map((node) => node.id)), [mapNodes]);

  const exportRankingForLinks = useMemo(() => {
    if (!nodeIsoSet.size) return [] as RankingEntry[];
    return buildRanking(countries, "NE.EXP.GNFS.ZS", {
      direction: "desc",
      filterIsoSet: nodeIsoSet,
      limit: nodeIsoSet.size,
    });
  }, [countries, nodeIsoSet]);

  const mapLinks = useMemo(() => buildLinks(exportRankingForLinks), [exportRankingForLinks]);

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

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            {ready ? <LocalEuropeMap nodes={mapNodes} links={mapLinks} /> : <MapPlaceholder />}
          </div>
          <div className="flex flex-col gap-4">
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

        <div className="grid gap-6 rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 md:grid-cols-2 xl:grid-cols-3">
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
