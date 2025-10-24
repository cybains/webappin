"use client";

import { useMemo } from "react";
import LocalEuropeMap, { type LocalEuropeLink, type LocalEuropeNode } from "./LocalEuropeMap";
import {
  COUNTRY_GROUPS,
  TOTAL_COUNTRY_COUNT,
  type Country,
  type CountryGroup,
} from "@/lib/country-data";

function pickHighlightCountries(groups: CountryGroup[]): { country: Country; group: CountryGroup }[] {
  const picks: { country: Country; group: CountryGroup }[] = [];
  groups.forEach((group) => {
    const samples = group.countries.slice(0, Math.min(3, group.countries.length));
    samples.forEach((country) => {
      picks.push({ country, group });
    });
  });
  return picks.slice(0, 18);
}

function buildNodes(highlights: { country: Country; group: CountryGroup }[]): LocalEuropeNode[] {
  if (!highlights.length) return [];
  const radiusX = 33;
  const radiusY = 22;
  return highlights.map(({ country }, index) => {
    const angle = (index / highlights.length) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + radiusX * Math.cos(angle);
    const y = 35 + radiusY * Math.sin(angle);
    return {
      id: country.code,
      label: country.name,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
    };
  });
}

function buildLinks(highlights: { country: Country; group: CountryGroup }[]): LocalEuropeLink[] {
  const grouped = new Map<string, { country: Country; group: CountryGroup }[]>();
  highlights.forEach((entry) => {
    const list = grouped.get(entry.group.id) ?? [];
    list.push(entry);
    grouped.set(entry.group.id, list);
  });

  const links: LocalEuropeLink[] = [];
  grouped.forEach((list, groupId) => {
    if (list.length < 2) return;
    for (let i = 0; i < list.length - 1; i++) {
      const current = list[i];
      const next = list[i + 1];
      links.push({
        id: `${groupId}:${current.country.code}→${next.country.code}`,
        from: current.country.code,
        to: next.country.code,
        strength: 0.4 + Math.min(0.5, list.length / 10),
      });
    }
  });

  if (highlights.length > 1) {
    for (let i = 0; i < highlights.length; i++) {
      const current = highlights[i];
      const next = highlights[(i + 1) % highlights.length];
      links.push({
        id: `loop:${current.country.code}→${next.country.code}`,
        from: current.country.code,
        to: next.country.code,
        strength: 0.3,
      });
    }
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

export default function SufoniqEcosystem() {
  const highlights = useMemo(() => pickHighlightCountries(COUNTRY_GROUPS), []);

  const nodes = useMemo(() => buildNodes(highlights), [highlights]);
  const links = useMemo(() => buildLinks(highlights), [highlights]);

  const largestGroup = useMemo(() => {
    return COUNTRY_GROUPS.reduce((largest, group) => {
      if (!largest || group.countries.length > largest.countries.length) return group;
      return largest;
    }, null as CountryGroup | null);
  }, []);

  const microGroups = useMemo(
    () => COUNTRY_GROUPS.filter((group) => group.countries.length <= 3),
    [],
  );

  const topFlows = useMemo(() => {
    const flows = highlights.slice(0, 6);
    return flows.map(({ country, group }) => `${group.title} → ${country.name}`);
  }, [highlights]);

  return (
    <section className="relative z-10 bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Sufoniq Ecosystem in Motion</p>
          <h2 className="text-3xl font-semibold">We connect Europe&rsquo;s talent, opportunity, and mobility data.</h2>
          <p className="text-lg text-[var(--muted)]">
            The same country intelligence that powers each brief now informs the broader Sufoniq map —
            showing how skills, migration, and growth connect across {TOTAL_COUNTRY_COUNT} profiled markets.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <LocalEuropeMap nodes={nodes} links={links} />
          </div>
          <div className="flex flex-col gap-4">
            <MetricCard
              label="Countries monitored"
              value={`${TOTAL_COUNTRY_COUNT}`}
              helper="Live briefs stitched into our ecosystem feed"
            />
            <MetricCard
              label="Largest cluster"
              value={largestGroup ? largestGroup.title : '—'}
              helper={largestGroup ? `${largestGroup.countries.length} countries sharing indicators` : undefined}
            />
            <MetricCard
              label="Micro networks"
              value={`${microGroups.length}`}
              helper="Specialised blocs (≤3 members) tracked for niche flows"
            />
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold">Sample data flows</h3>
            <p className="text-sm text-[var(--muted)]">Each arc pairs countries from the same policy or economic bloc.</p>
            <ul className="mt-3 space-y-2 text-sm">
              {topFlows.map((flow) => (
                <li key={flow} className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  <span>{flow}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">How we use it</h3>
            <p className="text-sm text-[var(--muted)]">
              These same clusters drive our country deep-dives, feed employer benchmarks, and signal where learners
              can plug into emerging ecosystems.
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Explore any country below to see the narrative, KPIs, and persona insights behind the nodes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
