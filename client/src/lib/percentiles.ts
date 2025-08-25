export type PercentileEntry = { iso3: string; pctl: number };
export type PercentileMap = Record<string, PercentileEntry[]>;

let cache: PercentileMap | null = null;

async function loadAll(): Promise<PercentileMap> {
  if (cache) return cache;
  try {
    const idxResp = await fetch('/data/v1/index.json', { cache: 'force-cache' });
    if (!idxResp.ok) return {};
    const idx = await idxResp.json() as { countries?: { iso3?: string; files?: { narrative?: string } }[] };
    const countries = idx.countries ?? [];
    const results: PercentileMap = {};
    await Promise.all(
      countries.map(async (c) => {
        const iso3 = c.iso3;
        const url = c.files?.narrative;
        if (!iso3 || !url) return;
        try {
          const r = await fetch(url, { cache: 'force-cache' });
          if (!r.ok) return;
          const data = await r.json() as { facts_used?: { code?: string; pctl?: { world?: number } }[] };
          for (const f of data.facts_used ?? []) {
            const code = f.code;
            const pct = f.pctl?.world;
            if (!code || typeof pct !== 'number') continue;
            if (!results[code]) results[code] = [];
            results[code]!.push({ iso3, pctl: pct });
          }
        } catch {
          /* ignore failed fetch */
        }
      })
    );
    cache = results;
    return results;
  } catch {
    return {};
  }
}

export async function findNearestCountry(code: string, target: number): Promise<string | null> {
  const map = await loadAll();
  const list = map[code];
  if (!list || !list.length) return null;
  let best = list[0];
  let bestDiff = Math.abs(list[0].pctl - target);
  for (const item of list) {
    const diff = Math.abs(item.pctl - target);
    if (diff < bestDiff) {
      best = item;
      bestDiff = diff;
    }
  }
  return best.iso3;
}
