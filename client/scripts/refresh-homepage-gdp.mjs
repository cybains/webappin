import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const countries = [
  { code: "AT", iso3: "AUT", name: "Austria" },
  { code: "DE", iso3: "DEU", name: "Germany" },
  { code: "PL", iso3: "POL", name: "Poland" },
  { code: "RO", iso3: "ROU", name: "Romania" },
];
const indicator = "NY.GDP.PCAP.KD";
const startYear = 2000;
const endYear = 2024;
const apiUrl = `https://api.worldbank.org/v2/country/${countries.map(country => country.iso3).join(";")}/indicator/${indicator}?format=json&date=${startYear}:${endYear}&source=2&per_page=200`;

const response = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) });
if (!response.ok) throw new Error(`World Bank request failed: HTTP ${response.status}`);
const [metadata, observations] = await response.json();
if (!metadata || metadata.pages !== 1 || !Array.isArray(observations)) {
  throw new Error("Unexpected or incomplete World Bank response; previous snapshot preserved.");
}
const rows = Array.from({ length: endYear - startYear + 1 }, (_, index) => {
  const year = startYear + index;
  return Object.fromEntries([
    ["year", year],
    ...countries.map(country => {
      const matches = observations.filter(observation => observation.countryiso3code === country.iso3 && Number(observation.date) === year);
      if (matches.length !== 1 || matches[0].indicator?.id !== indicator || typeof matches[0].value !== "number" || !Number.isFinite(matches[0].value) || matches[0].value <= 0) {
        throw new Error(`Missing or invalid observation for ${country.iso3} ${year}; previous snapshot preserved.`);
      }
      return [country.code, matches[0].value];
    }),
  ]);
});
const snapshot = {
  indicator,
  title: "GDP per capita",
  unit: "constant 2015 US$",
  source: "World Bank World Development Indicators",
  sourceUrl: `https://data.worldbank.org/indicator/${indicator}?locations=AT-DE-PL-RO`,
  apiUrl,
  license: "CC BY 4.0",
  sourceLastUpdated: metadata.lastupdated,
  retrievedAt: new Date().toISOString(),
  startYear,
  endYear,
  countries,
  rows,
};
const output = path.join(root, "src/data/homepage-gdp.json");
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Saved ${rows.length * countries.length} verified observations (${startYear}–${endYear}).`);
