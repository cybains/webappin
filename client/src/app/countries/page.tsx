import Link from 'next/link';

type Country = { code: string; name: string };

const GROUPS: { id: string; title: string; countries: Country[] }[] = [
  {
    id: 'EU27',
    title: 'EU27',
    countries: [
      { code: 'AUT', name: 'Austria' },
      { code: 'BEL', name: 'Belgium' },
      { code: 'BGR', name: 'Bulgaria' },
      { code: 'HRV', name: 'Croatia' },
      { code: 'CYP', name: 'Cyprus' },
      { code: 'CZE', name: 'Czech Republic' },
      { code: 'DNK', name: 'Denmark' },
      { code: 'EST', name: 'Estonia' },
      { code: 'FIN', name: 'Finland' },
      { code: 'FRA', name: 'France' },
      { code: 'DEU', name: 'Germany' },
      { code: 'GRC', name: 'Greece' },
      { code: 'HUN', name: 'Hungary' },
      { code: 'IRL', name: 'Ireland' },
      { code: 'ITA', name: 'Italy' },
      { code: 'LVA', name: 'Latvia' },
      { code: 'LTU', name: 'Lithuania' },
      { code: 'LUX', name: 'Luxembourg' },
      { code: 'MLT', name: 'Malta' },
      { code: 'NLD', name: 'Netherlands' },
      { code: 'POL', name: 'Poland' },
      { code: 'PRT', name: 'Portugal' },
      { code: 'ROU', name: 'Romania' },
      { code: 'SVK', name: 'Slovakia' },
      { code: 'SVN', name: 'Slovenia' },
      { code: 'ESP', name: 'Spain' },
      { code: 'SWE', name: 'Sweden' },
    ],
  },
  {
    id: 'EFTA',
    title: 'EFTA',
    countries: [
      { code: 'ISL', name: 'Iceland' },
      { code: 'LIE', name: 'Liechtenstein' },
      { code: 'NOR', name: 'Norway' },
      { code: 'CHE', name: 'Switzerland' },
    ],
  },
  {
    id: 'UK',
    title: 'UK',
    countries: [{ code: 'GBR', name: 'United Kingdom' }],
  },
  {
    id: 'WBALK',
    title: 'WBALK',
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
    title: 'E_NEI',
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
    title: 'CAUC',
    countries: [
      { code: 'ARM', name: 'Armenia' },
      { code: 'AZE', name: 'Azerbaijan' },
      { code: 'GEO', name: 'Georgia' },
    ],
  },
  {
    id: 'MICRO',
    title: 'MICRO',
    countries: [
      { code: 'AND', name: 'Andorra' },
      { code: 'MCO', name: 'Monaco' },
      { code: 'SMR', name: 'San Marino' },
    ],
  },
];

const combinedCodes = GROUPS.flatMap((g) => g.countries.map((c) => c.code));

export default function CountriesPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Country Groupings</h1>
      {GROUPS.map((group) => (
        <section key={group.id} className="space-y-2">
          <h2 className="text-2xl font-semibold">{group.title}</h2>
          <ul className="list-disc pl-6 space-y-1">
            {group.countries.map((c) => (
              <li key={c.code}>
                <Link href={`/country/${c.code}`}>{c.code} – {c.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Combined Curated Set</h2>
        <p>{combinedCodes.join(', ')}</p>
      </section>
    </main>
  );
}

