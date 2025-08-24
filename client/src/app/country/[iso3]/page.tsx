'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Fact = {
  indicator?: string;
  latest_year?: number;
  latest_value?: number | string;
  yoy?: number | string;
  pctl?: number;
  lag_years?: number;
};

type Narrative = {
  summary_md?: string;
  sections?: { title?: string; body_md?: string }[];
  personas?: string[];
  facts_used?: Fact[];
  callouts?: { strengths?: string[]; watchouts?: string[] };
  source_links?: { label?: string; url: string }[];
};

export default function CountryPage({ params }: { params: { iso3: string } }) {
  const iso3 = (params.iso3 || '').toUpperCase();
  const [data, setData] = useState<Narrative | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/data/v1/countries/${iso3}_narrative.json`)
      .then(r => (r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)))
      .then(setData)
      .catch(e => setErr(String(e)));
  }, [iso3]);

  if (err) {
    return (
      <main className="max-w-3xl mx-auto p-6 space-y-4">
        <Link href="/countries" className="text-blue-600 hover:underline">← Back</Link>
        <div className="p-4 bg-red-50 border text-red-700 rounded">Could not load {iso3}: {err}</div>
      </main>
    );
  }
  if (!data) return <div className="p-6">Loading {iso3}…</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Link href="/countries" className="text-blue-600 hover:underline">← Back to countries</Link>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{iso3}</h1>
        {/* simple markdown-ish rendering without extra deps */}
        {data.summary_md ? (
          <div className="prose whitespace-pre-wrap">{data.summary_md}</div>
        ) : null}
      </header>

      {data.callouts && (data.callouts.strengths?.length || data.callouts.watchouts?.length) ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Callouts</h2>
          <div className="flex flex-wrap gap-2">
            {(data.callouts.strengths ?? []).map((s, i) => (
              <span key={`s-${i}`} className="text-xs px-2 py-1 rounded-full border border-green-300">{s}</span>
            ))}
            {(data.callouts.watchouts ?? []).map((w, i) => (
              <span key={`w-${i}`} className="text-xs px-2 py-1 rounded-full border border-amber-300">{w}</span>
            ))}
          </div>
        </section>
      ) : null}

      {Array.isArray(data.personas) && data.personas.length ? (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Personas</h2>
          <ul className="list-disc pl-6 space-y-1">
            {data.personas.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>
      ) : null}

      {Array.isArray(data.facts_used) && data.facts_used.length ? (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Key facts</h2>
          <ul className="list-disc pl-6 space-y-1">
            {data.facts_used!.map((f, i) => (
              <li key={i}>
                <strong>{f.indicator ?? 'Indicator'}</strong>{' '}
                {f.latest_year ? `(${f.latest_year})` : ''}: {String(f.latest_value ?? '—')}
                {typeof f.yoy !== 'undefined' ? ` • YoY: ${f.yoy}` : ''}
                {typeof f.pctl !== 'undefined' ? ` • pctile: ${f.pctl}` : ''}
                {typeof f.lag_years !== 'undefined' ? ` • lag: ${f.lag_years}y` : ''}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {Array.isArray(data.sections) && data.sections.length ? (
        <section className="space-y-4">
          {data.sections.map((sec, i) => (
            <article key={i} className="space-y-2">
              <h3 className="text-lg font-medium">{sec.title ?? `Section ${i + 1}`}</h3>
              <div className="whitespace-pre-wrap">{sec.body_md ?? ''}</div>
            </article>
          ))}
        </section>
      ) : null}

      {Array.isArray(data.source_links) && data.source_links.length ? (
        <footer className="space-y-2">
          <h2 className="text-xl font-semibold">Sources</h2>
          <ul className="list-disc pl-6 space-y-1">
            {data.source_links.map((s, i) => (
              <li key={i}>
                <a className="text-blue-600 hover:underline" href={s.url} target="_blank" rel="noreferrer">
                  {s.label ?? s.url}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      ) : null}
    </main>
  );
}
