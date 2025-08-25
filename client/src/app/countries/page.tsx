'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Footer from "@/components/Footer";

type Country = { code: string; name: string };
type Group = { id: string; title: string; countries: Country[] };

const GROUPS: Group[] = [
  {
    id: 'EU27',
    title: 'European Union (EU-27)',
    countries: [
      { code: 'AUT', name: 'Austria' }, { code: 'BEL', name: 'Belgium' },
      { code: 'BGR', name: 'Bulgaria' }, { code: 'HRV', name: 'Croatia' },
      { code: 'CYP', name: 'Cyprus' }, { code: 'CZE', name: 'Czech Republic' },
      { code: 'DNK', name: 'Denmark' }, { code: 'EST', name: 'Estonia' },
      { code: 'FIN', name: 'Finland' }, { code: 'FRA', name: 'France' },
      { code: 'DEU', name: 'Germany' }, { code: 'GRC', name: 'Greece' },
      { code: 'HUN', name: 'Hungary' }, { code: 'IRL', name: 'Ireland' },
      { code: 'ITA', name: 'Italy' }, { code: 'LVA', name: 'Latvia' },
      { code: 'LTU', name: 'Lithuania' }, { code: 'LUX', name: 'Luxembourg' },
      { code: 'MLT', name: 'Malta' }, { code: 'NLD', name: 'Netherlands' },
      { code: 'POL', name: 'Poland' }, { code: 'PRT', name: 'Portugal' },
      { code: 'ROU', name: 'Romania' }, { code: 'SVK', name: 'Slovakia' },
      { code: 'SVN', name: 'Slovenia' }, { code: 'ESP', name: 'Spain' },
      { code: 'SWE', name: 'Sweden' },
    ],
  },
  {
    id: 'EFTA',
    title: 'European Free Trade Association (EFTA)',
    countries: [
      { code: 'ISL', name: 'Iceland' },
      { code: 'LIE', name: 'Liechtenstein' },
      { code: 'NOR', name: 'Norway' },
      { code: 'CHE', name: 'Switzerland' },
    ],
  },
  { id: 'UK', title: 'United Kingdom', countries: [{ code: 'GBR', name: 'United Kingdom' }] },
  {
    id: 'WBALK',
    title: 'Western Balkans',
    countries: [
      { code: 'ALB', name: 'Albania' },
      { code: 'BIH', name: 'Bosnia and Herzegovina' },
      { code: 'MNE', name: 'Montenegro' },
      { code: 'MKD', name: 'North Macedonia' },
      { code: 'SRB', name: 'Serbia' },
      { code: 'XKX', name: 'Kosovo' },
    ],
  },
  {
    id: 'E_NEI',
    title: 'Eastern Neighbourhood & Turkey',
    countries: [
      { code: 'UKR', name: 'Ukraine' },
      { code: 'MDA', name: 'Moldova' },
      { code: 'BLR', name: 'Belarus' },
      { code: 'RUS', name: 'Russia' },
      { code: 'TUR', name: 'Turkey' },
    ],
  },
  {
    id: 'CAUC',
    title: 'Caucasus',
    countries: [
      { code: 'ARM', name: 'Armenia' },
      { code: 'AZE', name: 'Azerbaijan' },
      { code: 'GEO', name: 'Georgia' },
    ],
  },
  {
    id: 'MICRO',
    title: 'European Microstates',
    countries: [
      { code: 'AND', name: 'Andorra' },
      { code: 'MCO', name: 'Monaco' },
      { code: 'SMR', name: 'San Marino' },
    ],
  },
];

/** ISO3 → ISO2 for flag emoji on cards */
const ISO3_TO_ISO2: Record<string, string> = {
  AUT: 'AT', BEL: 'BE', BGR: 'BG', HRV: 'HR', CYP: 'CY', CZE: 'CZ', DNK: 'DK',
  EST: 'EE', FIN: 'FI', FRA: 'FR', DEU: 'DE', GRC: 'GR', HUN: 'HU', IRL: 'IE',
  ITA: 'IT', LVA: 'LV', LTU: 'LT', LUX: 'LU', MLT: 'MT', NLD: 'NL', POL: 'PL',
  PRT: 'PT', ROU: 'RO', SVK: 'SK', SVN: 'SI', ESP: 'ES', SWE: 'SE',
  ISL: 'IS', LIE: 'LI', NOR: 'NO', CHE: 'CH', GBR: 'GB',
  ALB: 'AL', BIH: 'BA', MNE: 'ME', MKD: 'MK', SRB: 'RS', XKX: 'XK',
  UKR: 'UA', MDA: 'MD', BLR: 'BY', RUS: 'RU', TUR: 'TR',
  ARM: 'AM', AZE: 'AZ', GEO: 'GE', AND: 'AD', MCO: 'MC', SMR: 'SM',
};

function flagEmojiFromIso3(iso3: string): string {
  const iso2 = ISO3_TO_ISO2[iso3.toUpperCase()];
  if (!iso2) return '';
  return Array.from(iso2).map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))).join('');
}

/** Small accent palette per group for color + personality */
type Accent = {
  headerFrom: string; headerTo: string; chip: string; ring: string; hoverFrom: string; hoverTo: string;
};
const GROUP_ACCENTS: Record<string, Accent> = {
  EU27:  { headerFrom: 'from-blue-50',    headerTo: 'to-cyan-50',    chip: 'bg-blue-50 border-blue-300',    ring: 'ring-blue-500/30',    hoverFrom: 'from-blue-50',    hoverTo: 'to-white' },
  EFTA:  { headerFrom: 'from-emerald-50', headerTo: 'to-teal-50',    chip: 'bg-emerald-50 border-emerald-300', ring: 'ring-emerald-500/30', hoverFrom: 'from-emerald-50', hoverTo: 'to-white' },
  UK:    { headerFrom: 'from-indigo-50',  headerTo: 'to-sky-50',     chip: 'bg-indigo-50 border-indigo-300', ring: 'ring-indigo-500/30',  hoverFrom: 'from-indigo-50',  hoverTo: 'to-white' },
  WBALK: { headerFrom: 'from-rose-50',    headerTo: 'to-fuchsia-50', chip: 'bg-rose-50 border-rose-300',      ring: 'ring-rose-500/30',    hoverFrom: 'from-rose-50',    hoverTo: 'to-white' },
  E_NEI: { headerFrom: 'from-amber-50',   headerTo: 'to-orange-50',  chip: 'bg-amber-50 border-amber-300',    ring: 'ring-amber-500/30',   hoverFrom: 'from-amber-50',   hoverTo: 'to-white' },
  CAUC:  { headerFrom: 'from-violet-50',  headerTo: 'to-purple-50',  chip: 'bg-violet-50 border-violet-300',  ring: 'ring-violet-500/30',  hoverFrom: 'from-violet-50',  hoverTo: 'to-white' },
  MICRO: { headerFrom: 'from-teal-50',    headerTo: 'to-cyan-50',    chip: 'bg-teal-50 border-teal-300',      ring: 'ring-teal-500/30',    hoverFrom: 'from-teal-50',    hoverTo: 'to-white' },
};

function accentFor(id: string): Accent {
  return GROUP_ACCENTS[id] ?? GROUP_ACCENTS.EU27;
}

/** Search helpers */
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const re = new RegExp(`(${escapeRegExp(query)})`, 'i'); // use capturing group
  const parts = text.split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? <mark key={i} className="bg-yellow-200 rounded px-0.5">{part}</mark> : <span key={i}>{part}</span>
  );
}

/** Simple chevron icon */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7.2 4.7a1 1 0 0 0 0 1.4L11.1 10l-3.9 3.9a1 1 0 1 0 1.4 1.4l4.6-4.6a1.5 1.5 0 0 0 0-2.1L8.6 4.7a1 1 0 0 0-1.4 0z" />
    </svg>
  );
}

export default function CountriesPage() {
  const [q, setQ] = useState('');
  // Collapsed by default on refresh:
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const filtered: Group[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      countries: g.countries.filter(
        (c) => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
      ),
    })).filter((g) => g.countries.length > 0);
  }, [q]);

  const totalCount = useMemo(
    () => GROUPS.reduce((acc, g) => acc + g.countries.length, 0),
    []
  );
  const shownCount = useMemo(
    () => filtered.reduce((acc, g) => acc + g.countries.length, 0),
    [filtered]
  );

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <>
      <main className="max-w-6xl mx-auto p-6 space-y-10 min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero / toolbar */}
      <section className="rounded-2xl border p-6 bg-gradient-to-br from-slate-50 to-white ring-1 ring-inset ring-slate-200 dark:from-slate-800 dark:to-gray-900 dark:border-gray-700 dark:ring-slate-700">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">Explore countries</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Browse Europe and neighbours. Click a country to open its brief.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full border bg-white dark:bg-gray-800 dark:border-gray-600">{shownCount}/{totalCount}</span>
            <label className="sr-only" htmlFor="country-search">Search</label>
            <input
              id="country-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by country or ISO3…"
              className="w-72 max-w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      {/* Groups */}
      {filtered.length === 0 ? (
        <div className="p-6 text-gray-600 dark:text-gray-300 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700">
          No countries match “{q}”. Try a different name or code.
        </div>
      ) : (
        filtered.map((group) => {
          const accent = accentFor(group.id);
          // While searching, auto-expand to show matches; otherwise respect user toggles
          const isOpen = q.trim() ? true : expanded.has(group.id);

          return (
            <section key={group.id} className="space-y-3">
              {/* Header with toggle */}
              <button
                type="button"
                onClick={() => toggle(group.id)}
                aria-expanded={isOpen}
                className={[
                  'w-full rounded-xl p-4 border bg-gradient-to-r flex items-center gap-3 text-left',
                  'transition focus:outline-none focus:ring-2',
                  accent.headerFrom, accent.headerTo, accent.ring,
                  'dark:from-gray-800 dark:to-gray-700 dark:border-gray-700',
                ].join(' ')}
              >
                <Chevron open={isOpen} />
                <span className="text-lg md:text-xl font-semibold">{group.title}</span>
                <span className={['ml-auto text-xs px-2 py-0.5 rounded-full border', accent.chip, 'dark:bg-gray-800 dark:border-gray-600'].join(' ')}>
                  {group.countries.length}
                </span>
              </button>

              {/* Collapsible content */}
              {isOpen ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.countries.map((c) => {
                    const flag = flagEmojiFromIso3(c.code);
                    return (
                      <Link
                        key={c.code}
                        href={`/country/${c.code}`}
                        className={[
                          'group rounded-2xl border p-4 shadow-sm transition focus:outline-none',
                          'hover:-translate-y-0.5 hover:shadow-md ring-1 ring-inset',
                          accent.ring,
                          'bg-gradient-to-br',
                          accent.hoverFrom,
                          accent.hoverTo,
                          'dark:border-gray-700 dark:bg-gray-800 dark:hover:from-gray-700 dark:hover:to-gray-800',
                        ].join(' ')}
                        aria-label={`Open ${c.name}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl leading-none">{flag}</span>
                          <span className="font-medium truncate">{highlight(c.name, q)}</span>
                          <span className="ml-auto opacity-0 group-hover:opacity-100 transition" aria-hidden>→</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })
      )}
      </main>
      <Footer />
    </>
  );
}
