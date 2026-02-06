"use client";

import React, { useMemo, useState } from "react";
import {
  Shield,
  Scale,
  Lock,
  Eye,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GitBranch,
  UserCheck,
  ClipboardList,
  Link as LinkIcon,
} from "lucide-react";
import { StructuralGridBand } from "@/components/StructuralGridBand";

type SectionId =
  | "overview"
  | "principles"
  | "constraints"
  | "what-we-do"
  | "what-we-dont"
  | "human"
  | "explain"
  | "data"
  | "safety"
  | "audits"
  | "faq";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function Pill({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-black/10 bg-white p-2">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}

function Anchor({ id, label }: { id: SectionId; label: string }) {
  return (
    <a
      href={`#${id}`}
      className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white hover:text-foreground"
    >
      <span className="truncate">{label}</span>
      <span className="opacity-0 transition group-hover:opacity-100">
        <LinkIcon className="h-4 w-4" />
      </span>
    </a>
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
      <div className="rounded-3xl border border-black/10 bg-white bg-white p-6 shadow-sm sm:p-8 space-y-5 ring-1 ring-black/10">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {kicker}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
        </div>
        <div className="space-y-5 text-sm leading-7 text-muted-foreground">
          {children}
        </div>
      </div>
    </section>
  );
}

function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-black/10 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-muted/40"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span
          className={cx(
            "text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          <AlertTriangle className="h-4 w-4" />
        </span>
      </button>
      {open ? (
        <div className="px-4 pb-4 text-sm leading-7 text-muted-foreground">{children}</div>
      ) : null}
    </div>
  );
}

export default function MethodTrustPage() {
  const toc = useMemo(
    () =>
      [
        { id: "overview" as const, label: "Overview" },
        { id: "principles" as const, label: "Governance principles" },
        { id: "constraints" as const, label: "Non‑negotiable constraints" },
        { id: "what-we-do" as const, label: "What we do" },
        { id: "what-we-dont" as const, label: "What we refuse" },
        { id: "human" as const, label: "Human‑in‑the‑loop" },
        { id: "explain" as const, label: "Explainability" },
        { id: "data" as const, label: "Data handling" },
        { id: "safety" as const, label: "Safety & misuse" },
        { id: "audits" as const, label: "Audits & accountability" },
        { id: "faq" as const, label: "FAQ" },
      ],
    []
  );

  return (
    <div className="method-trust min-h-screen text-foreground [&a]:text-inherit [&a]:underline [&a]:decoration-black/20 [&a]:underline-offset-4 hover:[&a]:decoration-black/60">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-black/10 bg-white p-2">
              <Shield className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Method & Trust</div>
              <div className="text-xs text-muted-foreground">
                Governance: constraints, boundaries, and accountability
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <a
              href="#what-we-do"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground hover:bg-card"
            >
              What we do
            </a>
            <a
              href="#constraints"
              className="rounded-xl bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-90"
            >
              Non‑negotiables
            </a>
          </div>
        </div>
      </header>

      <StructuralGridBand>
        {/* Hero */}
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
            <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm ring-1 ring-black/10">
              <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </div>
              <nav className="space-y-2">
                {toc.map((t) => (
                  <Anchor key={t.id} id={t.id} label={t.label} />
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-8">
              <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8 ring-1 ring-black/10">
              <div className="flex flex-col gap-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  Governance, not marketing
                </div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  How we constrain ourselves
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  This page defines the boundaries we operate within as a mobility and labour‑market intelligence platform: what we do, what we refuse, and how we reduce legal, financial, and personal risk when turning interpretation into action. It describes how we work, not personalized advice.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Pill
                  icon={<Lock className="h-5 w-5" />}
                  title="Constraint‑first"
                  desc="We prefer lawful, verifiable, and reversible steps over optimistic leaps — especially when decisions may affect immigration status, employment eligibility, or residency."
                />
                <Pill
                  icon={<Eye className="h-5 w-5" />}
                  title="Explainable outputs"
                  desc="We show reasoning paths, assumptions, sources, and confidence so decisions affecting visas, contracts, taxation, or relocation can be audited and independently verified."
                />
                <Pill
                  icon={<UserCheck className="h-5 w-5" />}
                  title="Human checkpoints"
                  desc="High‑impact decisions, such as visa pathway selection or employment eligibility, trigger human review — not automation."
                />
                <Pill
                  icon={<ClipboardList className="h-5 w-5" />}
                  title="Accountability"
                  desc="We define what is in scope, what is explicitly out of scope, and which legal or labour‑market evidence we rely on."
                />
              </div>
            </div>

            <Section id="overview" kicker="Purpose" title="What this page is (and isn’t)">
              <p>
                Method & Trust is a governance page for Sufoniq. It is not an insights feed or a sales layer. Its role is to make boundaries legible before decisions are made.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <CheckCircle2 className="h-4 w-4" /> What you should expect
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Clear legal and operational constraints, including refusal lines</li>
                    <li>Transparent assumptions and evidence types</li>
                    <li>Human review points for high‑impact steps</li>
                    <li>Language that is explicit, not flattering</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <XCircle className="h-4 w-4" /> What you should not expect
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Guarantees or promises of outcomes</li>
                    <li>“Best country” claims, rankings, or one‑size mobility advice</li>
                    <li>Automation that bypasses legality</li>
                    <li>Opinion disguised as policy</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section
              id="principles"
              kicker="Governance principles"
              title="The rules that shape every output"
            >
              <p>
                These principles remain stable even as labour markets, policies, or economic data change. They scaffold all Sufoniq outputs.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Scale className="h-4 w-4" /> Lawful‑only stance
                  </div>
                  <p className="mt-2">
                    We do not facilitate unlawful workarounds in immigration, employment, or taxation. If legality is unclear or jurisdiction‑dependent, we treat it as a risk and require verification against official sources.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <GitBranch className="h-4 w-4" /> Reversibility
                  </div>
                  <p className="mt-2">
                    We prefer plans with exit ramps. We surface dependency chains (job → permit → tax → residency), timelines, and points where changing course is still low‑cost.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Eye className="h-4 w-4" /> Evidence over confidence
                  </div>
                  <p className="mt-2">
                    We separate labour‑market data, policy text, and economic indicators from interpretation. We label assumptions and state what evidence would change a conclusion, recognizing that rules vary by jurisdiction.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Shield className="h-4 w-4" /> Harm minimization
                  </div>
                  <p className="mt-2">
                    We do not optimize for “wins” at any cost. We reduce fraud, exploitation, and unsafe outcomes — even when that means saying no.
                  </p>
                </div>
              </div>
            </Section>

            <Section
              id="constraints"
              kicker="Non‑negotiables"
              title="Hard boundaries we do not cross"
            >
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <AlertTriangle className="h-4 w-4" /> These are constraints, not opinions
                </div>
                <p className="mt-2">
                  If a request conflicts with these constraints, we refuse or redirect. This governance exists to protect users from legal, financial, and personal harm.
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: <Lock className="h-4 w-4" />,
                    title: "No unlawful guidance",
                    desc: "No evasion, fraud, or instructions designed to bypass immigration, employment, or tax rules.",
                  },
                  {
                    icon: <FileText className="h-4 w-4" />,
                    title: "No fabricated documents",
                    desc: "We do not create fake credentials, references, or legal paperwork.",
                  },
                  {
                    icon: <Shield className="h-4 w-4" />,
                    title: "No exploitation",
                    desc: "No tactics that harm vulnerable people or enable coercion.",
                  },
                  {
                    icon: <Eye className="h-4 w-4" />,
                    title: "No false certainty",
                    desc: "We label uncertainty and avoid guarantees when evidence is limited.",
                  },
                ].map((x) => (
                  <li
                    key={x.title}
                    className="rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      {x.icon}
                      {x.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{x.desc}</p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="what-we-do" kicker="Scope" title="What we do">
              <p>
                We synthesize policy, labour‑market, and economic information into structured options to help individuals and employers understand trade‑offs, dependencies, and potential next safe steps.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Option space</div>
                  <p className="mt-2">
                    We map alternative mobility or employment pathways, surface legal and market constraints, and explain why a path may be viable — or why it may not be.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Risk flags</div>
                  <p className="mt-2">
                    We surface legal, timeline, cost, and documentation risks early — before they become irreversible or expensive.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Evidence notes</div>
                  <p className="mt-2">
                    We attach what information the conclusion rests on and what would change the
                    answer.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Next safe actions</div>
                  <p className="mt-2">
                    We propose reversible steps such as eligibility checks, document validation, and source verification — not irreversible commitments.
                  </p>
                </div>
              </div>
            </Section>

            <Section id="what-we-dont" kicker="Refusals" title="What we refuse (and why)">
              <p>
                Refusal is a trust signal. If we can’t do something safely or lawfully, we will say so
                and suggest a compliant alternative.
              </p>
              <div className="space-y-3">
                <AccordionItem title="Requests to bypass immigration, tax, or employment rules">
                  We refuse evasion guidance. We can instead outline legitimate immigration or employment pathways, typical evidence requirements, indicative timelines, and where to verify current rules.
                </AccordionItem>
                <AccordionItem title="Fabrication of resumes, references, or credentials">
                  We refuse falsification. We can help you present real experience clearly, quantify
                  outcomes, and choose honest positioning.
                </AccordionItem>
                <AccordionItem title="Instructions for exploitation, harassment, or harm">
                  We refuse harm. We can help with safety planning, de‑escalation resources, and
                  lawful reporting routes.
                </AccordionItem>
                <AccordionItem title="High‑stakes decisions without sufficient information">
                  We can proceed only if we can label uncertainty and define what must be verified
                  (e.g., official sources, legal counsel, employer policy).
                </AccordionItem>
              </div>
            </Section>

            <Section id="human" kicker="Checks" title="Human‑in‑the‑loop review">
              <p>
                Automation is never the final authority for high‑impact outcomes. When a decision could materially affect immigration status, employment eligibility, taxation, or safety, human review is required.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Triggers</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Legal/visa pathway selection</li>
                    <li>Document requirements & submissions</li>
                    <li>Any advice that could change residency status</li>
                    <li>Safety‑related scenarios</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">What review looks like</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Assumption check</li>
                    <li>Source and currency verification</li>
                    <li>Compliance scan</li>
                    <li>Plain‑language explanation</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section id="explain" kicker="Explainability" title="How we show our work">
              <p>
                When Sufoniq provides an output, we include enough structure for users to audit how conclusions were reached, while final responsibility remains with the user and relevant authorities.
              </p>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Eye className="h-4 w-4" /> Typical explanation layer
                </div>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Inputs used (what you told us)</li>
                  <li>Constraints applied (what we refused to assume)</li>
                  <li>Evidence used (sources / heuristics)</li>
                  <li>Options with trade‑offs</li>
                  <li>Uncertainties and what to verify</li>
                </ol>
              </div>
            </Section>

            <Section id="data" kicker="Data" title="Data handling (plain language)">
              <p>
                We minimize personal data by default and request only what is necessary to produce a legally constrained mobility or employment analysis. We do not replace professional legal, tax, or immigration advice.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Data minimization</div>
                  <p className="mt-2">
                    We prefer summaries over raw sensitive documents, unless the workflow requires it.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Access boundaries</div>
                  <p className="mt-2">
                    Only the components needed for the task touch the data. We avoid broad access by
                    default.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="text-sm font-semibold text-foreground">What we recommend you do</div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Remove unnecessary identifiers when sharing documents</li>
                  <li>Use official sources for legal requirements</li>
                  <li>Confirm final submissions with qualified professionals when needed</li>
                </ul>
              </div>
            </Section>

            <Section id="safety" kicker="Misuse" title="Safety & misuse prevention">
              <p>
                We monitor for misuse patterns (fraud, evasion, exploitation of mobility or labour systems). When detected, we refuse and redirect.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Shield className="h-4 w-4" /> Safety posture
                  </div>
                  <p className="mt-2">
                    If the risk is high and the user intent is unclear, we default to protecting people
                    and compliance.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Scale className="h-4 w-4" /> Verification mindset
                  </div>
                  <p className="mt-2">
                    When facts matter (eligibility, rules, deadlines), we emphasize verification over
                    confidence.
                  </p>
                </div>
              </div>
            </Section>

            <Section id="audits" kicker="Accountability" title="Audits & accountability">
              <p>
                Governance in mobility and labour systems requires traceability. We make decisions reviewable and correctable over time, acknowledging that external rules and interpretations may change.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Change log</div>
                  <p className="mt-2">
                    When we update rules or heuristics, we record what changed and why.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-sm font-semibold text-foreground">Appeal & correction</div>
                  <p className="mt-2">
                    If something looks wrong, we want a path to challenge it with evidence.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileText className="h-4 w-4" /> What we document
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Assumptions and inputs</li>
                  <li>Constraint checks</li>
                  <li>Sources / evidence types</li>
                  <li>Review points and human decisions</li>
                </ul>
              </div>
            </Section>

            <Section id="faq" kicker="FAQ" title="Common questions">
              <div className="space-y-3">
                <AccordionItem title="Do you guarantee outcomes?">
                  No. We reduce uncertainty and prevent avoidable mistakes, but we do not control
                  third‑party decisions (governments, employers, landlords, etc.).
                </AccordionItem>
                <AccordionItem title="Is this legal advice?">
                  No. We provide structured information and risk framing. For legal decisions, consult
                  qualified professionals.
                </AccordionItem>
                <AccordionItem title="Do you ever say ‘no’?">
                  Yes. Refusal is part of governance. If a request conflicts with constraints, we refuse
                  and offer safer alternatives.
                </AccordionItem>
                <AccordionItem title="Where do Insights fit?">
                  Insights shows how we interpret data. Method & Trust shows the boundaries applied
                  when acting on those interpretations.
                </AccordionItem>
              </div>
            </Section>

            <footer className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-muted-foreground">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Quiet cross‑link</div>
                  <p className="mt-1">
                    If you want to see our interpretive work, read Insights. This page is governance.
                  </p>
                </div>
                <a
                  href="#overview"
                  className="mt-3 inline-flex w-fit items-center justify-center rounded-xl border border-black/10 bg-background/50 px-3 py-2 text-sm text-foreground hover:bg-muted/60 sm:mt-0"
                >
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
