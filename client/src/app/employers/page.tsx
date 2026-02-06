"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Briefcase,
  Shield,
  Scale,
  Timer,
  Workflow,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  LineChart,
  ClipboardList,
  Users,
  Link as LinkIcon,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import { StructuralGridBand } from "@/components/StructuralGridBand";

type SectionId =
  | "overview"
  | "problem"
  | "pipeline"
  | "compliance"
  | "tradeoffs"
  | "signals"
  | "boundaries"
  | "engagement"
  | "access";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function Anchor({
  id,
  label,
  isActive,
}: {
  id: SectionId;
  label: string;
  isActive?: boolean;
}) {
  return (
    <a
      href={`#${id}`}
      className={cx(
        "group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-black/0.04 hover:text-foreground transition",
        isActive && "bg-black/0.05 text-foreground"
      )}
      aria-current={isActive ? "true" : undefined}
    >
      <span className="truncate">{label}</span>
      <span className="opacity-0 transition group-hover:opacity-100">
        <LinkIcon className="h-4 w-4" />
      </span>
    </a>
  );
}

function Stat({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-black/10 bg-background p-2">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </div>
          <div className="mt-2 text-sm leading-6 text-muted-foreground">{note}</div>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id: SectionId;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {kicker}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
        </div>
        <div className="mt-5 space-y-5 text-sm leading-7 text-muted-foreground">
          {children}
        </div>
      </div>
    </section>
  );
}

function FlowStep({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-black/10 bg-background p-2">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">{desc}</div>
        </div>
      </div>
    </div>
  );
}

export default function EmployersPage() {
  const toc = useMemo(
    () =>
      [
        { id: "overview" as const, label: "Overview" },
        { id: "problem" as const, label: "Why pipelines fail" },
        { id: "pipeline" as const, label: "Hiring pipeline model" },
        { id: "compliance" as const, label: "Compliance-aware sourcing" },
        { id: "tradeoffs" as const, label: "Speed vs risk" },
        { id: "signals" as const, label: "Talent availability signals" },
        { id: "boundaries" as const, label: "What this is / isn't" },
        { id: "engagement" as const, label: "How employers engage" },
        { id: "access" as const, label: "Employer access" },
    ],
    []
  );
  const [activeId, setActiveId] = useState<SectionId>(toc[0].id);
  const [formData, setFormData] = useState({
    workEmail: "",
    company: "",
    hiringContext: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as SectionId;
      if (hash && toc.some((entry) => entry.id === hash)) {
        setActiveId(hash);
      } else {
        setActiveId(toc[0].id);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [toc]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formStatus === "submitting") return;

    const { workEmail, company, hiringContext } = formData;
    if (!workEmail.trim() || !company.trim() || !hiringContext.trim()) {
      setFormError("All fields are required.");
      setFormStatus("error");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(workEmail)) {
      setFormError("Enter a valid work email.");
      setFormStatus("error");
      return;
    }

    setFormError(null);
    setFormStatus("submitting");

    try {
      const resp = await fetch("/api/employer-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        const payload = await resp.json().catch(() => null);
        throw new Error((payload && payload.error) || "Unable to send request.");
      }

      setFormStatus("success");
      setFormData({ workEmail: "", company: "", hiringContext: "" });
    } catch (error) {
      setFormStatus("error");
      setFormError(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen text-foreground [&_a]:text-inherit [&_a]:underline [&_a]:decoration-black/20 [&_a]:underline-offset-4 hover:[&_a]:decoration-black/60">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-black/10 bg-white p-2 shadow-sm">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Employers</div>
              <div className="text-xs text-muted-foreground">
                Hiring pipelines, compliance posture, and predictable handoffs
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <a
              href="#access"
              className="rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background shadow-sm hover:opacity-90"
            >
              Request access
            </a>
          </div>
        </div>
      </header>

      <StructuralGridBand>
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            {/* TOC */}
            <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
              <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
                <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  On this page
                </div>
                <nav className="space-y-1">
                  {toc.map((t) => (
                    <Anchor
                      key={t.id}
                      id={t.id}
                      label={t.label}
                      isActive={activeId === t.id}
                    />
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="space-y-8">
              {/* Hero */}
              <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-3">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                    <Scale className="h-4 w-4" />
                    B2B buyer surface
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Hire across borders without discovering risk after the offer.
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    Sufoniq supports employers who need to fill roles across fragmented labour markets where eligibility, compliance, and operational handoffs routinely break hiring plans.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Stat
                    icon={<Timer className="h-5 w-5" />}
                    label="Time-to-fill"
                    value="Reduce time-to-fill variance"
                    note="Identify where candidates stall or drop: sourcing noise, late eligibility checks, or unclear handoffs."
                  />
                  <Stat
                    icon={<Shield className="h-5 w-5" />}
                    label="Compliance risk"
                    value="Expose early"
                    note="Make right-to-work uncertainty, sponsorship feasibility, and documentation risk visible before offers."
                  />
                  <Stat
                    icon={<Workflow className="h-5 w-5" />}
                    label="Pipeline quality"
                    value="Increase viable conversion"
                    note="Treat candidate pools as conversion systems, not vanity supply."
                  />
                  <Stat
                    icon={<ClipboardList className="h-5 w-5" />}
                    label="Auditability"
                    value="Maintain audit trail"
                    note="Document assumptions, constraint points, and verification steps so issues surface before offer acceptance."
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">Who this is for</div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Hiring managers, HR, Legal, and Ops teams hiring across borders or into constrained labour markets.
                      </p>
                    </div>
                    <a
                      href="#access"
                      className="inline-flex items-center gap-2 rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background shadow-sm hover:opacity-90"
                    >
                      Request employer access
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Note: Individual job-seeker content is intentionally separated.
                  </div>
                </div>
              </div>

              <Section id="overview" kicker="Overview" title="A different buyer, a different proof standard">
              <p>
                Employers are not a persona variant. They are a different customer with procurement, legal, and operational risk exposure, and a different standard of proof.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4" /> Employers need
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>repeatable pipelines</li>
                    <li>compliance-aware sourcing</li>
                    <li>predictable handoffs</li>
                    <li>audit trails and clarity</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <XCircle className="h-4 w-4" /> Employers do not need
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>individual mobility philosophy</li>
                    <li>consumer conversion language</li>
                    <li>vague &ldquo;hire better&rdquo; promises</li>
                    <li>unbounded recommendations</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section id="problem" kicker="Diagnosis" title="Where hiring actually fails">
              <p>
                Hiring rarely fails because there are no candidates. It fails when signals degrade across the pipeline and uncertainty is discovered too late.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "False availability",
                    desc: "Candidates look reachable but are not hireable under right-to-work or timing constraints.",
                  },
                  {
                    title: "Late eligibility checks",
                    desc: "Eligibility is confirmed after shortlist or offer, turning uncertainty into churn.",
                  },
                  {
                    title: "Documentation drift",
                    desc: "Evidence requirements surface late, causing delays, rework, and offer fallout.",
                  },
                  {
                    title: "Handoff gaps",
                    desc: "HR, Legal, and Ops interpret constraints differently; accountability becomes unclear.",
                  },
                ].map((x) => (
                  <div key={x.title} className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="text-sm font-semibold text-foreground">{x.title}</div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{x.desc}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <AlertTriangle className="h-4 w-4" /> What this costs
                </div>
                <p className="mt-2">
                  Time-to-fill increases, candidate experience deteriorates, and compliance risk moves from a manageable question to a late-stage blocker.
                </p>
              </div>
            </Section>

            <Section id="pipeline" kicker="Pipeline" title="A hiring pipeline model you can audit">
              <p>
                Sufoniq treats hiring as a conversion system with constraint points. The goal is not more applicants; it is fewer failed offers and more viable hires.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <FlowStep
                  icon={<Users className="h-5 w-5" />}
                  title="Sourcing"
                  desc="Expand pool while controlling noise using eligibility and role constraints."
                />
                <FlowStep
                  icon={<ClipboardList className="h-5 w-5" />}
                  title="Screening"
                  desc="Explainable screening that preserves auditability and reduces false confidence."
                />
                <FlowStep
                  icon={<Shield className="h-5 w-5" />}
                  title="Eligibility validation"
                  desc="Surface right-to-work uncertainty and required verification before offer pressure."
                />
                <FlowStep
                  icon={<Workflow className="h-5 w-5" />}
                  title="Handoff"
                  desc="Make dependencies and ownership clear across HR, Legal, and Ops."
                />
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-foreground">What changes</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>eligibility checks move earlier</li>
                  <li>assumptions are documented</li>
                  <li>risk is visible before the offer stage</li>
                  <li>handoffs become predictable</li>
                </ul>
              </div>
            </Section>

            <Section id="compliance" kicker="Compliance" title="Compliance-aware sourcing">
              <p>
                Cross-border hiring introduces constraints that most sourcing tools are structurally blind to. Sufoniq does not
                replace legal counsel or payroll providers; it helps you locate uncertainty early.
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  "right-to-work varies by jurisdiction",
                  "sponsorship feasibility changes over time",
                  "misclassification risk in remote/hybrid arrangements",
                  "documentation gaps discovered post-offer",
                  "inconsistent constraint interpretation across teams",
                ].map((x) => (
                  <li key={x} className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <FileText className="h-4 w-4" /> {x}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-foreground">How we reduce surprises</div>
                <p className="mt-2">
                  We surface where verification is required and where policy or documentation assumptions are being made, so speed is chosen deliberately rather than discovered accidentally.
                </p>
              </div>
            </Section>

            <Section id="tradeoffs" kicker="Trade-offs" title="Speed vs risk (explicit)">
              <p>
                There is no risk-free hiring pipeline. Faster hiring increases exposure to eligibility error and late-stage
                fallout. Over-filtering reduces viable supply. Waiting for certainty can lose candidates.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Timer className="h-4 w-4" /> Move faster
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>higher exposure to eligibility mistakes</li>
                    <li>more post-offer verification pressure</li>
                    <li>greater documentation uncertainty</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Shield className="h-4 w-4" /> Reduce risk
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>smaller pools and slower responsiveness</li>
                    <li>more up-front verification costs</li>
                    <li>risk of losing viable candidates</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-foreground">The point</div>
                <p className="mt-2">
                  Sufoniq makes these trade-offs explicit and documentable so hiring decisions remain repeatable, defensible, and auditable.
                </p>
              </div>
            </Section>

            <Section id="signals" kicker="Signals" title="Talent availability signals">
              <p>
                Most systems confuse interest with availability. We focus on signals that survive eligibility checks and convert to hires.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Available ? hireable",
                    desc: "Eligibility and timing constraints often remove candidates late in the process.",
                  },
                  {
                    title: "Location ? eligibility",
                    desc: "Geography does not imply right-to-work or sponsorship feasibility.",
                  },
                  {
                    title: "Supply ? throughput",
                    desc: "Large pools can still produce low conversion when constraints are ignored.",
                  },
                  {
                    title: "Demand ? fillability",
                    desc: "Role demand says little about time-to-fill without constraint-aware supply.",
                  },
                ].map((x) => (
                  <div key={x.title} className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <LineChart className="h-4 w-4" /> {x.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{x.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="boundaries" kicker="Boundaries" title="What this platform is - and is not">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4" /> Sufoniq is
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>a labour-market intelligence platform for employers</li>
                    <li>a way to assess viable supply under constraints</li>
                    <li>a tool for making pipelines more predictable</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <XCircle className="h-4 w-4" /> Sufoniq is not
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>a recruiting agency</li>
                    <li>a job board</li>
                    <li>a visa consultancy</li>
                    <li>a payroll or EOR provider</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-foreground">Responsibility</div>
                <p className="mt-2">
                  We do not make hiring decisions on your behalf. We reduce uncertainty before decisions are made by making constraint points explicit, visible, and verifiable.
                </p>
              </div>
            </Section>

            <Section id="engagement" kicker="Engagement" title="How employers engage">
              <p>
                Engagement is structured and context-aware. This is not a self-serve consumer flow.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <FlowStep
                  icon={<ClipboardList className="h-5 w-5" />}
                  title="Employer intake"
                  desc="Role scope, location, constraints, and hiring timeline."
                />
                <FlowStep
                  icon={<LineChart className="h-5 w-5" />}
                  title="Supply assessment"
                  desc="Constraint-aware availability signals and coverage expectations."
                />
                <FlowStep
                  icon={<Shield className="h-5 w-5" />}
                  title="Risk mapping"
                  desc="Where compliance uncertainty exists and what requires verification."
                />
                <FlowStep
                  icon={<Workflow className="h-5 w-5" />}
                  title="Handoff"
                  desc="Clear ownership across HR, Legal, and Ops for predictable onboarding."
                />
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-foreground">What you get</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>constraint-aware sourcing plan</li>
                  <li>pipeline risk flags and verification points</li>
                  <li>documented assumptions and audit trail</li>
                  <li>clear next steps and handoff readiness</li>
                </ul>
              </div>
            </Section>

            <Section id="access" kicker="Employer access" title="Request employer access">
              <p>
                If you are accountable for hiring outcomes and the risks attached to them, you can request employer access.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Next steps may include</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>exploring the employer view</li>
                    <li>assessing talent availability under constraints</li>
                    <li>initiating an employer intake</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Boundary</div>
                  <p className="mt-2">
                    Sufoniq serves individuals and employers through separate surfaces. This page is exclusively
                    for employers.
                  </p>
                </div>
              </div>

              {/* Lightweight form (visual placeholder) */}
              <form
                onSubmit={handleSubmit}
                className="mt-4 rounded-2xl border border-black/10 bg-white p-4"
              >
                <div className="text-sm font-semibold text-foreground">Employer access request</div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Provide minimal context. We&rsquo;ll respond with the appropriate next step.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Work email
                    </span>
                    <input
                      type="email"
                      required
                      aria-required="true"
                      value={formData.workEmail}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, workEmail: event.target.value }))
                      }
                      className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
                      placeholder="name@company.com"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Company
                    </span>
                    <input
                      required
                      aria-required="true"
                      value={formData.company}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, company: event.target.value }))
                      }
                      className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
                      placeholder="Company name"
                    />
                  </label>
                  <label className="grid gap-1 sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Hiring context
                    </span>
                    <textarea
                      required
                      aria-required="true"
                      value={formData.hiringContext}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, hiringContext: event.target.value }))
                      }
                      className="min-h-[88px] rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/10"
                      placeholder="Roles, locations, timelines, and any constraints you already know."
                    />
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">
                    We do not require sensitive data to start. Keep it high-level.
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className="inline-flex items-center gap-2 rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background shadow-sm transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Request access
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  {formError && (
                    <p className="text-xs text-destructive" aria-live="polite">
                      {formError}
                    </p>
                  )}
                  {formStatus === "success" && (
                    <p className="text-xs text-success" aria-live="polite">
                      Thank you! We&rsquo;ll route your request and follow up shortly.
                    </p>
                  )}
                </div>
              </form>

              <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-foreground">What happens next</div>
                <div className="mt-2 grid gap-4 sm:grid-cols-3">
                  {["We confirm fit", "We align scope", "We define the next step"].map((t) => (
                    <div key={t} className="rounded-2xl border border-black/10 bg-white p-4">
                      <div className="text-sm font-semibold text-foreground">{t}</div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Clear expectations and boundaries before anything operational.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Shield className="h-4 w-4" /> Governance link
                </div>
                <p className="mt-2">
                  For our boundaries and refusal lines, see Method & Trust. This page is employer capability
                  and engagement.
                </p>
              </div>
            </Section>

            <footer className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-muted-foreground shadow-sm">
              <div className="flex justify-center">
                <a
                  href="#overview"
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-background/70 px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-black/40 hover:bg-black/5"
                >
                  <ArrowUp className="h-4 w-4" />
                  Back to top
                </a>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </StructuralGridBand>
  </div>
  );
}
