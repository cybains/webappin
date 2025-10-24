"use client";

import { useEffect, useState } from "react";

type ManifestCountry = {
  iso3?: string;
  name?: string;
  files?: { narrative?: string };
};

type Manifest = {
  countries?: ManifestCountry[];
};

type Percentiles = {
  world?: number;
  region?: number;
  income?: number;
};

type Fact = {
  code?: string;
  value?: number;
  yoy?: number;
  pctl?: Percentiles;
};

type Narrative = {
  iso3?: string;
  country_name?: string;
  facts_used?: Fact[];
};

export const TRACKED_INDICATORS = [
  "NY.GDP.PCAP.KD",
  "SL.UEM.TOTL.ZS",
  "IT.NET.USER.ZS",
  "NE.EXP.GNFS.ZS",
  "SP.DYN.LE00.IN",
  "FP.CPI.TOTL.ZG",
] as const;

export type IndicatorCode = (typeof TRACKED_INDICATORS)[number];

export type IndicatorSummary = {
  value?: number;
  yoy?: number;
  percentiles?: Percentiles;
};

export type EcosystemCountry = {
  iso3: string;
  name: string;
  indicators: Partial<Record<IndicatorCode, IndicatorSummary>>;
};

let dataCache: EcosystemCountry[] | null = null;
let loadPromise: Promise<EcosystemCountry[]> | null = null;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

function normalizeIso3(iso3?: string): string | null {
  if (!iso3) return null;
  const trimmed = iso3.trim();
  if (!trimmed) return null;
  return trimmed.toUpperCase();
}

function parseNarrative(narrative: Narrative, fallbackIso3?: string, fallbackName?: string): EcosystemCountry | null {
  const iso3 = normalizeIso3(narrative.iso3) ?? normalizeIso3(fallbackIso3 ?? undefined);
  if (!iso3) return null;
  const name = narrative.country_name?.trim() || fallbackName?.trim() || iso3;

  const indicators: Partial<Record<IndicatorCode, IndicatorSummary>> = {};
  const facts = Array.isArray(narrative.facts_used) ? narrative.facts_used : [];

  facts.forEach((fact) => {
    const code = fact.code as IndicatorCode | undefined;
    if (!code || !(TRACKED_INDICATORS as readonly string[]).includes(code)) {
      return;
    }
    indicators[code] = {
      value: typeof fact.value === "number" ? fact.value : undefined,
      yoy: typeof fact.yoy === "number" ? fact.yoy : undefined,
      percentiles: fact.pctl,
    };
  });

  return { iso3, name, indicators };
}

export async function fetchEcosystemCountries(): Promise<EcosystemCountry[]> {
  if (dataCache) return dataCache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const manifest = await fetchJson<Manifest>("/data/v1/index.json");
    const manifestCountries = Array.isArray(manifest.countries) ? manifest.countries : [];

    const results = await Promise.allSettled(
      manifestCountries.map(async (entry) => {
        const iso3 = normalizeIso3(entry.iso3);
        if (!iso3) return null;
        const narrativePath = entry.files?.narrative || `/data/v1/countries/${iso3}_narrative.json`;
        try {
          const narrative = await fetchJson<Narrative>(narrativePath);
          return parseNarrative(narrative, iso3, entry.name ?? iso3);
        } catch {
          return null;
        }
      }),
    );

    const countries: EcosystemCountry[] = results
      .map((result) => (result.status === "fulfilled" ? result.value : null))
      .filter((country): country is EcosystemCountry => Boolean(country && Object.keys(country.indicators).length > 0));

    countries.sort((a, b) => a.name.localeCompare(b.name));
    dataCache = countries;
    return countries;
  })()
    .finally(() => {
      loadPromise = null;
    });

  return loadPromise;
}

export function useEcosystemData() {
  const [data, setData] = useState<EcosystemCountry[] | null>(dataCache);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!dataCache);

  useEffect(() => {
    if (dataCache) {
      setData(dataCache);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchEcosystemCountries()
      .then((countries) => {
        if (cancelled) return;
        setData(countries);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loading } as const;
}
