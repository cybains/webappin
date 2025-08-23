// app/(public)/methodology/page.tsx or similar

import Link from "next/link";

const dumpAsOf = process.env.NEXT_PUBLIC_DUMP_AS_OF ?? "N/A";
const currentYear = new Date().getFullYear();
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@sufoniq.com";

const KPIS = [
  { code: "NY.GDP.PCAP.KD", label: "GDP per capita (constant USD)", unit: "USD/person", polarity: "Higher ↑", yoy: "%", note: "Real, chained USD" },
  { code: "FP.CPI.TOTL.ZG", label: "Inflation, consumer prices", unit: "% (annual)", polarity: "Lower ↓", yoy: "Δ pp", note: "Rate, not level; clip extremes in charts" },
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
];

const PERSONAS = [
  {
    id: "job-seeker",
    name: "Job Seeker",
    pillars: [
      { id: "employment_health", name: "Employment health", indicators: [
        { code: "SL.UEM.TOTL.ZS", name: "Unemployment, total", polarity: "Lower ↓" },
        { code: "SL.UEM.1524.ZS", name: "Youth unemployment (optional)", polarity: "Lower ↓" },
      ]},
      { id: "participation_skills", name: "Participation & skills", indicators: [
        { code: "SL.TLF.CACT.ZS", name: "Labor force participation", polarity: "Higher ↑" },
        { code: "SE.TER.ENRR", name: "Tertiary enrollment", polarity: "Higher ↑" },
      ]},
      { id: "momentum", name: "Momentum", indicators: [
        { code: "NY.GDP.MKTP.KD.ZG", name: "Real GDP growth", polarity: "Higher ↑" },
        { code: "NE.EXP.GNFS.ZS", name: "Exports % GDP", polarity: "Higher ↑" },
      ]},
      { id: "digital_access", name: "Digital access", indicators: [
        { code: "IT.NET.USER.ZS", name: "Internet users %", polarity: "Higher ↑" },
        { code: "IT.CEL.SETS.P2", name: "Mobile subs per 100", polarity: "Higher ↑" },
      ]},
    ],
  },
  {
    id: "entrepreneur",
    name: "Entrepreneur",
    pillars: [
      { id: "regulatory_legal", name: "Regulatory & legal", indicators: [
        { code: "IC.LGL.CRED.XQ", name: "Strength of legal rights", polarity: "Higher ↑" },
        { code: "IC.BUS.NDNS.ZS", name: "New business density", polarity: "Higher ↑" },
      ]},
      { id: "finance", name: "Access to finance", indicators: [
        { code: "FS.AST.PRVT.GD.ZS", name: "Credit to private sector % GDP", polarity: "Higher ↑" },
        { code: "FB.AST.NPER.ZS", name: "NPLs % of total (if present)", polarity: "Lower ↓" },
      ]},
      { id: "infrastructure", name: "Infrastructure & power", indicators: [
        { code: "EG.ELC.ACCS.ZS", name: "Access to electricity", polarity: "Higher ↑" },
        { code: "EG.ELC.RNEW.ZS", name: "Renewable electricity output", polarity: "Higher ↑" },
      ]},
      { id: "innovation", name: "Innovation & high-tech trade", indicators: [
        { code: "TX.VAL.TECH.MF.ZS", name: "High-tech exports share", polarity: "Higher ↑" },
        { code: "IP.JRN.ARTC.SC", name: "Sci/tech journal articles", polarity: "Higher ↑ (log before percentile)" },
      ]},
    ],
  },
  {
    id: "digital-nomad",
    name: "Digital Nomad",
    pillars: [
      { id: "connectivity", name: "Connectivity", indicators: [
        { code: "IT.NET.USER.ZS", name: "Internet users %", polarity: "Higher ↑" },
        { code: "IT.NET.BBND.P2", name: "Fixed broadband per 100 (if present)", polarity: "Higher ↑" },
        { code: "IT.CEL.SETS.P2", name: "Mobile subs per 100", polarity: "Higher ↑" },
      ]},
      { id: "affordability", name: "Affordability & stability", indicators: [
        { code: "PA.NUS.PPPC.RF", name: "Price level ratio", polarity: "Lower ↓" },
        { code: "FP.CPI.TOTL.ZG", name: "Inflation %", polarity: "Lower ↓" },
      ]},
      { id: "livability", name: "Livability & safety", indicators: [
        { code: "SP.DYN.LE00.IN", name: "Life expectancy", polarity: "Higher ↑" },
        { code: "EN.ATM.PM25.MC.M3", name: "PM2.5 exposure", polarity: "Lower ↓" },
        { code: "SH.STA.HOMIC.ZS", name: "Homicide rate (if present)", polarity: "Lower ↓" },
      ]},
    ],
  },
  {
    id: "expat-family",
    name: "Expat Family",
    pillars: [
      { id: "health", name: "Health", indicators: [
        { code: "SP.DYN.LE00.IN", name: "Life expectancy", polarity: "Higher ↑" },
        { code: "SH.XPD.CHEX.PC.CD", name: "Health expend. per capita", polarity: "Higher ↑ (log before percentile)" },
        { code: "SH.IMM.MEAS.ZS", name: "Measles immunization", polarity: "Higher ↑" },
      ]},
      { id: "education", name: "Education", indicators: [
        { code: "SE.SEC.ENRR", name: "Secondary enrollment", polarity: "Higher ↑" },
        { code: "SE.TER.ENRR", name: "Tertiary enrollment", polarity: "Higher ↑" },
        { code: "SE.ADT.LITR.ZS", name: "Adult literacy", polarity: "Higher ↑" },
      ]},
      { id: "safety_env", name: "Safety & environment", indicators: [
        { code: "SH.STA.HOMIC.ZS", name: "Homicide rate", polarity: "Lower ↓" },
        { code: "EN.ATM.PM25.MC.M3", name: "PM2.5 exposure", polarity: "Lower ↓" },
        { code: "EN.ATM.CO2E.PC", name: "CO₂ per capita", polarity: "Lower ↓" },
      ]},
    ],
  },
];

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Methodology</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: <span className="font-medium">{dumpAsOf}</span> • Data source: World Bank (WDI & related)
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Reproducible</span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">Grounded</span>
          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-700">LLM-safe</span>
        </div>
      </div>

      {/* TOC */}
      <nav className="mb-10 rounded-xl border bg-card p-4">
        <p className="mb-2 text-sm font-semibold">On this page</p>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          {[
            ["#ingestion", "Data ingestion & scope"],
            ["#governance", "Data quality & governance"],
            ["#features", "Transformations & features"],
            ["#normalize", "Normalization & ranks"],
            ["#kpis", "Headline KPIs"],
            ["#personas", "Persona indices"],
            ["#profiles", "Country profiles & comparisons"],
            ["#opportunities", "Opportunity mapping"],
            ["#forecasts", "Forecasts (projections)"],
            ["#alerts", "Alerts"],
            ["#llm", "LLM grounding"],
            ["#versioning", "Reproducibility & versioning"],
            ["#limitations", "Limitations & ethics"],
            ["#contact", "Contact"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-muted-foreground hover:text-foreground">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <section id="ingestion">
          <h2>1) Data ingestion &amp; scope</h2>
          <ul>
            <li><strong>API:</strong> World Bank v2 JSON endpoints (<code>/sources</code>, <code>/indicators</code>, <code>/country</code>, <code>/country/all/indicator/{`{code}`}</code>).</li>
            <li><strong>Coverage:</strong> All indicators, countries &amp; aggregates; years 1960–{currentYear} where available.</li>
            <li><strong>Storage:</strong> MongoDB (<code>worldbank_raw</code>), 1 row per <em>indicator × country × year</em>; key <code>&quot;{`indicator|country|year`}&quot;</code>.</li>
            <li><strong>Versioning:</strong> Every dump stamped with <code>dump_as_of</code> (UTC); all derived tables reference the same snapshot.</li>
          </ul>
        </section>

        <section id="governance">
          <h2>2) Data quality &amp; governance</h2>
          <ul>
            <li><strong>Metadata:</strong> We keep id, name, source_id, unit, notes/definitions for each indicator.</li>
            <li><strong>Aggregates:</strong> World/regions/income groups are tagged and excluded from country-only rankings by default.</li>
            <li><strong>Missing values:</strong> Shown as <code>N/A</code>. Short gaps (≤2 years) may be linearly interpolated for analytics and flagged as <code>filled</code>.</li>
            <li><strong>Outliers:</strong> Winsorized per indicator-year across countries (default P5–P95).</li>
            <li><strong>Units:</strong> We never mix unit families (e.g., current USD vs constant USD vs PPP).</li>
          </ul>
        </section>

        <section id="features">
          <h2>3) Transformations &amp; features</h2>
          <ul>
            <li><strong>Per-capita:</strong> <code>x_pc = x / POP</code>; <strong>% of GDP:</strong> <code>x_%GDP = 100 * x / GDP</code>.</li>
            <li><strong>Log transform (levels):</strong> <code>y = ln(x + ε)</code>. <strong>Logit (bounded %):</strong> <code>z = ln(p/(1−p))</code> with <code>p = x/100</code>.</li>
            <li><strong>Growth:</strong> YoY% <code>100*(x_t/x_{t-1} − 1)</code>; log-growth <code>ln(x_t+ε) − ln(x_{t-1}+ε)</code>; CAGR <code>(x1/x0)^(1/n) − 1</code>.</li>
            <li><strong>Rolling:</strong> mean/std (e.g., 3y) and OLS slope on last 5y.</li>
            <li><strong>Polarity:</strong> indicators marked as higher- or lower-is-better (e.g., unemployment, CO₂ are lower-better).</li>
          </ul>
        </section>

        <section id="normalize">
          <h2>4) Normalization &amp; ranks</h2>
          <ul>
            <li><strong>Percentile score (world):</strong> empirical percentile per year across countries (after winsorization), scaled 0–100.</li>
            <li><strong>Robust z-score:</strong> <code>(x − median) / (1.4826 * MAD)</code>.</li>
            <li><strong>Polarity handling:</strong> for lower-better we invert percentile (<code>100 − s</code>). Raw values are never inverted.</li>
            <li>Optional scopes: Region and Income-group percentiles for benchmarking.</li>
          </ul>
        </section>

        <section id="kpis">
          <h2>5) Headline KPIs (final)</h2>
          <div className="not-prose overflow-hidden rounded-xl border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50">
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
                    <td className="px-3 py-2 text-muted-foreground">{k.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="personas">
          <h2>6) Persona indices</h2>
          <p>
            Composite scores (0–100) built from per-indicator percentiles (polarity applied). Equal weights across pillars and within pillars.
            Score published if ≥60% indicators are present; otherwise flagged <code>low_coverage</code>.
          </p>
          {PERSONAS.map((p) => (
            <div key={p.id} className="mb-6 rounded-xl border p-4">
              <h3 className="mt-0">{p.name}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {p.pillars.map((pl) => (
                  <div key={pl.id} className="rounded-lg bg-muted/30 p-3">
                    <p className="mb-2 text-sm font-semibold">{pl.name}</p>
                    <ul className="m-0 list-disc pl-5">
                      {pl.indicators.map((ind) => (
                        <li key={ind.code}>
                          <code className="font-mono">{ind.code}</code> — {ind.name} <span className="text-muted-foreground">({ind.polarity})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section id="profiles">
          <h2>7) Country profiles &amp; comparisons</h2>
          <ul>
            <li><strong>Profiles:</strong> latest value + year + unit + YoY + world percentile; 10–20y trends; benchmarks (World/Region/Income).</li>
            <li><strong>Comparisons:</strong> side-by-side KPIs, percentile bars, trend overlays; ranks exclude aggregates by default.</li>
          </ul>
        </section>

        <section id="opportunities">
          <h2>8) Opportunity mapping</h2>
          <p>
            For each theme (e.g., Digital, Green, Exports, Labor) we combine <em>level</em> and <em>trend</em> with a volatility penalty and gates.
          </p>
          <ul>
            <li><strong>Level percentile</strong> L ∈ [0,100] and <strong>Trend percentile</strong> T ∈ [0,100] (YoY or 5y CAGR).</li>
            <li><strong>Score:</strong> geometric mean <code>O = √(L · T)</code> × penalty; coverage ≥70%, latest ≤2y, inflation within bounds.</li>
          </ul>
        </section>

        <section id="forecasts">
          <h2>9) Forecasts (projections)</h2>
          <ul>
            <li><strong>Scope:</strong> smooth, well-covered annual series (GDP pc, inflation, unemployment, internet users, life expectancy, CO₂ pc).</li>
            <li><strong>Transforms:</strong> log for levels; logit for bounded %.</li>
            <li><strong>Models:</strong> Random-walk-with-drift, ARIMA(0,1,1) with drift, or ETS; chosen via rolling-origin CV (sMAPE/MASE).</li>
            <li><strong>Uncertainty:</strong> 80/95% intervals; forecasts shown as dashed and labeled “Projection” with <em>as_of_year</em>.</li>
          </ul>
        </section>

        <section id="alerts">
          <h2>10) Alerts</h2>
          <ul>
            <li><strong>Triggers:</strong> threshold/percentile crossings, large YoY/log-growth, trend breaks, anomalies (robust z), forecast breaches.</li>
            <li><strong>Noise control:</strong> hysteresis (e.g., 2 consecutive observations), cooldown windows, recency &amp; coverage checks.</li>
            <li><strong>Audit:</strong> each alert stores indicator code, year, value, percentile, and the rule that fired.</li>
          </ul>
        </section>

        <section id="llm">
          <h2>11) LLM grounding</h2>
          <ul>
            <li><strong>Evidence bundle:</strong> compact JSON of numbers/years/units/sources from Mongo; the model only narrates from this evidence.</li>
            <li><strong>Discipline:</strong> every numeric claim includes year + unit + source code (e.g., <code>NY.GDP.PCAP.KD, 2023, WDI</code>); no on-the-fly calculations.</li>
          </ul>
        </section>

        <section id="versioning">
          <h2>12) Reproducibility &amp; versioning</h2>
          <ul>
            <li>Each release references a single <code>dump_as_of</code> and pipeline commit.</li>
            <li>Derived tables (<code>features</code>, <code>country_views</code>, <code>persona_scores</code>, <code>opportunities</code>, <code>forecasts</code>, <code>alerts</code>) are rebuilt end-to-end.</li>
            <li>Any page/report can be reproduced by (<em>dump_as_of, country, year</em>).</li>
          </ul>
        </section>

        <section id="limitations">
          <h2>13) Limitations &amp; ethics</h2>
          <ul>
            <li>Some indicators have gaps or long lags; we surface the latest year explicitly.</li>
            <li>Method changes may affect comparability across time; versioning exposes changes.</li>
            <li>Aggregates (e.g., WLD/EUU) are benchmarks; rankings default to countries only.</li>
            <li>Forecasts are scenarios with uncertainty; they should complement expert judgement.</li>
          </ul>
        </section>

        <section id="contact">
          <h2>14) Contact</h2>
          <p>
            Questions or feedback? Email{" "}
            <a href={`mailto:${contactEmail}`} className="font-medium underline underline-offset-4">
              {contactEmail}
            </a>.
          </p>
        </section>
      </div>

      {/* Footer mini-bar */}
      <div className="mt-12 flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3 text-xs">
        <span>© {currentYear} Sufoniq • Data snapshot: {dumpAsOf}</span>
        <Link href="#ingestion" className="text-muted-foreground hover:text-foreground">
          Back to top ↑
        </Link>
      </div>
    </main>
  );
}
