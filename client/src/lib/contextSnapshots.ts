import { promises as fs } from "fs";
import path from "path";
import { GROUPS, type Group } from "@/app/countries/data";

const INDICATOR_DEFS = [
  {
    code: "NY.GDP.PCAP.KD",
    label: "GDP per capita (macro)",
    format: (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
  },
  {
    code: "SL.UEM.TOTL.ZS",
    label: "Unemployment",
    format: (value: number) => `${value.toFixed(1)}%`,
  },
  {
    code: "FP.CPI.TOTL.ZG",
    label: "Inflation",
    format: (value: number) => `${value.toFixed(1)}%`,
  },
] as const;

// IMPORTANT: if you run Next from /client, process.cwd() is already /client.
const DATA_DIR = path.join(process.cwd(), "public", "data", "v1", "countries");

export type SnapshotIndicator = {
  code: string;
  label: string;
  median?: number;
};

export type ContextSnapshot = {
  groupId: string;
  title: string;
  count: number;
  indicators: SnapshotIndicator[];
  asOfText?: string;
};

type Narrative = {
  snapshot_date?: string;
  facts_used?: { code: string; value?: number }[];
};

async function readNarrative(iso3: string): Promise<Narrative | null> {
  const filePath = path.join(DATA_DIR, `${iso3}_narrative.json`);
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as Narrative;
  } catch {
    return null;
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const len = sorted.length;
  if (len === 0) return NaN;
  if (len % 2 === 1) return sorted[(len - 1) / 2];
  const mid = len / 2;
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

function buildAsOfText(dates: string[]): string | undefined {
  const clean = Array.from(new Set(dates.filter(Boolean))).sort();
  if (clean.length === 0) return undefined;
  if (clean.length === 1) return clean[0];
  return `${clean[0]} - ${clean[clean.length - 1]}`;
}

function requiredCoverage(group: Group): number {
  return group.countries.length <= 3 ? 2 : 3;
}

async function computeSnapshot(group: Group): Promise<ContextSnapshot> {
  const narratives = await Promise.all(group.countries.map((c) => readNarrative(c.code)));
  const valid = narratives.filter((n): n is Narrative => Boolean(n));

  const indicators: SnapshotIndicator[] = INDICATOR_DEFS.map((def) => {
    const values = valid
      .map((n) => n.facts_used?.find((f) => f.code === def.code)?.value)
      .filter((v): v is number => typeof v === "number" && Number.isFinite(v));

    const minCount = requiredCoverage(group);
    const med = values.length >= minCount ? median(values) : undefined;

    return { code: def.code, label: def.label, median: med };
  });

  const dates = valid.map((n) => n.snapshot_date).filter((d): d is string => Boolean(d));

  return {
    groupId: group.id,
    title: group.title,
    count: group.countries.length,
    indicators,
    asOfText: buildAsOfText(dates),
  };
}

export async function loadContextSnapshots(
  groupIds: string[],
): Promise<Record<string, ContextSnapshot | null>> {
  const unique = Array.from(new Set(groupIds));
  const entries = await Promise.all(
    unique.map(async (groupId) => {
      const group = GROUPS.find((g) => g.id === groupId);
      if (!group) return [groupId, null] as const;
      const snapshot = await computeSnapshot(group);
      return [groupId, snapshot] as const;
    }),
  );

  return Object.fromEntries(entries);
}

export function formatIndicatorValue(code: string, value: number): string {
  const def = INDICATOR_DEFS.find((d) => d.code === code);
  if (!def) return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return def.format(value);
}
