"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import { GDPPerCapitaChart } from "@/components/charts/GDPPerCapitaChart";
import { StructuralGridBand } from "@/components/StructuralGridBand";

const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false });

const sectionSpacing = "relative z-10 px-6 py-16 scroll-mt-24";

  const tracks = [
  {
    title: "Work in Europe",
    description:
      "Understand where you’re eligible, where demand is real, and which routes are worth the paperwork — before you commit months to the wrong path.",
    outcome: "TOURISM-LEVEL HYPE IS EASY.\nMARKET REALITY ISN’T.",
    href: "#apply",
  },
  {
    title: "Live & Work Remotely",
    description:
      "Choose a base that holds up legally and financially. Compare countries on residency, tax exposure, and long-term stability — not aesthetics.",
    outcome: "REMOTE IS FLEXIBLE.\nCOMPLIANCE IS NOT.",
    href: "#apply",
  },
  {
    title: "Hire Across Borders",
    description:
      "Build cross-border teams with clear constraints: payroll, compliance, and timelines aligned from day one.",
    outcome: "SCALE WITHOUT DISCOVERING RULES THE HARD WAY.",
    href: "#employers",
  },
  ];

function IntentRouter() {
  return (
    <section id="router" className="relative z-10 px-6 py-16 scroll-mt-24">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Choose the track that fits the move you are making.
          </h2>
          <p className="text-sm md:text-base sufoniq-body-text">
            Different decisions come with different constraints. Start with the one you’re actually facing.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tracks.map((track) => (
          <a
            key={track.title}
            href={track.href}
            className="group block sufoniq-card transition hover:border-primary/60 hover:bg-primary/5"
          >
              <h3 className="text-xl font-semibold text-foreground transition group-hover:text-primary">
                {track.title}
              </h3>
              <p className="mt-3 text-sm sufoniq-body-text">{track.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground whitespace-pre-line">
                {track.outcome}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofBlock() {
  return (
    <section id="decide" className={`${sectionSpacing}`}>
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="sufoniq-meta-label">Proof</p>
            <h2 className="text-3xl font-semibold">Growth trends beat reputation.</h2>
          </div>
          <p className="text-base sufoniq-body-text">
            We use data to avoid wishful thinking.
          </p>
          <p className="text-base sufoniq-body-text">
            This chart shows how economies actually move over time — not just where they ended up.
          </p>
          <p className="text-base sufoniq-body-text">
            What matters isn’t who’s richest today.
          </p>
          <p className="text-base sufoniq-body-text">
            It’s where growth is still happening — and where opportunities are still compounding.
          </p>
          <p className="text-sm sufoniq-body-text">
            Takeaway: look for momentum, not prestige. Hire, move, or invest where the slope is rising — not where it already flattened out.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            This is why we talk about trajectories, not trophies.
          </p>
        </div>
        <div className="w-full rounded-3xl border border-border bg-[var(--background)] p-6 shadow-[0_15px_35px_rgba(15,23,42,0.12)]">
          <div className="h-[320px] w-full">
            <GDPPerCapitaChart />
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className={`${sectionSpacing}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <p className="sufoniq-meta-label">WHAT WE ACTUALLY DO</p>
          <h2 className="text-3xl md:text-4xl font-semibold">
            We turn signals into decisions that hold up.
          </h2>
          <p className="text-sm md:text-base sufoniq-body-text">
            We take economic data, mobility rules, and hiring constraints — and turn them into clear paths you can actually act on.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Decision intelligence</h3>
            <p className="text-sm sufoniq-body-text">
              We narrow options before we optimise them — removing paths that don’t work so the remaining ones are worth pursuing.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Shortlists built on reality, not optimism.
            </p>
          </div>
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Mobility logic</h3>
            <p className="text-sm sufoniq-body-text">
              We map legal routes, timelines, and trade-offs upfront, so cross-border moves stay predictable and compliant.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Lawful paths that don’t unravel later.
            </p>
          </div>
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Hiring pipelines</h3>
            <p className="text-sm sufoniq-body-text">
              We design repeatable, compliance-aware hiring flows that scale across borders without paperwork chaos.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Teams built faster, with fewer surprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ApplySection() {
  return (
    <section id="apply" className={`${sectionSpacing}`}>
        <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-border/40 bg-[var(--background)] p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="sufoniq-meta-label">
                  Apply it to your situation.
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  From principles to a path you can defend.
                </h2>
              </div>
              <p className="text-sm md:text-base sufoniq-body-text space-y-1">
                <span>What you’ve seen so far is how decisions hold up in the abstract.</span>
                <span>
                  Here, those rules meet your constraints — and only the viable paths remain.
                </span>
                <span>
                  You don’t get advice. You get eligibility, trade-offs, and next steps that survive contact with reality.
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-95"
                >
                  Request access to platform
                </a>
                <a
                  href="/method-trust"
                  className="inline-flex items-center justify-center rounded-2xl border border-border/90 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-100"
                >
                  Read boundaries
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WHAT YOU BRING</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  Citizenship, role or hiring need, work model, and the limits you’re operating under.
                </p>
              </div>
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WHAT EMERGES</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  A realistic shortlist, clear trade-offs, and a timeline you can act on.
                </p>
              </div>
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WHAT’S OFF THE TABLE</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  Guarantees. Loopholes. Anything that doesn’t hold up legally or economically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmployersLane() {
  return (
    <section id="employers" className={`${sectionSpacing}`}>
        <div className="max-w-6xl mx-auto space-y-4 rounded-2xl border border-border/40 bg-[var(--background)] p-10 lg:p-12 text-center">
          <div className="space-y-2">
            <p className="sufoniq-meta-label">EMPLOYERS</p>
            <Link href="/employers" className="space-y-3 block">
              <h3 className="text-3xl font-semibold text-foreground">Cross-border hiring, without improvisation.</h3>
              <p className="text-sm sufoniq-body-text">
                Hiring across borders breaks down when decisions are made ad hoc.
                This lane is built for teams that need speed and compliance — without guessing where the edges are.
              </p>
              <p className="text-sm sufoniq-body-text">
                Roles, timelines, jurisdictions, and constraints are treated as inputs.
                What comes out is a hiring path that holds up operationally and legally.
              </p>
            </Link>
          </div>
          <Link
            href="/employers#access"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:brightness-95"
          >
            Request platform access
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground pt-3">
            <Link href="/employers" className="text-muted-foreground hover:underline">
              For teams hiring across Europe — not marketplaces, not shortcuts.
            </Link>
          </p>
        </div>
    </section>
  );
}

function MethodTrustSection() {
  const pillars = [
    {
      title: "Constraint-first",
      body: "Decisions start with legal, economic, and practical limits — not preferences.",
    },
    {
      title: "Explainability",
      body: "Outputs come with reasons and trade-offs. No black boxes. No vibes.",
    },
    {
      title: "Human-in-the-loop",
      body: "Edge cases escalate. Automation stops where judgment matters.",
    },
  ];

  return (
    <section className={`${sectionSpacing}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <p className="sufoniq-meta-label">METHOD & TRUST</p>
          <Link href="/method-trust" className="block">
            <h2 className="text-3xl md:text-4xl font-semibold">
              We earn trust by being explicit about limits.
            </h2>
          </Link>
          <p className="text-sm md:text-base sufoniq-body-text">
            Sufoniq is opinionated about what does not work. Being explicit about limits keeps decisions grounded and serious.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="sufoniq-card space-y-2">
              <h3 className="text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
              <p className="text-sm sufoniq-body-text">{pillar.body}</p>
            </article>
          ))}
        </div>
        <p className="text-sm sufoniq-body-text">
          We don’t optimise for speed alone. We optimise for paths that hold up.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark relative">
      <div className="absolute top-0 left-0 w-full h-screen -z-10 opacity-40 pointer-events-none">
        <WorldMap />
      </div>

      <section id="hero" className="h-[70vh] relative z-10 bg-transparent">
        <Hero />
      </section>

      <StructuralGridBand>
        <IntentRouter />

        <div className="how-it-works-divider" aria-hidden />

        <div className="scroll-mt-24">
          <HowItWorks />
        </div>

        <div className="how-it-works-divider" aria-hidden />

        <ProofBlock />

        <Services />

        <ApplySection />

        <EmployersLane />

        <MethodTrustSection />

        <Contact />
      </StructuralGridBand>
    </main>
  );
}
