'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CountryEntry = {
  iso3: string;
  name: string;
  files: { narrative: string };
  has_api?: boolean;
  updated_at?: string;
};

type Manifest = {
  version: 'v1';
  generated_at: string;
  countries: CountryEntry[];
};

export default function CountriesPage() {
  const [data, setData] = useState<Manifest | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/v1/index.json')
      .then(r => (r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)))
      .then(setData)
      .catch(e => setErr(String(e)));
  }, []);

  if (err) return <div className="p-6 text-red-600">Error loading countries: {err}</div>;
  if (!data) return <div className="p-6">Loading countries…</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Countries</h1>
      <ul className="divide-y">
        {data.countries.map(c => (
          <li key={c.iso3} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-500">{c.iso3} • updated {c.updated_at ?? '—'}</div>
            </div>
            <div className="flex items-center gap-3">
              {c.has_api ? <span className="text-xs px-2 py-1 rounded-full border">Live API</span> : null}
              <Link className="text-blue-600 hover:underline" href={`/country/${c.iso3}`}>Open</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
