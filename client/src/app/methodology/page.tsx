"use client";
import React from "react";

const dumpAsOf = process.env.NEXT_PUBLIC_DUMP_AS_OF ?? "N/A";
const currentYear = new Date().getFullYear();
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@sufoniq.com";

const KPIS = [
  { code: "NY.GDP.PCAP.KD", label: "GDP per capita (constant USD)", unit: "USD/person", polarity: "Higher ↑", yoy: "%", note: "Real, chained USD" },
  { code: "FP.CPI.TOTL.ZG", label: "Inflation, consumer prices", unit: "% (annual)", polarity: "Lower ↓", yoy: "Δ pp", note: "Rate; clip extremes in charts" },
  { code: "NE.EXP.GNFS.ZS", label: "Exports of goods & services", unit: "% of GDP", polarity: "Higher ↑", yoy: "Δ pp", note: "Openness proxy" },
  { code: "SL.UEM.TOTL.ZS", label: "Unemployment, total", unit: "% of labor force", polarity: "Lower ↓", yoy: "Δ pp", note: "Youth unemployment tracked in personas" },
  { code: "SL.TLF.CACT.ZS", label: "Labor force participation", unit: "% of 15+", polarity: "Higher ↑", yoy: "Δ pp", note: "" },
  { code: "SP.POP.TOTL", label: "Population", unit: "persons", polarity: "—", yoy: "%", note: "Level; show YoY %" },
  { code: "SP.DYN.LE00.IN", label: "Life expectancy at birth", unit: "years", polarity: "Higher ↑", yoy: "Δ years", note: "" },
  { code: "SE.TER.ENRR", label: "Tertiary enrollment (gross)", unit: "%", polarity: "Higher ↑", yoy: "Δ pp", note: "" },
  { code: "SE.ADT.LITR.ZS", label: "Adult literacy (15+)", unit: "%", polarity: "Higher ↑", yoy: "Δ pp", note: "If missing, show latest only" },
  { code: "IT.NET.USER.ZS", label: "Individuals using the Internet", unit: "% of population", polarity: "Higher ↑", yoy: "Δ pp", note: "" },
  { code: "IT.CEL.SETS.P2", label: "Mobile cellular subscriptions", unit: "per 100 people", polarity: "Higher ↑", yoy: "Δ", note: "Connectivity proxy" },
  { code: "EN.ATM.CO2E.PC", label: "CO₂ emissions", unit: "t/person", polarity: "Lower ↓", yoy: "%", note: "Environmental pressure proxy" },
] as const;

const PERSONAS = [
  {
    id: "job-seeker",
    name: "Job Seeker",
    pillars: [
      {
        id: "employment_health",
        name: "Employment health",
        indicators: [
          { code: "SL.UEM.TOTL.ZS", name: "Unemployment, total", polarity: "Lower ↓" },
          { code: "SL.UEM.1524.ZS", name: "Youth unemployment (optional)", polarity: "Lower ↓" },
        ],
      },
      {
        id: "participation_skills",
        name: "Participation & skills",
        indicators: [
          { code: "SL.TLF.CACT.ZS", name: "Labor force participation", polarity: "Higher ↑" },
          { code: "SE.TER.ENRR", name: "Tertiary enrollment", polarity: "Higher ↑" },
        ],
      },
      {
        id: "momentum",
        name: "Momentum",
        indicators: [
          { code: "NY.GDP.MKTP.KD.ZG", name: "Real GDP growth", polarity: "Higher ↑" },
          { code: "NE.EXP.GNFS.ZS", name: "Exports % GDP", polarity: "Higher ↑" },
        ],
      },
      {
        id: "digital_access",
        name: "Digital access",
        indicators: [
          { code: "IT.NET.USER.ZS", name: "Internet users %", polarity: "Higher ↑" },
          { code: "IT.CEL.SETS.P2", name: "Mobile subs per 100", polarity: "Higher ↑" },
        ],
      },
    ],
  },
  {
    id: "entrepreneur",
    name: "Entrepreneur",
    pillars: [
      {
        id: "regulatory_legal",
        name: "Regulatory & legal",
        indicators: [
          { code: "IC.LGL.CRED.XQ", name: "Strength of legal rights", polarity: "Higher ↑" },
          { code: "IC.BUS.NDNS.ZS", name: "New business density", polarity: "Higher ↑" },
        ],
      },
      {
        id: "finance",
        name: "Access to finance",
        indicators: [
          { code: "FS.AST.PRVT.GD.ZS", name: "Credit to private sector % GDP", polarity: "Higher ↑" },
          { code: "FB.AST.NPER.ZS", name: "NPLs % of total (if present)", polarity: "Lower ↓" },
        ],
      },
      {
        id: "infrastructure",
        name: "Infrastructure & power",
        indicators: [
          { code: "EG.ELC.ACCS.ZS", name: "Access to electricity", polarity: "Higher ↑" },
          { code: "EG.ELC.RNEW.ZS", name: "Renewable electricity output", polarity: "Higher ↑" },
        ],
      },
      {
        id: "innovation",
        name: "Innovation & high-tech trade",
        indicators: [
          { code: "TX.VAL.TECH.MF.ZS", name: "High-tech exports share", polarity: "Higher ↑" },
          { code: "IP.JRN.ARTC.SC", name: "Sci/tech journal articles", polarity: "Higher ↑ (log before percentile)" },
        ],
      },
    ],
  },
  {
    id: "digital-nomad",
    name: "Digital Nomad",
    pillars: [
      {
        id: "connectivity",
        name: "Connectivity",
        indicators: [
          { code: "IT.NET.USER.ZS", name: "Internet users %", polarity: "Higher ↑" },
          { code: "IT.NET.BBND.P2", name: "Fixed broadband per 100 (if present)", polarity: "Higher ↑" },
          { code: "IT.CEL.SETS.P2", name: "Mobile subs per 100", polarity: "Higher ↑" },
        ],
      },
      {
        id: "affordability",
        name: "Affordability & stability",
        indicators: [
          { code: "PA.NUS.PPPC.RF", name: "Price level ratio", polarity: "Lower ↓" },
          { code: "FP.CPI.TOTL.ZG", name: "Inflation %", polarity: "Lower ↓" },
        ],
      },
      {
        id: "livability",
        name: "Livability & safety",
        indicators: [
          { code: "SP.DYN.LE00.IN", name: "Life expectancy", polarity: "Higher ↑" },
          { code: "EN.ATM.PM25.MC.M3", name: "PM2.5 exposure", polarity: "Lower ↓" },
          { code: "SH.STA.HOMIC.ZS", name: "Homicide rate (if present)", polarity: "Lower ↓" },
        ],
      },
    ],
  },
  {
    id: "expat-family",
    name: "Expat Family",
    pillars: [
      {
        id: "health",
        name: "Health",
        indicators: [
          { code: "SP.DYN.LE00.IN", name: "Life expectancy", polarity: "Higher ↑" },
          { code: "SH.XPD.CHEX.PC.CD", name: "Health expend. per capita", polarity: "Higher ↑ (log before percentile)" },
          { code: "SH.IMM.MEAS.ZS", name: "Measles immunization", polarity: "Higher ↑" },
        ],
      },
      {
        id: "education",
        name: "Education",
        indicators: [
          { code: "SE.SEC.ENRR", name: "Secondary enrollment", polarity: "Higher ↑" },
          { code: "SE.TER.ENRR", name: "Tertiary enrollment", polarity: "Higher ↑" },
          { code: "SE.ADT.LITR.ZS", name: "Adult literacy", polarity: "Higher ↑" },
        ],
      },
      {
        id: "safety_env",
        name: "Safety & environment",
        indicators: [
          { code: "SH.STA.HOMIC.ZS", name: "Homicide rate", polarity: "Lower ↓" },
          { code: "EN.ATM.PM25.MC.M3", name: "PM2.5 exposure", polarity: "Lower ↓" },
          { code: "EN.ATM.CO2E.PC", name: "CO₂ per capita", polarity: "Lower ↓" },
        ],
      },
    ],
  },
] as const;

export default function MethodologyPage() {
  const toc = [
    { href: "#ingestion", label: "Data ingestion & scope" },
    { href: "#governance", label: "Data quality & governance" },
    { href: "#features", label: "Transformations & features" },
    { href: "#normalize", label: "Normalization & ranks" },
    { href: "#kpis", label: "Headline KPIs" },
    { href: "#personas", label: "Persona indices" },
    { href: "#profiles", label: "Country profiles & comparisons" },
    { href: "#opportunities", label: "Opportunity mapping" },
    { href: "#forecasts", label: "Forecasts (projections)" },
    { href: "#alerts", label: "Alerts" },
    { href: "#llm", label: "LLM grounding" },
    { href: "#versioning", label: "Reproducibility & versioning" },
    { href: "#limitations", label: "Limitations & ethics" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Methodology</h1>
        <p className="mt-1 text-sm text-gray-600">
          Last updated: <span className="font-medium text-gray-800">{dumpAsOf}</span> • Data source: World Bank (WDI & related)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Reproducible</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Grounded</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">LLM-safe</span>
        </div>
      </header>

      <nav className="mb-10 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-slate-700">On this page</p>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {toc.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-slate-600 hover:text-slate-900">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-10">
        <section id="ingestion" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">1) Data ingestion & scope</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li>
              <strong>API:</strong> World Bank v2 JSON endpoints (
              <code className="rounded bg-slate-100 px-1 py-0.5">/sources</code>,{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">/indicators</code>,{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">/country</code>,{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">/country/all/indicator/{"{code}"}</code>
              ).
            </li>
            <li><strong>Coverage:</strong> All indicators, countries & aggregates; years 1960–{currentYear} where available.</li>
            <li>
              <strong>Storage:</strong> MongoDB (<code className="rounded bg-slate-100 px-1 py-0.5">worldbank_raw</code>), 1 row per <em>indicator × country × year</em>; key{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">{"{indicator|country|year}"}</code>.
            </li>
            <li><strong>Versioning:</strong> Every dump stamped with <code className="rounded bg-slate-100 px-1 py-0.5">dump_as_of</code> (UTC); derived tables reference the same snapshot.</li>
          </ul>
        </section>

        <section id="governance" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">2) Data quality & governance</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li><strong>Metadata:</strong> We keep id, name, source_id, unit, notes/definitions per indicator.</li>
            <li><strong>Aggregates:</strong> World/regions/income groups are tagged and excluded from country-only rankings by default.</li>
            <li><strong>Missing values:</strong> Shown as <code className="rounded bg-slate-100 px-1 py-0.5">N/A</code>. Short gaps (≤2 years) may be linearly interpolated and flagged as <code className="rounded bg-slate-100 px-1 py-0.5">filled</code>.</li>
            <li><strong>Outliers:</strong> Winsorized per indicator-year across countries (default P5–P95).</li>
            <li><strong>Units:</strong> We never mix unit families (e.g., current USD vs constant USD vs PPP).</li>
          </ul>
        </section>

        <section id="features" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">3) Transformations & features</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li><strong>Per-capita:</strong> <code className="rounded bg-slate-100 px-1 py-0.5">x_pc = x / POP</code>; <strong>% of GDP:</strong> <code className="rounded bg-slate-100 px-1 py-0.5">x_%GDP = 100 * x / GDP</code>.</li>
            <li><strong>Log transform (levels):</strong> <code className="rounded bg-slate-100 px-1 py-0.5">y = ln(x + ε)</code>. <strong>Logit (bounded %):</strong> <code className="rounded bg-slate-100 px-1 py-0.5">z = ln(p/(1−p))</code>, with <code className="rounded bg-slate-100 px-1 py-0.5">p = x/100</code>.</li>
            <li>
              <strong>Growth:</strong> YoY%{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                100*(x<sub>t</sub>/x<sub>t−1</sub> − 1)
              </code>
              ; log-growth{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                ln(x<sub>t</sub>+ε) − ln(x<sub>t−1</sub>+ε)
              </code>
              ; CAGR <code className="rounded bg-slate-100 px-1 py-0.5">(x1/x0)^(1/n) − 1</code>.
            </li>
            <li><strong>Rolling:</strong> mean/std (e.g., 3y) and OLS slope on last 5y.</li>
            <li><strong>Polarity:</strong> indicators marked higher- or lower-is-better (e.g., unemployment, CO₂ are lower-better).</li>
          </ul>
        </section>

        <section id="normalize" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">4) Normalization & ranks</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li><strong>Percentile (world):</strong> empirical percentile per year across countries (after winsorization), scaled 0–100.</li>
            <li><strong>Robust z-score:</strong> <code className="rounded bg-slate-100 px-1 py-0.5">(x − median) / (1.4826 * MAD)</code>.</li>
            <li><strong>Polarity handling:</strong> for lower-better we invert percentile (<code className="rounded bg-slate-100 px-1 py-0.5">100 − s</code>). Raw values are never inverted.</li>
            <li>Optional scopes: Region and Income-group percentiles for benchmarking.</li>
          </ul>
        </section>

        <section id="kpis" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">5) Headline KPIs (final)</h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left">Code</th>
                  <th className="px-3 py-2 text-left">Label</th>
                  <th className="px-3 py-2 text-left">Unit</th>
                  <th className="px-3 py-2 text-left">Polarity</th>
                  <th className="px-3 py-2 text-left">YoY</th>
                  <th className="px-3 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {KPIS.map((k) => (
                  <tr key={k.code} className="border-t">
                    <td className="px-3 py-2 font-mono">{k.code}</td>
                    <td className="px-3 py-2">{k.label}</td>
                    <td className="px-3 py-2">{k.unit}</td>
                    <td className="px-3 py-2">{k.polarity}</td>
                    <td className="px-3 py-2">{k.yoy}</td>
                    <td className="px-3 py-2 text-slate-500">{k.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="personas" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">6) Persona indices</h2>
          <p className="mt-3 text-slate-700">
            Composite scores (0–100) built from per-indicator percentiles (polarity applied).
            Equal weights across pillars and within pillars. Score published if ≥60% indicators are present; otherwise flagged <code className="rounded bg-slate-100 px-1 py-0.5">low_coverage</code>.
          </p>
          {PERSONAS.map((p) => (
            <div key={p.id} className="mt-4 rounded-xl border border-slate-200 p-4">
              <h3 className="mt-0 text-lg font-semibold">{p.name}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {p.pillars.map((pl) => (
                  <div key={pl.id} className="rounded-lg bg-slate-50 p-3">
                    <p className="mb-2 text-sm font-semibold">{pl.name}</p>
                    <ul className="list-disc pl-5 text-slate-700">
                      {pl.indicators.map((ind) => (
                        <li key={ind.code}>
                          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">{ind.code}</code> — {ind.name}{" "}
                          <span className="text-slate-500">({ind.polarity})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="profiles" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">7) Country profiles & comparisons</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li><strong>Profiles:</strong> latest value + year + unit + YoY + world percentile; 10–20y trends; benchmarks (World/Region/Income).</li>
            <li><strong>Comparisons:</strong> side-by-side KPIs, percentile bars, trend overlays; ranks exclude aggregates by default.</li>
          </ul>
        </section>

        <section id="opportunities" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">8) Opportunity mapping</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li><strong>Level percentile</strong> L ∈ [0,100] and <strong>Trend percentile</strong> T ∈ [0,100] (YoY or 5y CAGR).</li>
            <li><strong>Score:</strong> geometric mean <code className="rounded bg-slate-100 px-1 py-0.5">O = √(L · T)</code> with a small volatility penalty; coverage ≥70%, latest ≤2y, inflation within bounds.</li>
          </ul>
        </section>

        <section id="forecasts" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">9) Forecasts (projections)</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li><strong>Scope:</strong> smooth, well-covered annual series (GDP pc, inflation, unemployment, internet users, life expectancy, CO₂ pc).</li>
            <li><strong>Transforms:</strong> log for levels; logit for bounded %.</li>
            <li><strong>Models:</strong> RWD, ARIMA(0,1,1) with drift, or ETS; chosen via rolling-origin CV (sMAPE/MASE).</li>
            <li><strong>Uncertainty:</strong> 80/95% intervals; forecasts shown as dashed and labeled “Projection” with <em>as_of_year</em>.</li>
          </ul>
        </section>

        <section id="alerts" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">10) Alerts</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li><strong>Triggers:</strong> threshold/percentile crossings, large YoY/log-growth, trend breaks, anomalies (robust z), forecast breaches.</li>
            <li><strong>Noise control:</strong> hysteresis (2 consecutive observations), cooldown windows, recency & coverage checks.</li>
            <li><strong>Audit:</strong> each alert stores indicator code, year, value, percentile, and the rule that fired.</li>
          </ul>
        </section>

        <section id="llm" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">11) LLM grounding</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li><strong>Evidence bundle:</strong> compact JSON of numbers/years/units/sources from Mongo; the model only narrates from this evidence.</li>
            <li><strong>Discipline:</strong> every numeric claim includes year + unit + source code (e.g., <code className="rounded bg-slate-100 px-1 py-0.5">NY.GDP.PCAP.KD, 2023, WDI</code>); no on-the-fly calculations.</li>
          </ul>
        </section>

        <section id="versioning" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">12) Reproducibility & versioning</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li>Each release references a single <code className="rounded bg-slate-100 px-1 py-0.5">dump_as_of</code> and pipeline commit.</li>
            <li>Derived tables (<code className="rounded bg-slate-100 px-1 py-0.5">features</code>, <code className="rounded bg-slate-100 px-1 py-0.5">country_views</code>, <code className="rounded bg-slate-100 px-1 py-0.5">persona_scores</code>, <code className="rounded bg-slate-100 px-1 py-0.5">opportunities</code>, <code className="rounded bg-slate-100 px-1 py-0.5">forecasts</code>, <code className="rounded bg-slate-100 px-1 py-0.5">alerts</code>) are rebuilt end-to-end.</li>
            <li>Any page/report can be reproduced by (<em>dump_as_of, country, year</em>).</li>
          </ul>
        </section>

        <section id="limitations" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">13) Limitations & ethics</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            <li>Some indicators have gaps or long lags; we surface the latest year explicitly.</li>
            <li>Method changes may affect comparability across time; versioning exposes changes.</li>
            <li>Aggregates (e.g., WLD/EUU) are benchmarks; rankings default to countries only.</li>
            <li>Forecasts are scenarios with uncertainty; they should complement expert judgement.</li>
          </ul>
        </section>

        <section id="contact" className="scroll-mt-24">
          <h2 className="text-xl font-semibold">14) Contact</h2>
          <p className="mt-3 text-slate-700">
            Questions or feedback? Email{" "}
            <a href={`mailto:${contactEmail}`} className="font-medium text-blue-700 underline underline-offset-4">
              {contactEmail}
            </a>.
          </p>
        </section>
      </div>

      <footer className="mt-12 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        <span>© {currentYear} Sufoniq • Data snapshot: {dumpAsOf}</span>
        <a href="#ingestion" className="hover:text-slate-900">Back to top ↑</a>
      </footer>
    </main>
  );
}
