import { createPageMetadata } from "@/lib/seo";
export const metadata = createPageMetadata("/", "Cross-border Recruitment & Mobility | Sufoniq", "Find workforce support for European employers: sourcing, screening and coordination of eligibility, documents and hiring timelines. Discuss a role with Sufoniq.");

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Contact from "@/components/Contact";
import { GDPPerCapitaChart } from "@/components/charts/GDPPerCapitaChart";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import HomepageMap from "@/components/HomepageMap";
import WorkforceNetwork from "@/components/WorkforceNetwork";
import HeroMapLegend from "@/components/HeroMapLegend";

const sectionSpacing = "relative z-10 px-6 py-16 scroll-mt-24";

  const tracks = [
  {
    title: "Hire Across Borders",
    description:
      "Fill a role that is hard to fill locally, with sourcing and screening connected to the permit and document requirements.",
    action: "Talk about a role",
    href: "#contact",
    primary: true,
  },
  {
    title: "Work in Europe",
    description:
      "Explore realistic routes, requirements and timelines for your sector, with no recruitment or placement fees charged by Sufoniq.",
    action: "See job-seeker support",
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
            Are you hiring, or looking for work?
          </h2>
          <p className="text-sm md:text-base sufoniq-body-text">
            Two different needs. Two different routes through the site.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
          {tracks.map((track) => (
          <Link
            key={track.title}
            href={track.href}
            className={`group flex h-full flex-col sufoniq-card transition hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${track.primary ? "ring-1 ring-sky-200" : ""}`}
          >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-600">{track.primary ? "For employers" : "For job seekers"}</p>
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
            <p className="sufoniq-meta-label">Evidence</p>
            <h2 className="text-3xl font-semibold">Data tells you where to look. Not whether you can hire there.</h2>
          </div>
          <p className="text-base sufoniq-body-text">
            We use public data — Eurostat on migration and vacancies, the World Bank on economies — to inform where to look. Role-level availability and eligibility remain questions until they are checked.
          </p>
          <div className="sufoniq-card space-y-3">
            <h3 className="text-base font-semibold">What a market figure does and does not tell you</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm sufoniq-body-text">
              <li>What it measures, for which year, and which countries.</li>
              <li>Whether it applies to your role, location and start date.</li>
              <li>What still has to be verified before sourcing.</li>
            </ul>
          </div>
          <p className="text-sm sufoniq-body-text">
            This World Bank chart provides economic context. It does not establish worker availability or permission to hire.
          </p>
          <div className="flex flex-wrap gap-5 text-sm font-semibold">
            <Link href="/insights" className="text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">See how we read the data →</Link>
            <Link href="/method-trust" className="text-slate-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Check our sources and limits</Link>
          </div>
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
            From finding the right person to a workable start date.
          </h2>
          <p className="text-sm md:text-base sufoniq-body-text">
            We connect candidate sourcing with the eligibility, documentation and timing that determine whether a hire can start. Responsibilities are agreed across your team, Sufoniq and relevant partners.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Route and supply</h3>
            <p className="text-sm sufoniq-body-text">
              Assess which sourcing markets fit the role and which requirements the route depends on. We plan the route before sourcing begins.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Deciding where.
            </p>
          </div>
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Sourcing and screening</h3>
            <p className="text-sm sufoniq-body-text">
              Assess candidates against your criteria, with eligibility questions raised during screening and unresolved checks made explicit before an offer.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Choosing who.
            </p>
          </div>
          <div className="sufoniq-card">
            <h3 className="text-lg font-semibold mb-2">Mobility and start-date coordination</h3>
            <p className="text-sm sufoniq-body-text">
              Coordinate permit, residence, document and qualification steps with your team, the candidate and relevant partners, within the agreed scope. Authorities retain their decisions.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Planning the start.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-semibold"><a href="#contact" className="text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Discuss a role →</a><Link href="/core-services" className="text-slate-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">See the full service scope</Link></div>
      </div>
    </section>
  );
}

function ApplySection() {
  return (
    <section id="apply" className={`${sectionSpacing}`}>
        <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-border/40 bg-[var(--background)] p-6 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="sufoniq-meta-label">
                  Start here
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  Bring us one role.
                </h2>
              </div>
              <p className="text-sm md:text-base sufoniq-body-text">You do not need a workforce strategy to begin. Bring a role that is hard to fill, and we will discuss whether we can help, what it would take and what needs checking first.</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex w-full sm:w-auto items-center justify-center min-h-12 rounded-2xl bg-primary bg-[color:var(--primary)] px-4 sm:px-8 py-3 text-sm sm:text-base font-semibold text-primary-foreground text-[color:var(--primary-foreground)] transition hover:bg-primary/90 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Describe a role
                </a>
                <a
                  href="/method-trust"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-border/90 px-4 sm:px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-slate-100"
                >
                  See how we work
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WHAT TO SEND</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  The role, location, target start date and anything already blocking the hire.
                </p>
              </div>
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">WHAT WE DISCUSS</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  Whether we can help, what the route involves and which requirements need verification.
                </p>
              </div>
              <div className="sufoniq-card space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">BEFORE WE BEGIN</p>
                <p className="text-sm sufoniq-body-text mt-1">
                  We agree scope and responsibilities before delivery. If it is not a fit, we will say so.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MethodTrustSection() {
  const pillars = [
    {
      title: "Eligibility before commitment",
      body: "We identify eligibility requirements early and tell you which checks remain unresolved before you commit.",
    },
    {
      title: "Named owners, written scope",
      body: "The agreed scope identifies responsibilities across your team, Sufoniq, candidates and relevant partners.",
    },
    {
      title: "No recruitment fees to candidates",
      body: "We do not charge candidates recruitment or placement fees. Jobs, permits and visa dates cannot be guaranteed.",
    },
  ];

  return (
    <section className={`${sectionSpacing}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <p className="sufoniq-meta-label">METHOD & TRUST</p>
          <Link href="/method-trust" className="block">
            <h2 className="text-3xl md:text-4xl font-semibold">
              What we are accountable for — and what we cannot promise.
            </h2>
          </Link>
          <p className="text-sm md:text-base sufoniq-body-text">
            Our scope, verification points and boundaries are made explicit, so you can judge the support before moving forward.
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
          You retain the hiring decision. If a route does not hold up, we explain the issues before asking you to commit.
        </p>
      </div>
    </section>
  );
}

function CompanySection() {
  return (
    <section id="company" className={sectionSpacing} aria-labelledby="company-title">
      <div className="mx-auto max-w-6xl sufoniq-card space-y-4">
        <p className="sufoniq-meta-label">Who you are dealing with</p>
        <h2 id="company-title" className="text-3xl md:text-4xl font-semibold">Sufoniq. The company behind the work.</h2>
        <p className="max-w-3xl text-base sufoniq-body-text">Sufoniq is a brand operated by UAB Skillaxis, registered in Lithuania and operated from Vienna, Austria. We work on cross-border recruitment and mobility in Europe, with responsibilities defined for each project.</p>
        <p className="max-w-3xl text-sm sufoniq-body-text">We publish our method, sources and service boundaries so you can see how we work and decide whether we fit your requirement.</p>
        <Link href="/about" className="inline-flex text-sm font-semibold text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">About Sufoniq →</Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark relative">
      <div className="absolute top-0 left-0 w-full h-screen -z-10 pointer-events-none">
        <HomepageMap />
      </div>

      <div id="hero" className="relative z-10 bg-transparent">
        <Hero />
      </div>
      <HeroMapLegend />

      <StructuralGridBand>
        <IntentRouter />
        <Services />
        <WorkforceNetwork />

        <div className="how-it-works-divider" aria-hidden />

        <div className="scroll-mt-24">
          <HowItWorks />
        </div>

        <div className="how-it-works-divider" aria-hidden />

        <ProofBlock />

        <MethodTrustSection />

        <CompanySection />

        <ApplySection />

        <Contact />
      </StructuralGridBand>
    </main>
  );
}
