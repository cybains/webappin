import { getTranslator } from '@/lib/i18n/server';
import type { Locale } from '@/lib/i18n/shared';
import migration from "@/data/hero-migration.json";
import demand from "@/data/hiring-demand-map.json";

const countries: Record<string, { name: string }> = migration.countries;

export default function HeroMapLegend({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <div className="relative z-10 min-w-0 max-w-full overflow-hidden">
    <details className="relative z-10 mx-auto max-w-6xl px-6 py-3 text-[11px] leading-relaxed text-slate-600">
      <summary className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700">{t("About the map & data sources")}</summary>
      <div className="mt-3 max-w-3xl space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <p>{t("This map uses Eurostat migration flows and EU job-vacancy rates: context for where to look, rather than evidence of availability for your role.")}</p>
        <p>{t("Blue → into the EU · teal → out of the EU (")}{migration.year}{t(") · amber → EU vacancy pressure (")}{demand.period}).</p>
        <p>{t("Selected country-to-country migration corridors. Pulse direction shows the reported direction; line width scales with recorded counts. Pulses are a visual representation, not live movement. These are changes of usual residence for all migration reasons, not recruitment placements or exact travel paths.")}</p>
        <p><a href={migration.sourceUrls.inbound} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t("Eurostat immigration data")}</a> · <a href={migration.sourceUrls.outbound} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t("Eurostat emigration data")}</a> {t("· Reference year ")}{migration.year}{t(". e: estimated; p: provisional; b: break in series. No missing values are replaced with invented flows.")}</p>
        <div className="min-w-0 w-full max-w-full overflow-x-auto"><table className="w-full text-left"><caption className="mb-2 text-left font-semibold">{t("Selected reported migration flows, ")}{migration.year}</caption><thead><tr><th scope="col" className="py-2 pr-4">{t("From")}</th><th scope="col" className="py-2 pr-4">{t("To")}</th><th scope="col" className="py-2 pr-4">{t("People")}</th><th scope="col" className="py-2">{t("Flag")}</th></tr></thead><tbody>{migration.routes.map(route => <tr key={`${route.from}-${route.to}`} className="border-t border-slate-100"><td className="py-1 pr-4">{t(countries[route.from].name)}</td><td className="py-1 pr-4">{t(countries[route.to].name)}</td><td className="py-1 pr-4 tabular-nums">{route.persons.toLocaleString(locale)}</td><td className="py-1">{route.status || "—"}</td></tr>)}</tbody></table></div>
        <p>{t("Amber outlines show the highest job vacancy rates among EU members with comparable data in ")}{demand.period}: {demand.countries.map(country => `${t(country.name)} ${country.rate.toLocaleString(locale)}%`).join(" · ")}{t(". Vacancy rates indicate unfilled demand, not a direct shortage ranking. ")}<a href={demand.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{t("Eurostat source and coverage notes")}</a>.</p>
      </div>
    </details>
    </div>
  );
}
