import Link from 'next/link';

type Country = { code: string; name: string };

const GROUPS: { id: string; title: string; countries: Country[] }[] = [
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

/** ISO3 → ISO2 for flag emoji rendering (used in cards) */
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
  return Array.from(iso2).map(c => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))).join('');
}

export default function CountriesPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-12">
      {/* No big "Country Groupings" heading as requested */}

      {GROUPS.map((group) => (
        <section key={group.id} className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">{group.title}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.countries.map((c) => {
              const flag = flagEmojiFromIso3(c.code);
              return (
                <Link
                  key={c.code}
                  href={`/country/${c.code}`}
                  className="group rounded-2xl border bg-white/70 dark:bg-black/20 p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Open ${c.name}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{flag}</span>
                    <span className="font-medium truncate">{c.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
