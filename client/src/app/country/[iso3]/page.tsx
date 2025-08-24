'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

/** ---------- Types matching your narrative JSON ---------- */
type Pctl = { world?: number; region?: number; income?: number };
type Fact = {
  code: string;
  year?: number;
  value?: number;
  lag_years?: number;
  yoy?: number; // optional, if you add later we show it
  pctl?: Pctl;
};

type Narrative = {
  iso3?: string;
  year?: number;
  summary_md?: string;
  sections?: Record<string, string>;
  persona_highlights?: {
    job_seeker?: string[];
    entrepreneur?: string[];
    digital_nomad?: string[];
    expat_family?: string[];
  };
  facts_used?: Fact[];
  callouts?: {
    strengths?: { code?: string; label?: string }[];
    watchouts?: { code?: string; label?: string }[];
  };
  source_links?: Record<string, string>;
};

/** ---------- Display dictionaries ---------- */
const INDICATORS: Record<
  string,
  { label: string; unit?: 'usd' | 'percent' | 'pp' | 'years' | 't' | 'people'; notes?: string; lowerIsBetter?: boolean }
> = {
  'NY.GDP.PCAP.KD': { label: 'GDP per capita, constant USD', unit: 'usd', notes: 'real, chained USD' },
  'SP.POP.TOTL': { label: 'Population', unit: 'people', notes: 'level only' },
  'SP.DYN.LE00.IN': { label: 'Life expectancy', unit: 'years' },
  'SL.UEM.TOTL.ZS': { label: 'Unemployment', unit: 'percent', notes: 'lower is better', lowerIsBetter: true },
  'IT.NET.USER.ZS': { label: 'Internet users', unit: 'percent', notes: '% of population' },
  'SE.TER.ENRR': { label: 'Tertiary enrollment (gross)', unit: 'percent' },
  'EN.ATM.CO2E.PC': { label: 'CO₂ per capita', unit: 't', notes: 'lower is better', lowerIsBetter: true },
  'FP.CPI.TOTL.ZG': { label: 'Inflation (CPI)', unit: 'percent', notes: 'annual CPI' },
  'NE.EXP.GNFS.ZS': { label: 'Exports of goods & services (% of GDP)', unit: 'percent' },
};

const ORDER = [
  'NY.GDP.PCAP.KD',
  'SP.DYN.LE00.IN',
  'SL.UEM.TOTL.ZS',
  'IT.NET.USER.ZS',
  'FP.CPI.TOTL.ZG',
  'NE.EXP.GNFS.ZS',
  'SP.POP.TOTL',
  'SE.TER.ENRR',
  'EN.ATM.CO2E.PC',
];

/** ISO3 → ISO2 (for flag emoji) + fallback name mapping for display */
const ISO3_TO_ISO2: Record<string, string> = {
  AUT: 'AT', BEL: 'BE', BGR: 'BG', HRV: 'HR', CYP: 'CY', CZE: 'CZ', DNK: 'DK',
  EST: 'EE', FIN: 'FI', FRA: 'FR', DEU: 'DE', GRC: 'GR', HUN: 'HU', IRL: 'IE',
  ITA: 'IT', LVA: 'LV', LTU: 'LT', LUX: 'LU', MLT: 'MT', NLD: 'NL', POL: 'PL',
  PRT: 'PT', ROU: 'RO', SVK: 'SK', SVN: 'SI', ESP: 'ES', SWE: 'SE', ISL: 'IS',
  LIE: 'LI', NOR: 'NO', CHE: 'CH', GBR: 'GB', ALB: 'AL', BIH: 'BA', MNE: 'ME',
  MKD: 'MK', SRB: 'RS', XKX: 'XK', UKR: 'UA', MDA: 'MD', BLR: 'BY', RUS: 'RU',
  TUR: 'TR', ARM: 'AM', AZE: 'AZ', GEO: 'GE', AND: 'AD', MCO: 'MC', SMR: 'SM',
};

const ISO3_TO_NAME: Record<string, string> = {
  AUT: 'Austria', BEL: 'Belgium', BGR: 'Bulgaria', HRV: 'Croatia', CYP: 'Cyprus', CZE: 'Czech Republic',
  DNK: 'Denmark', EST: 'Estonia', FIN: 'Finland', FRA: 'France', DEU: 'Germany', GRC: 'Greece',
  HUN: 'Hungary', IRL: 'Ireland', ITA: 'Italy', LVA: 'Latvia', LTU: 'Lithuania', LUX: 'Luxembourg',
  MLT: 'Malta', NLD: 'Netherlands', POL: 'Poland', PRT: 'Portugal', ROU: 'Romania', SVK: 'Slovakia',
  SVN: 'Slovenia', ESP: 'Spain', SWE: 'Sweden', ISL: 'Iceland', LIE: 'Liechtenstein', NOR: 'Norway',
  CHE: 'Switzerland', GBR: 'United Kingdom', ALB: 'Albania', BIH: 'Bosnia and Herzegovina',
  MNE: 'Montenegro', MKD: 'North Macedonia', SRB: 'Serbia', XKX: 'Kosovo', UKR: 'Ukraine',
  MDA: 'Moldova', BLR: 'Belarus', RUS: 'Russia', TUR: 'Turkey', ARM: 'Armenia', AZE: 'Azerbaijan',
  GEO: 'Georgia', AND: 'Andorra', MCO: 'Monaco', SMR: 'San Marino',
};

/** ---------- Helpers ---------- */
function flagEmojiFromIso3(iso3?: string): string {
  const iso2 = iso3 ? ISO3_TO_ISO2[iso3.toUpperCase()] : undefined;
  if (!iso2) return '';
  return Array.from(iso2.toUpperCase()).map(c => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))).join('');
}
function fmtNumber(n: number, fractionDigits = 1) {
  return n.toLocaleString(undefined, { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits });
}
function fmtValue(code: string, v?: number): string {
  if (v == null || Number.isNaN(v)) return '—';
  const meta = INDICATORS[code];
  const unit = meta?.unit;
  if (unit === 'usd') return `$${fmtNumber(v, v >= 100 ? 0 : 1)}`;
  if (unit === 'percent') return `${fmtNumber(v, Math.abs(v) < 1 ? 2 : 1)}%`;
  if (unit === 'pp') return `${fmtNumber(v, 1)} pp`;
  if (unit === 'years') return `${fmtNumber(v, 1)} yrs`;
  if (unit === 't') return `${fmtNumber(v, 1)} t`;
  if (unit === 'people') return Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(v);
  return fmtNumber(v, 1);
}
function pctile(n?: number): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return `${Math.round(n)}`;
}
async function fetchNameFromManifest(iso3: string): Promise<string | null> {
  try {
    const r = await fetch('/data/v1/index.json', { cache: 'force-cache' });
    if (!r.ok) return null;
    const m = await r.json();
    const found = (m?.countries ?? []).find((c: any) => c.iso3?.toUpperCase() === iso3);
    return found?.name ?? null;
  } catch { return null; }
}

/** ---------- Page ---------- */
export default function CountryPage() {
  const params = useParams<{ iso3: string }>();
  const iso3 = (params?.iso3 ?? '').toUpperCase();

  const [data, setData] = useState<Narrative | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!iso3) return;
    fetch(`/data/v1/countries/${iso3}_narrative.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)))
      .then((j: Narrative) => setData(j))
      .catch((e) => setErr(String(e)));
    fetchNameFromManifest(iso3).then(n => setName(n || ISO3_TO_NAME[iso3] || iso3));
  }, [iso3]);

  const factsOrdered: Fact[] = useMemo(() => {
    const facts = data?.facts_used ?? [];
    const byCode = new Map(facts.map(f => [f.code, f]));
    const primary: Fact[] = ORDER.map(code => byCode.get(code)).filter(Boolean) as Fact[];
    const extras = facts.filter(f => !ORDER.includes(f.code));
    return [...primary, ...extras];
  }, [data]);

  const hasAnyYoY = useMemo(() => (data?.facts_used ?? []).some(f => typeof f.yoy === 'number'), [data]);
  const flag = flagEmojiFromIso3(iso3);
  const snapshot = data?.year ? String(data.year) : '—';
  const headerName = name ?? ISO3_TO_NAME[iso3] ?? iso3;

  if (err) {
    return (
      <main className="max-w-6xl mx-auto p-6 space-y-4">
        <div className="p-4 bg-red-50 border text-red-700 rounded">Could not load {iso3}: {err}</div>
      </main>
    );
  }
  if (!data) return <div className="p-6">Loading {iso3}…</div>;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Breadcrumb instead of back link */}
      <nav className="text-sm text-gray-600">
        <Link href="/countries" className="hover:underline">Countries</Link>
        <span className="mx-2">›</span>
        <span className="font-medium text-gray-800">{headerName}</span>
      </nav>

      {/* Header / hero */}
      <header className="rounded-2xl border p-6 bg-white/70 dark:bg-black/20">
        <div className="flex items-center gap-4">
          <div className="text-4xl leading-none">{flag}</div>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold truncate">{headerName} — Country Brief</h1>
            <div className="mt-1 text-sm text-gray-600">
              Data snapshot: {snapshot} • Dataset: World Bank (WDI & related)
            </div>
          </div>
          <span className="ml-auto text-xs px-2 py-1 rounded-full border">{iso3}</span>
        </div>
        {data.summary_md ? (
          <p className="mt-4 text-gray-800 whitespace-pre-wrap">{data.summary_md}</p>
        ) : null}
      </header>

      {/* KPI Table */}
      {factsOrdered.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Headline KPIs (latest available)</h2>
          <div className="overflow-auto rounded-2xl border bg-white/60 dark:bg-black/20">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Indicator (code)</th>
                  <th className="px-4 py-3 font-medium">Value (year)</th>
                  {hasAnyYoY ? <th className="px-4 py-3 font-medium">YoY</th> : null}
                  <th className="px-4 py-3 font-medium">Percentile (World)</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {factsOrdered.map((f, i) => {
                  const meta = INDICATORS[f.code] ?? { label: f.code };
                  const value = fmtValue(f.code, f.value);
                  const yr = f.year != null ? f.year : '—';
                  const worldPctRaw = typeof f.pctl?.world === 'number' ? f.pctl!.world! : undefined;
                  const worldPctTxt = pctile(worldPctRaw);

                  return (
                    <tr key={`${f.code}-${i}`} className="border-t align-top">
                      <td className="px-4 py-3">
                        <div className="font-medium">{meta.label}</div>
                        <div className="text-xs text-gray-500">{f.code}</div>
                      </td>
                      <td className="px-4 py-3">{value} {yr !== '—' ? `(${yr})` : ''}</td>
                      {hasAnyYoY ? (
                        <td className="px-4 py-3">
                          {typeof f.yoy === 'number'
                            ? (INDICATORS[f.code]?.unit === 'percent'
                                ? `${fmtNumber(f.yoy, 1)} pp`
                                : `${fmtNumber(f.yoy, 1)}%`)
                            : '—'}
                        </td>
                      ) : null}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-block text-xs px-2 py-0.5 rounded-full border">{worldPctTxt}</span>
                          {/* simple percentile bar */}
                          <div className="h-2 rounded bg-gray-200 w-32 overflow-hidden">
                            <div
                              className="h-2 rounded bg-gray-600"
                              style={{ width: worldPctRaw != null ? `${Math.max(0, Math.min(100, worldPctRaw))}%` : '0%' }}
                              aria-label={`World percentile ${worldPctTxt}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{meta.notes ?? ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600">
            Benchmarks: world percentile shown above; region & income-group percentiles available per series when included.
          </p>
        </section>
      ) : null}

      {/* Narrative sections */}
      {data.sections && Object.keys(data.sections).length ? (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.sections).map(([k, md]) => (
            <article key={k} className="rounded-2xl border p-4 bg-white/60 dark:bg-black/20">
              <h3 className="text-lg font-semibold mb-1">
                {k
                  .replace(/_md$/, '')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, s => s.toUpperCase())}
              </h3>
              <div className="text-sm whitespace-pre-wrap">{md}</div>
            </article>
          ))}
        </section>
      ) : null}

      {/* Persona indices */}
      {data.persona_highlights && Object.keys(data.persona_highlights).length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Persona indices (0–100)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['job_seeker','entrepreneur','digital_nomad','expat_family'] as const).map((k) => {
              const arr = data.persona_highlights?.[k];
              if (!arr || !arr.length) return null;
              const scoreMatch = String(arr[0]).match(/(\d+(\.\d+)?)/);
              const scoreNum = scoreMatch ? Number(scoreMatch[1]) : undefined;
              const scoreText = scoreMatch ? scoreMatch[1] : '—';
              const title = k.replace('_', ' ').replace(/\b\w/g, s => s.toUpperCase());

              return (
                <div key={k} className="rounded-2xl border p-4 bg-white/60 dark:bg-black/20">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-medium">{title}</h3>
                    <div className="text-2xl font-semibold">{scoreText}</div>
                  </div>
                  <div className="h-2 rounded bg-gray-200 overflow-hidden mb-3" aria-hidden>
                    <div
                      className="h-2 rounded bg-gray-700"
                      style={{ width: scoreNum != null ? `${Math.max(0, Math.min(100, scoreNum))}%` : '0%' }}
                    />
                  </div>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {arr.slice(1).map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Callouts */}
      {(data.callouts?.strengths?.length || data.callouts?.watchouts?.length) ? (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Callouts</h2>
          <div className="flex flex-wrap gap-2">
            {(data.callouts?.strengths ?? []).map((s, i) => (
              <span key={`s-${i}`} className="text-xs px-2 py-1 rounded-full border border-green-300 bg-green-50">
                ✅ {s.label ?? s.code ?? 'Strength'}
              </span>
            ))}
            {(data.callouts?.watchouts ?? []).map((w, i) => (
              <span key={`w-${i}`} className="text-xs px-2 py-1 rounded-full border border-amber-300 bg-amber-50">
                ⚠️ {w.label ?? w.code ?? 'Watch-out'}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Sources */}
      {data.source_links && Object.keys(data.source_links).length ? (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Sources</h2>
          <ul className="list-disc pl-6 space-y-1">
            {Object.entries(data.source_links).map(([code, url]) => (
              <li key={code}>
                <a className="text-blue-600 hover:underline" href={url} target="_blank" rel="noreferrer">
                  {code} — {INDICATORS[code]?.label ?? 'Indicator'}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
