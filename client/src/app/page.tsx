import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import { GDPPerCapitaChart } from "@/components/charts/GDPPerCapitaChart";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import HomepageMap from "@/components/HomepageMap";

const sectionSpacing = "relative z-10 px-6 py-16 scroll-mt-24";

  const tracks = [
  {
    title: "Hire Across Borders",
    description:
      "Need people for your team? Explore sourcing, screening and the practical requirements of hiring across borders.",
    action: "Explore employer support",
    href: "/employers",
    primary: true,
  },
  {
    title: "Work in Europe",
    description:
      "Planning your next move? Explore support for your job search and the requirements of working in Europe.",
    action: "Explore job-search support",
    href: "/core-services#job-search-support",
    primary: false,
  },
  ];

function IntentRouter() {
  return (
    <section id="router" className="relative z-10 px-6 py-16 scroll-mt-24">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Different moves. The same need for clarity.
          </h2>
          <p className="text-sm md:text-base sufoniq-body-text">
            Choose your starting point. We’ll show you the support relevant to your situation.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tracks.map((track) => (
          <Link
            key={track.title}
            href={track.href}
            className={`group flex h-full flex-col sufoniq-card transition hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${track.primary ? "ring-1 ring-sky-200" : ""}`}
          >
              <h3 className="text-xl font-semibold text-foreground transition group-hover:text-primary">
                {track.title}
              </h3>
              <p className="mt-3 text-sm sufoniq-body-text">{track.description}</p>
              <span className={`mt-auto flex items-center gap-2 pt-5 text-xs font-semibold tracking-wide ${track.primary ? "text-sky-800" : "text-slate-600"}`}>
                {track.action}
                <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </span>
            </Link>
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
            <p className="sufoniq-meta-label">Market context</p>
            <h2 className="text-3xl font-semibold">Read the market beyond its reputation.</h2>
          </div>
          <p className="text-base sufoniq-body-text">
            A country’s reputation is a starting point.
          </p>
          <p className="text-base sufoniq-body-text">
            Hiring decisions also need a view of how its economy, labour market and mobility conditions are changing.
          </p>
          <p className="text-base sufoniq-body-text">
            Economic trends provide context.
          </p>
          <p className="text-base sufoniq-body-text">
            Role-level demand, candidate availability and eligibility determine what that context means for your workforce plan.
          </p>
          <p className="text-sm sufoniq-body-text">
            Takeaway: test the reputation against the requirements of the role. Growth alone does not tell you whether a hiring route is workable.
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
            We connect market context with your workforce requirement — so sourcing, eligibility and the next steps can be considered together.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Decision intelligence</h3>
            <p className="text-sm sufoniq-body-text">
              Compare sourcing options against your roles, location and timing. See which assumptions support the plan and which still need evidence.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Shortlists built on reality, not optimism.
            </p>
          </div>
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Mobility logic</h3>
            <p className="text-sm sufoniq-body-text">
              Identify eligibility questions, documentation requirements and dependencies before they put pressure on the hiring timeline.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Lawful paths that don’t unravel later.
            </p>
          </div>
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Hiring pipelines</h3>
            <p className="text-sm sufoniq-body-text">
              Connect sourcing, screening and handoffs through clear criteria and responsibilities across your team and relevant partners.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Clear criteria. Clear ownership. Fewer assumptions.
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
                  Your workforce need. A clearer next move.
                </h2>
              </div>
              <p className="text-sm md:text-base sufoniq-body-text space-y-1">
                <span>Tell us the roles, work location and hiring timeline. </span>
                <span>
                  We’ll use that context to assess fit, clarify the scope
                </span>
                <span>
                  {" "}and identify the next step.
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center h-12 rounded-2xl bg-primary bg-[color:var(--primary)] px-8 text-base font-semibold text-primary-foreground text-[color:var(--primary-foreground)] transition hover:bg-primary/90 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Discuss your workforce needs
                </a>
                <a
                  href="/method-trust"
                  className="inline-flex items-center justify-center rounded-2xl border border-border/90 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-100"
                >
                  See how we work
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WHAT YOU BRING</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  Roles, headcount, location, timing and known requirements.
                </p>
              </div>
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WHAT WE CLARIFY</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  Sourcing options, verification points, dependencies and responsibilities.
                </p>
              </div>
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WHAT STAYS EXPLICIT</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  Scope, assumptions and decisions that require your team or the relevant authorities.
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
                More applicants do not automatically mean a workable hiring pipeline. Role fit, eligibility, documentation and timing need to be considered together.
              </p>
              <p className="text-sm sufoniq-body-text">
                We help your team identify the pressure points and define responsibilities before moving forward.
              </p>
            </Link>
          </div>
          <Link
            href="/employers#access"
            className="inline-flex items-center justify-center h-12 rounded-2xl bg-primary bg-[color:var(--primary)] px-8 text-base font-semibold text-primary-foreground text-[color:var(--primary-foreground)] transition hover:bg-primary/90 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Discuss your hiring requirement
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground pt-3">
            <Link href="/employers" className="text-muted-foreground hover:underline">
              For teams hiring across Europe. Built around the realities of the role.
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
      body: "Requirements and eligibility questions inform the plan from the start.",
    },
    {
      title: "Explainability",
      body: "Assumptions, trade-offs and verification points are documented.",
    },
    {
      title: "Human-in-the-loop",
      body: "Ambiguous cases receive human review. Automation stops where judgment matters.",
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
            You should be able to see what supports a recommendation, what still needs checking and who is responsible for the next decision.
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
        <HomepageMap />
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
