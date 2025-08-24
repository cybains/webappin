'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

const countryGroups = [
  {
    id: 'digital-nomad',
    title: 'Digital Nomad Hotspots',
    image: '/digital-nomad.jpg',
    countries: ['Portugal', 'Estonia', 'Thailand'],
  },
  {
    id: 'expat-family',
    title: 'Expat Family Friendly',
    image: '/expat-family.jpg',
    countries: ['Canada', 'New Zealand', 'Netherlands'],
  },
];

export default function CountriesPage() {
  const [data, setData] = useState<Manifest | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/v1/index.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)))
      .then(setData)
      .catch((e) => setErr(String(e)));
  }, []);

  return (
    <main
      className="py-16 px-4"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Curated groups section */}
        <section>
          <h1 className="text-3xl font-bold text-center mb-10">Curated Country Groups</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {countryGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl overflow-hidden shadow border border-gray-200 bg-white/80 dark:bg-black/20"
              >
                <div className="relative h-40 w-full">
                  <Image src={group.image} alt={group.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{group.title}</h2>
                  <ul className="space-y-1 text-sm">
                    {group.countries.map((country) => (
                      <li key={country}>{country}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All countries (from index.json) */}
        <section className="max-w-3xl mx-auto w-full">
          <h2 className="text-2xl font-semibold mb-4">All Countries</h2>

          {err ? (
            <div className="p-4 bg-red-50 border text-red-700 rounded">
              Error loading countries: {err}
            </div>
          ) : !data ? (
            <div>Loading countries…</div>
          ) : (
            <ul className="divide-y">
              {data.countries.map((c) => (
                <li key={c.iso3} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-gray-500">
                      {c.iso3} • updated {c.updated_at ?? '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.has_api ? (
                      <span className="text-xs px-2 py-1 rounded-full border">Live API</span>
                    ) : null}
                    <Link className="text-blue-600 hover:underline" href={`/country/${c.iso3}`}>
                      Open
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
