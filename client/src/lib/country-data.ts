export type Country = { code: string; name: string };
export type CountryGroup = { id: string; title: string; countries: Country[] };

export const COUNTRY_GROUPS: CountryGroup[] = [
  {
    id: 'EU27',
    title: 'European Union (EU-27)',
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

export const ISO3_TO_ISO2: Record<string, string> = {
  AUT: 'AT', BEL: 'BE', BGR: 'BG', HRV: 'HR', CYP: 'CY', CZE: 'CZ', DNK: 'DK',
  EST: 'EE', FIN: 'FI', FRA: 'FR', DEU: 'DE', GRC: 'GR', HUN: 'HU', IRL: 'IE',
  ITA: 'IT', LVA: 'LV', LTU: 'LT', LUX: 'LU', MLT: 'MT', NLD: 'NL', POL: 'PL',
  PRT: 'PT', ROU: 'RO', SVK: 'SK', SVN: 'SI', ESP: 'ES', SWE: 'SE',
  ISL: 'IS', LIE: 'LI', NOR: 'NO', CHE: 'CH', GBR: 'GB',
  ALB: 'AL', BIH: 'BA', MNE: 'ME', MKD: 'MK', SRB: 'RS', XKX: 'XK',
  UKR: 'UA', MDA: 'MD', BLR: 'BY', RUS: 'RU', TUR: 'TR',
  ARM: 'AM', AZE: 'AZ', GEO: 'GE', AND: 'AD', MCO: 'MC', SMR: 'SM',
};

export function flagEmojiFromIso3(iso3: string): string {
  const iso2 = ISO3_TO_ISO2[iso3.toUpperCase()];
  if (!iso2) return '';
  return Array.from(iso2).map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))).join('');
}

export const TOTAL_COUNTRY_COUNT = COUNTRY_GROUPS.reduce(
  (acc, group) => acc + group.countries.length,
  0,
);
