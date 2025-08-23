import React from "react";

export default function MethodologyPage() {
  const dumpAsOf = process.env.NEXT_PUBLIC_DUMP_AS_OF;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const currentYear = new Date().getFullYear();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 text-base leading-relaxed">
      <h1 className="text-4xl font-bold mb-10">Methodology</h1>

      <section className="mb-12">
        <p className="mb-4">
          Our approach to assessing relocation destinations is transparent and
          replicable. The data on this site reflects a snapshot from {dumpAsOf ||
            "the most recent data dump"} and is updated whenever a new export
          becomes available.
        </p>
        <p>
          Below we outline the key steps in our process. If you have further
          questions, reach out at {contactEmail ? (
            <a
              href={`mailto:${contactEmail}`}
              className="text-[var(--accent)] underline"
            >
              {contactEmail}
            </a>
          ) : (
            "our team"
          )}.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            We source remote job listings and cost-of-living indicators from open
            datasets.
          </li>
          <li>All records are normalized and deduplicated before analysis.</li>
          <li>
            Dates in the interface refer to the dump as of {dumpAsOf || "N/A"}.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Scoring</h2>
        <p className="mb-4">
          Each location receives a score based on availability of remote work,
          affordability, and infrastructure.
        </p>
        <ul className="list-decimal pl-6 space-y-3">
          <li>Remote opportunity density</li>
          <li>Cost of living index</li>
          <li>Connectivity and amenities</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
        <p>
          This methodology is maintained by our team and is subject to change as
          better data becomes available. It is provided as of {currentYear}.
        </p>
      </section>
    </main>
  );
}

