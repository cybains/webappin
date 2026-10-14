import migration from "@/data/hero-migration.json";
import demand from "@/data/hiring-demand-map.json";

const countries: Record<string, { name: string }> = migration.countries;

export default function HeroMapLegend() {
  return (
    <details className="relative z-10 mx-auto max-w-6xl px-6 py-3 text-[11px] leading-relaxed text-slate-600">
      <summary className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700">Map: blue → into the EU · teal → out of the EU ({migration.year}) · amber → EU vacancy pressure ({demand.period}) · Data and sources</summary>
      <div className="mt-3 max-w-3xl space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <p>Selected country-to-country migration corridors. Pulse direction shows the reported direction; line width scales with recorded counts. Pulses are a visual representation, not live movement. These are changes of usual residence for all migration reasons, not recruitment placements or exact travel paths.</p>
        <p><a href={migration.sourceUrls.inbound} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Eurostat immigration data</a> · <a href={migration.sourceUrls.outbound} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Eurostat emigration data</a> · Reference year {migration.year}. e: estimated; p: provisional; b: break in series. No missing values are replaced with invented flows.</p>
        <div className="overflow-x-auto"><table className="w-full text-left"><caption className="mb-2 text-left font-semibold">Selected reported migration flows, {migration.year}</caption><thead><tr><th scope="col" className="py-2 pr-4">From</th><th scope="col" className="py-2 pr-4">To</th><th scope="col" className="py-2 pr-4">People</th><th scope="col" className="py-2">Flag</th></tr></thead><tbody>{migration.routes.map(route => <tr key={`${route.from}-${route.to}`} className="border-t border-slate-100"><td className="py-1 pr-4">{countries[route.from].name}</td><td className="py-1 pr-4">{countries[route.to].name}</td><td className="py-1 pr-4 tabular-nums">{route.persons.toLocaleString("en-US")}</td><td className="py-1">{route.status || "—"}</td></tr>)}</tbody></table></div>
        <p>Amber outlines show the highest job vacancy rates among EU members with comparable data in {demand.period}: {demand.countries.map(country => `${country.name} ${country.rate}%`).join(" · ")}. Vacancy rates indicate unfilled demand, not a direct shortage ranking. <a href={demand.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Eurostat source and coverage notes</a>.</p>
      </div>
    </details>
  );
}
