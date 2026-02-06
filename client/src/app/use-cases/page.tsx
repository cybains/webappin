import Link from "next/link";
import { formatIndicatorValue, loadContextSnapshots, type ContextSnapshot } from "@/lib/contextSnapshots";
import { StructuralGridBand } from "@/components/StructuralGridBand";

const useCases = [
  {
    title: "Working in Europe",
    problem:
      "Companies and individuals want to align employment, residence, and payroll in a single country while keeping options open for intra-European changes.",
    misunderstood:
      "A common assumption is that one permit or one service solves the entire move, when permit type and employer relationship change timelines and constraints.",
    archetypes: [
      "Permit renewal windows tend to mirror capital-city workloads more than project calendars, so overlap can be uneven.",
      "Payroll cut-offs vary by tax authority, which often means a single payrun spans multiple systems.",
      "Social benefits activate once local residency paperwork clears, and that timing varies by municipality.",
      "Cross-border allowances line up with bilateral agreements rather than platform-level promises.",
    ],
    boundary:
      "This block observes formal employment contexts and does not cover informal labour arrangements or purely experimental stays.",
    contextGroupIds: ["EU27", "EFTA", "UK"],
  },
  {
    title: "Hiring Across Borders",
    problem:
      "Hiring teams cite visibility gaps for compliance, benefits, and currency handling when they expand beyond their home market.",
    misunderstood:
      "It can look like cross-border hiring is just 'posting the same role elsewhere', but legal entities, payroll, and expectations differ by system.",
    archetypes: [
      "Budget owners often refer to EU-wide offers even though contracts tie to specific national regulations.",
      "Recruiters lean on local partners to translate liabilities rather than rewiring global policy in a single move.",
      "Time-to-pay shifts with each country's payroll cadence and tax-reporting rhythm.",
      "Benefits packages map to labour codes that shift between EU, neighbourhood, and microstate partners.",
    ],
    boundary:
      "This block focuses on compliant hiring operations and does not delve into temporary staffing or contractor-only models.",
    contextGroupIds: ["EU27", "WBALK", "E_NEI"],
  },
  {
    title: "Living and Working Remotely",
    problem:
      "Remote professionals want a stable base with reliable infrastructure, paperwork that does not spiral, and routines that hold over time.",
    misunderstood:
      "Remote life is often treated as pure lifestyle choice, yet taxes, healthcare, and residency rules can bind the location decision.",
    archetypes: [
      "Digital nomads tend to stack short stays with at least one formal residency base.",
      "Hybrid teams split weeks between a hometown and a city where they keep a secondary address.",
      "Individuals scope broadband and co-working availability together with declaration requirements.",
      "Housing leases frequently include clauses tied to municipal registration and community integration.",
    ],
    boundary:
      "This block addresses longer stays rather than weekend tourism or informal hospitality hosting.",
    contextGroupIds: ["EU27", "EFTA", "MICRO"],
  },
] as const;

const SINGLE_COUNTRY_TRAITS: Record<string, string[]> = {
  UK: [
    "Centralised labour regulation",
    "Distinct tax and currency regime",
    "Unified legal framework",
  ],
};

type ContextSnapshotCardProps = {
  snapshot: ContextSnapshot | null | undefined;
};

function ContextSnapshotCard({ snapshot }: ContextSnapshotCardProps) {
  if (!snapshot) {
    return (
      <div className="sufoniq-card text-xs text-[var(--muted)]">
        Context snapshot unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-2 sufoniq-card text-sm text-[var(--foreground)]">
      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-[var(--secondary)]">
        <span>{snapshot.title}</span>
        <span aria-label="Country count">
          {snapshot.count} {snapshot.count === 1 ? "country" : "countries"}
        </span>
      </div>

      {snapshot.count === 1 ? (
        <div className="sufoniq-card text-[0.75rem] text-[var(--muted)]">
          <div className="text-xs font-semibold text-[var(--foreground)]">Single-country system</div>
          <ul className="mt-2 space-y-1 pl-4 list-disc">
            {(SINGLE_COUNTRY_TRAITS[snapshot.groupId] ?? ["Context not aggregated"]).map((trait) => (
              <li key={trait}>{trait}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-1">
          {snapshot.indicators.map((indicator) => (
            <div key={indicator.code} className="flex items-center justify-between text-xs">
              <span className="text-[var(--muted)]">{indicator.label}</span>
              <span className="font-medium text-[var(--secondary)]">
                {indicator.median != null ? formatIndicatorValue(indicator.code, indicator.median) : "—"}
              </span>
            </div>
          ))}
        </div>
      )}

      {snapshot.asOfText ? (
        <p className="text-[0.65rem] text-[var(--muted)]">As of {snapshot.asOfText}</p>
      ) : null}
    </div>
  );
}

export default async function UseCasesPage() {
  const groupIds = Array.from(new Set(useCases.flatMap((c) => c.contextGroupIds)));
  const snapshots = await loadContextSnapshots(groupIds);

  return (
    <main className="w-full bg-[var(--background)] text-[var(--foreground)]">
      <StructuralGridBand>
        <section className="mx-auto max-w-5xl space-y-10 px-5 py-14">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-[var(--secondary)]">Use Cases</p>
            <h1 className="text-3xl font-semibold md:text-4xl">Situations we observe</h1>
            <p className="text-base text-[var(--muted)]">
              This page collects recurring mobility situations noted without pitch. Each block stays tied to observable patterns and lays out what happens before channels, partners, or actions appear.
            </p>
          </header>

          <div className="space-y-12">
            {useCases.map((useCase, index) => (
              <article key={useCase.title} className="space-y-4">
                <h2 className="text-xl font-semibold">{useCase.title}</h2>

                <div className="space-y-2 text-sm text-[var(--muted)]">
                  {index === 0 ? (
                    <>
                      <p className="text-[var(--foreground)]">
                        <span className="font-semibold">What usually goes wrong</span>: {useCase.problem}
                      </p>
                      <p className="text-[var(--foreground)]">
                        <span className="font-semibold">Why this feels harder than expected</span>: {useCase.misunderstood}
                      </p>
                    </>
                  ) : index === 1 ? (
                    <>
                      <p className="text-[var(--foreground)]">
                        Aligning employment, residence, and payroll outside the home market stretches timelines and invites multiple systems.
                      </p>
                      <p className="text-[var(--foreground)]">
                        That expectation feels harder when permit types and employer relationships shift constraints.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[var(--foreground)]">
                        Remote professionals still need stable infrastructure even when routines look flexible.
                      </p>
                      <p className="text-[var(--foreground)]">
                        The move feels harder because taxes, healthcare, and residency rules often fix the location decision.
                      </p>
                    </>
                  )}

                  <div className="space-y-2">
                    <p className="font-semibold text-[var(--foreground)]">
                      How this tends to change depending on where you are
                    </p>

                    <ul className="list-inside list-disc text-[var(--muted)]">
                      {useCase.archetypes.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>

                    <p className="text-[0.65rem] text-[var(--muted)]">
                      A small context snapshot shows how these differences surface at a system level.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {useCase.contextGroupIds.map((groupId) => (
                        <ContextSnapshotCard key={groupId} snapshot={snapshots[groupId]} />
                      ))}
                    </div>
                    <p className="text-[0.65rem] text-[var(--muted)]">
                      Context only. Indicators are macro-level proxies, not wages.
                    </p>
                    <p className="text-[0.65rem] text-[var(--muted)]">Boundary note: {useCase.boundary}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-[var(--secondary)]">
                  <Link href="/insights" className="hover:underline">
                    Explore related signals
                  </Link>
                  <Link
                    href={index === 0 || index === 2 ? "/#contact" : "/employers#access"}
                    className="hover:underline"
                  >
                    Apply this to your situation{" "}
                    <span className="text-[0.75rem] text-[var(--muted)]">(request access)</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="space-y-2 border-t border-[var(--card-border)] pt-8">
            <h2 className="text-lg font-semibold">What this page is not</h2>
            <p className="text-sm text-[var(--muted)]">
              Not directive guidance, not eligibility confirmation, and not a replacement for professional advice.
            </p>
            <p className="text-sm text-[var(--muted)]">
              It is a catalog of recurring themes observed across situations, without urgency or invitation.
            </p>
          </section>
        </section>
      </StructuralGridBand>
    </main>
  );
}
