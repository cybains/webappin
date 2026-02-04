"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Group } from "./data";

type CountriesClientProps = {
  initialGroups: Group[];
};

const GROUP_ACCENTS: Record<string, { chip: string; ring: string }> = {
  EU27: { chip: "bg-[var(--chip-bg)] border-[var(--card-border)]", ring: "ring-blue-500/20" },
  EFTA: { chip: "bg-[var(--chip-bg)] border-[var(--card-border)]", ring: "ring-emerald-500/20" },
  UK: { chip: "bg-[var(--chip-bg)] border-[var(--card-border)]", ring: "ring-indigo-500/20" },
  WBALK: { chip: "bg-[var(--chip-bg)] border-[var(--card-border)]", ring: "ring-rose-500/20" },
  E_NEI: { chip: "bg-[var(--chip-bg)] border-[var(--card-border)]", ring: "ring-amber-500/20" },
  CAUC: { chip: "bg-[var(--chip-bg)] border-[var(--card-border)]", ring: "ring-violet-500/20" },
  MICRO: { chip: "bg-[var(--chip-bg)] border-[var(--card-border)]", ring: "ring-teal-500/20" },
};

const ISO3_TO_ISO2: Record<string, string> = {
  AUT: "AT",
  BEL: "BE",
  BGR: "BG",
  HRV: "HR",
  CYP: "CY",
  CZE: "CZ",
  DNK: "DK",
  EST: "EE",
  FIN: "FI",
  FRA: "FR",
  DEU: "DE",
  GRC: "GR",
  HUN: "HU",
  IRL: "IE",
  ITA: "IT",
  LVA: "LV",
  LTU: "LT",
  LUX: "LU",
  MLT: "MT",
  NLD: "NL",
  POL: "PL",
  PRT: "PT",
  ROU: "RO",
  SVK: "SK",
  SVN: "SI",
  ESP: "ES",
  SWE: "SE",
  ISL: "IS",
  LIE: "LI",
  NOR: "NO",
  CHE: "CH",
  GBR: "GB",
  ALB: "AL",
  BIH: "BA",
  MNE: "ME",
  MKD: "MK",
  SRB: "RS",
  XKX: "XK",
  UKR: "UA",
  MDA: "MD",
  BLR: "BY",
  RUS: "RU",
  TUR: "TR",
  ARM: "AM",
  AZE: "AZ",
  GEO: "GE",
  AND: "AD",
  MCO: "MC",
  SMR: "SM",
};

const accentFor = (id: string) => GROUP_ACCENTS[id] ?? GROUP_ACCENTS.EU27;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlight = (text: string, query: string): React.ReactNode => {
  if (!query) return text;
  const re = new RegExp(`(${escapeRegExp(query)})`, "i");
  const parts = text.split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 dark:text-yellow-50 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
};

const flagEmojiFromIso3 = (iso3: string) => {
  const iso2 = ISO3_TO_ISO2[iso3.toUpperCase()];
  if (!iso2) return "";
  return Array.from(iso2)
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join("");
};

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M7.2 4.7a1 1 0 0 0 0 1.4L11.1 10l-3.9 3.9a1 1 0 1 0 1.4 1.4l4.6-4.6a1.5 1.5 0 0 0 0-2.1L8.6 4.7a1 1 0 0 0-1.4 0z" />
  </svg>
);

export default function CountriesClient({ initialGroups }: CountriesClientProps) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const filtered: Group[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return initialGroups;
    return initialGroups
      .map((g) => ({
        ...g,
        countries: g.countries.filter(
          (c) => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query),
        ),
      }))
      .filter((g) => g.countries.length > 0);
  }, [initialGroups, q]);

  const totalCount = useMemo(() => initialGroups.reduce((acc, g) => acc + g.countries.length, 0), [initialGroups]);
  const shownCount = useMemo(() => filtered.reduce((acc, g) => acc + g.countries.length, 0), [filtered]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-10 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="rounded-2xl border border-[var(--card-border)] p-6 bg-[var(--card)]">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-primary">Explore countries</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Browse Europe and neighbours. Click a country to open its brief.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full border border-[var(--card-border)] bg-[var(--card)]">
              {shownCount}/{totalCount}
            </span>
            <label className="sr-only" htmlFor="country-search">
              Search
            </label>
            <input
              id="country-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by country or ISO3…"
              className="w-72 max-w-full border border-[var(--card-border)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--card)] text-[var(--foreground)] placeholder:text-slate-500 dark:placeholder:text-slate-400"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="p-6 text-[var(--muted)] border border-[var(--card-border)] rounded-xl bg-[var(--card)]">
          No countries match “{q}”. Try a different name or code.
        </div>
      ) : (
        filtered.map((group) => {
          const accent = accentFor(group.id);
          const isOpen = q.trim() ? true : expanded.has(group.id);

          return (
            <section key={group.id} className="space-y-3">
              <button
                type="button"
                onClick={() => toggle(group.id)}
                aria-expanded={isOpen}
                className={[
                  "w-full rounded-xl p-4 border border-[var(--card-border)]",
                  "bg-[var(--card)]",
                  "flex items-center gap-3 text-left transition",
                  "focus:outline-none focus:ring-2",
                  accent.ring,
                  "hover:-translate-y-0.5 hover:shadow-sm",
                ].join(" ")}
              >
                <Chevron open={isOpen} />
                <span className="text-lg md:text-xl font-semibold text-primary">{group.title}</span>
                <span className={["ml-auto text-xs px-2 py-0.5 rounded-full border", accent.chip].join(" ")}>
                  {group.countries.length}
                </span>
              </button>

              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.countries.map((c) => {
                    const flag = flagEmojiFromIso3(c.code);
                    return (
                      <Link
                        key={c.code}
                        href={`/country/${c.code}`}
                        className={[
                          "group rounded-2xl border border-[var(--card-border)] p-4 shadow-sm transition",
                          "bg-[var(--card)] focus:outline-none focus:ring-2",
                          accent.ring,
                          "hover:-translate-y-0.5 hover:shadow-md",
                        ].join(" ")}
                        aria-label={`Open ${c.name}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl leading-none">{flag}</span>
                          <span className="font-medium truncate text-primary">{highlight(c.name, q)}</span>
                          <span className="ml-auto opacity-0 group-hover:opacity-100 transition" aria-hidden>
                            →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })
      )}
    </main>
  );
}
