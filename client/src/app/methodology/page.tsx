const dumpAsOf = process.env.NEXT_PUBLIC_DUMP_AS_OF ?? "N/A";
const currentYear = new Date().getFullYear();
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@sufoniq.com";

export default function MethodologyPage() {
  return (
    <main className="prose mx-auto px-4 py-8">
      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {dumpAsOf} • Data source: World Bank (WDI & related)
      </p>
      <h1 className="mb-4">Methodology</h1>

      <section>
        <h2>1. Scope</h2>
        <p>
          The dataset summarizes key economic and social indicators for countries
          worldwide to support relocation decisions and policy analysis.
        </p>
      </section>

      <section>
        <h2>2. Data Sources</h2>
        <p>Primary statistics are pulled from open data services maintained by the World Bank.</p>
        <ul>
          <li>World Development Indicators (WDI)</li>
          <li>World Governance Indicators</li>
          <li>Specialized companion databases when relevant</li>
        </ul>
      </section>

      <section>
        <h2>3. Extraction</h2>
        <p>
          Records are retrieved directly from the official APIs. Only publicly
          available endpoints are used, ensuring reproducibility and transparency.
        </p>
      </section>

      <section>
        <h2>4. Indicators</h2>
        <p>
          Indicators were selected based on their relevance for assessing quality of
          life and economic opportunity.
        </p>
        <ol>
          <li>Macroeconomic stability</li>
          <li>Human development</li>
          <li>Infrastructure and environment</li>
        </ol>
      </section>

      <section>
        <h2>5. Data Cleaning</h2>
        <p>
          Retrieved values are normalized into consistent numeric formats and ISO
          codes. Non-numeric markers, such as “n/a”, are treated as missing values.
        </p>
      </section>

      <section>
        <h2>6. Standardization</h2>
        <p>
          To facilitate comparisons, indicators are aligned to common units or
          scaled per capita where appropriate. Currency values are expressed in
          constant U.S. dollars.
        </p>
      </section>

      <section>
        <h2>7. Aggregation</h2>
        <p>
          Country-level metrics may be aggregated into regional summaries using
          population-weighted averages when regional context is required.
        </p>
      </section>

      <section>
        <h2>8. Missing Values</h2>
        <p>
          Missing observations are left empty rather than interpolated. This
          prevents introducing artificial trends or misrepresenting volatility.
        </p>
      </section>

      <section>
        <h2>9. Temporal Coverage</h2>
        <p>
          The repository captures the most recent figures available through {currentYear}, though coverage by indicator may vary.
        </p>
      </section>

      <section>
        <h2>10. Country Classifications</h2>
        <p>
          Countries and territories follow the World Bank’s operational
          classifications for income groups and geographic regions.
        </p>
      </section>

      <section>
        <h2>11. Limitations</h2>
        <p>
          Despite careful processing, discrepancies may remain due to reporting
          lags, methodological revisions, or gaps in the underlying sources.
        </p>
      </section>

      <section>
        <h2>12. Usage and Citation</h2>
        <p>
          Users are encouraged to cite the World Bank and this repository when
          referencing the data. Please attribute as: &quot;World Bank, Development
          Indicators ({currentYear})&quot;.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          Questions or feedback? Reach us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </section>
    </main>
  );
}
