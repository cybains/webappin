// scripts/build-index.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COUNTRIES_DIR = path.join(ROOT, "client/public/data/v1/countries");
const MANIFEST_PATH = path.join(ROOT, "client/public/data/v1/index.json");

// Optional mapping. Fill in names you care about; fallback is ISO3.
const ISO3_TO_NAME = {
  AUT: "Austria",
  PRT: "Portugal",
  // Add more as needed, e.g. DEU: "Germany", FRA: "France", ...
};

function pickCountryName(iso3, json) {
  // Try to guess a human name from the file, else mapping, else ISO3
  const candidates = [
    json?.country_name,
    json?.country,
    json?.meta?.country_name,
    json?.meta?.country,
    json?.name,
  ].filter(Boolean);
  return candidates[0] || ISO3_TO_NAME[iso3] || iso3;
}

function inferUpdatedAt(json) {
  // Try to infer from facts_used.latest_year; else today.
  try {
    const years = (json?.facts_used || [])
      .map(f => Number(f?.latest_year))
      .filter(y => Number.isFinite(y));
    const y = years.length ? Math.max(...years) : null;
    if (y) {
      // Use Dec 31 of that year as a simple, consistent date
      return `${y}-12-31`;
    }
  } catch {}
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function main() {
  const files = fs
    .readdirSync(COUNTRIES_DIR, { withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => d.name)
    .filter(n => /^[A-Z]{3}_narrative\.json$/.test(n));

  if (!files.length) {
    console.error(`No *_narrative.json files found in ${COUNTRIES_DIR}`);
    process.exit(1);
  }

  const countries = files.map(fname => {
    const iso3 = fname.slice(0, 3).toUpperCase();
    const abs = path.join(COUNTRIES_DIR, fname);
    let json = {};
    try {
      json = JSON.parse(fs.readFileSync(abs, "utf8"));
    } catch {
      // keep empty json if parse fails
    }
    const name = pickCountryName(iso3, json);
    const updated_at = inferUpdatedAt(json);

    return {
      iso3,
      name,
      updated_at,
      has_api: false,
      files: { narrative: `/data/v1/countries/${fname}` },
    };
  });

  const manifest = {
    version: "v1",
    generated_at: new Date().toISOString(),
    countries: countries.sort((a, b) => a.name.localeCompare(b.name)),
  };

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Wrote manifest with ${countries.length} countries → ${MANIFEST_PATH}`);
}

main();
