import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const year = 2024;
const countries = {
  DE: { name: "Germany", lon: 10.5, lat: 51 },
  ES: { name: "Spain", lon: -3.7, lat: 40 },
  AT: { name: "Austria", lon: 14, lat: 47.5 },
  NL: { name: "Netherlands", lon: 5.3, lat: 52.2 },
  IN: { name: "India", lon: 78, lat: 22 },
  PH: { name: "Philippines", lon: 122, lat: 12 },
  US: { name: "United States", lon: -98, lat: 39 },
  AU: { name: "Australia", lon: 134, lat: -25 },
  MA: { name: "Morocco", lon: -7, lat: 32 },
  CO: { name: "Colombia", lon: -74, lat: 4 },
  TR: { name: "Türkiye", lon: 35, lat: 39 },
  RS: { name: "Serbia", lon: 21, lat: 44 },
  GH: { name: "Ghana", lon: -1.2, lat: 7.9 },
  NG: { name: "Nigeria", lon: 8, lat: 9 },
  EG: { name: "Egypt", lon: 30, lat: 27 },
  ZA: { name: "South Africa", lon: 25, lat: -29 },
  BR: { name: "Brazil", lon: -52, lat: -12 },
  AR: { name: "Argentina", lon: -64, lat: -34 },
  CA: { name: "Canada", lon: -106, lat: 56 },
  CN: { name: "China", lon: 104, lat: 35 },
  PK: { name: "Pakistan", lon: 69, lat: 30 },
  VN: { name: "Viet Nam", lon: 106, lat: 16 },
};
// A selection of reported bilateral corridors, not an exhaustive or ranked set.
const pairs = [
  ["DE", "IN"], ["DE", "PH"], ["DE", "US"], ["DE", "TR"],
  ["ES", "MA"], ["ES", "CO"], ["AT", "RS"], ["NL", "AU"],
  ["DE", "GH"], ["DE", "NG"], ["DE", "EG"], ["NL", "ZA"],
  ["ES", "BR"], ["ES", "AR"], ["NL", "CA"], ["DE", "CN"],
  ["DE", "PK"], ["DE", "VN"],
];
const datasets = { inbound: "migr_imm5prv", outbound: "migr_emi3nxt" };
const responses = new Map();
await Promise.all([...new Set(pairs.map(([reporter]) => reporter))].flatMap(reporter => Object.entries(datasets).map(async ([direction, dataset]) => {
  const url = `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${dataset}?lang=en&freq=A&time=${year}&geo=${reporter}&sex=T&age=TOTAL&agedef=COMPLET&unit=NR`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${dataset} ${reporter}: HTTP ${response.status}`);
  const data = await response.json();
  if (!data.id?.includes("partner") || data.id.some((id, index) => id !== "partner" && data.size[index] !== 1)) throw new Error("Unexpected Eurostat dimensions");
  responses.set(`${reporter}-${direction}`, { data, url, dataset });
})));
const routes = [];
const missing = [];
for (const [reporter, partner] of pairs) {
  for (const direction of Object.keys(datasets)) {
    const { data, url, dataset } = responses.get(`${reporter}-${direction}`);
    const index = data.dimension.partner.category.index[partner];
    const value = index === undefined ? undefined : data.value?.[index];
    if (!Number.isFinite(value) || value <= 0) { missing.push(`${reporter}-${partner}-${direction}`); continue; }
    routes.push({ from: direction === "inbound" ? partner : reporter, to: direction === "inbound" ? reporter : partner, direction, persons: value, status: data.status?.[index] || "", dataset, apiUrl: url });
  }
}
if (!routes.some(route => route.direction === "inbound") || !routes.some(route => route.direction === "outbound")) throw new Error("Both directions required; previous snapshot preserved");
const output = path.join(root, "src/data/hero-migration.json");
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify({ year, source: "Eurostat", retrievedAt: new Date().toISOString(), countries, routes, missing, sourceUrls: { inbound: "https://ec.europa.eu/eurostat/databrowser/view/migr_imm5prv/default/table?lang=en", outbound: "https://ec.europa.eu/eurostat/databrowser/view/migr_emi3nxt/default/table?lang=en" }, definition: "Annual changes of usual residence. All ages and sexes; not employment-only movement. Locations and arcs are schematic country connections, not actual travel paths. Selected reported corridors, not all migration or a ranking. e = estimated; p = provisional; b = break in series." }, null, 2) + "\n");
console.log(`Saved ${routes.length} reported migration flows; ${missing.length} missing observations omitted.`);
