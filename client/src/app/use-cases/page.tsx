import Link from "next/link";
import { formatIndicatorValue, loadContextSnapshots, type ContextSnapshot } from "@/lib/contextSnapshots";
import { StructuralGridBand } from "@/components/StructuralGridBand";

const useCases = [
  {
    title: "Working in Europe",
    observationLines: [
      "Companies and individuals often try to keep employment, residence, and payroll neatly contained in one country — while still hoping to stay flexible for future moves within Europe.",
      "That expectation is understandable.",
      "It just doesn’t survive contact with the system very well.",
    ],
    whyHardLines: [
      "A common assumption is that one permit, one employer, or one service will “solve” the entire move.",
      "In reality, permit type and employer relationship quietly reshape timelines and constraints. What looks like a single decision on paper quickly becomes several interdependent ones.",
      "Nothing is broken. The system is just doing more than it appears to be doing.",
    ],
    archetypes: [
      "Permit renewal windows usually follow capital-city workloads, not project calendars — which makes overlaps uneven by default.",
      "Payroll cut-offs vary by tax authority, so a single pay run can span multiple systems.",
      "Social benefits typically activate only after local residency paperwork clears, and that timing differs by municipality.",
      "Cross-border allowances follow bilateral agreements, not platform-level promises.",
    ],
    boundary:
      "This block looks at formal employment contexts. Informal labour arrangements and experimental stays are out of scope.",
    contextGroupIds: ["EU27", "EFTA", "UK"],
  },
  {
    title: "Hiring Across Borders",
    observationLines: [
      "Hiring outside the home market stretches timelines because employment, residence, and payroll stop living in the same system.",
      "That friction often appears later than expected — after offers are signed and start dates are discussed.",
    ],
    whyHardLines: [
      "There’s often an assumption that cross-border hiring can be “translated” from a domestic setup with a few local adjustments.",
      "In practice, permit types and employer relationships shift constraints entirely. What works in one jurisdiction can become a blocker in another without warning.",
      "Hiring doesn’t fail here. It slows — until the systems catch up.",
    ],
    archetypes: [
      "Budget owners refer to EU-wide offers, even though contracts bind to national labour law.",
      "Recruiters rely on local partners to translate liabilities rather than redesign policy all at once.",
      "Time-to-pay changes country by country, because payroll and tax reporting follow different rhythms.",
      "Benefits packages map to labour codes that vary sharply across regions.",
    ],
    boundary:
      "This block focuses on compliant hiring operations. Temporary staffing and contractor-only models are out of scope.",
    contextGroupIds: ["EU27", "WBALK", "E_NEI"],
  },
  {
    title: "Living and Working Remotely",
    observationLines: [
      "Remote work looks flexible. The infrastructure underneath it usually isn’t.",
      "Most long-term remote setups still rely on a stable legal and administrative base.",
    ],
    whyHardLines: [
      "Taxes, healthcare, and residency rules tend to fix the location decision earlier than people expect.",
      "Flexibility exists — just not at every layer at once.",
      "Remote doesn’t remove structure. It just redistributes it.",
    ],
    archetypes: [
      "Many digital nomads combine short stays with one formal residency base, even if that wasn’t the original plan.",
      "Hybrid workers split time between a home location and a city where they maintain a secondary address.",
      "Connectivity, co-working access, and declaration requirements tend to move together.",
      "Housing leases often include clauses tied to municipal registration and local participation.",
    ],
    boundary:
      "This block addresses longer stays. Weekend tourism and informal hosting arrangements are out of scope.",
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
      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.35em] text-[var(--foreground)]">
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
              <span className="font-medium text-[var(--foreground)]">
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
            <h1 className="text-3xl font-semibold md:text-4xl">Situations we observe</h1>
            <p className="text-base text-[var(--muted)]">
              This page collects recurring mobility situations we see again and again.
            </p>
            <p className="text-base text-[var(--muted)]">
              Each block describes what tends to happen before tools, partners, or actions are even relevant.
            </p>
            <p className="text-base text-[var(--muted)]">No pitch. No shortcuts. Just patterns.</p>
          </header>

          <div className="space-y-12">
            {useCases.map((useCase, index) => (
              <article
                key={useCase.title}
                className="space-y-4 rounded-3xl border border-[var(--card-border)] bg-[var(--card)]/90 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.08)]"
              >
                <h2 className="text-xl font-semibold text-[var(--foreground)]">
                  {useCase.title}
                </h2>

                <div className="space-y-3 text-sm text-[var(--muted)]">
                  <p className="text-[var(--foreground)] font-semibold">What we tend to observe</p>
                  {useCase.observationLines.map((line) => (
                    <p key={`${useCase.title}-obs-${line}`} className="text-[var(--foreground)]">
                      {line}
                    </p>
                  ))}
                  <p className="text-[var(--foreground)] font-semibold">Why this usually feels harder than expected</p>
                  {useCase.whyHardLines.map((line) => (
                    <p key={`${useCase.title}-hard-${line}`} className="text-[var(--foreground)]">
                      {line}
                    </p>
                  ))}

                  <div className="space-y-3 rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--background)]/50 p-5">
                    <p className="font-semibold text-[var(--foreground)]">
                      How this tends to change depending on where you are
                    </p>

                    <ul className="list-inside list-disc space-y-1 text-[var(--muted)]">
                      {useCase.archetypes.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>

                    <p className="text-[0.65rem] text-[var(--muted)]">
                      Context snapshot (system-level only)
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

                <div className="flex flex-wrap gap-3 text-sm">
                  <Link
                    href="/insights"
                    className="inline-flex items-center justify-center rounded-2xl border border-[var(--card-border)] px-5 py-2 font-semibold text-[var(--foreground)] transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Explore related signals
                  </Link>
                  <Link
                    href={index === 0 || index === 2 ? "/#contact" : "/employers#access"}
                    className="inline-flex items-center justify-center h-12 rounded-2xl bg-primary bg-[color:var(--primary)] px-8 text-base font-semibold text-primary-foreground text-[color:var(--primary-foreground)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Apply this to your situation
                    <span className="sr-only">request access</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="space-y-2 border-t border-[var(--card-border)] pt-8">
            <h2 className="text-lg font-semibold">What this page is not</h2>
            <p className="text-sm text-[var(--muted)]">Not directive guidance.</p>
            <p className="text-sm text-[var(--muted)]">Not eligibility confirmation.</p>
            <p className="text-sm text-[var(--muted)]">Not a replacement for professional advice.</p>
          </section>
        </section>
      </StructuralGridBand>
    </main>
  );
}
