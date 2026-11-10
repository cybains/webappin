"use client";
import {localizedHref} from "@/lib/i18n/shared";
import {useTranslation} from "@/lib/i18n/client";

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
import styles from "./page.module.css";

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
  const {t}=useTranslation();
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-black/10 bg-white p-2">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-tight text-foreground">
            {t(title)}
          </div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">
            {t(desc)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Anchor({ id, label }: { id: SectionId; label: string }) {
  const {t}=useTranslation();
  return (
    <a
      href={`#${id}`}
      className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white hover:text-foreground"
    >
      <span className="min-w-0 whitespace-normal leading-relaxed">{t(label)}</span>
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
  const {t}=useTranslation();
  return (
    <section id={id} className="scroll-mt-24">
      <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8 space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t(kicker)}
          </div>
          <h2 className="sufoniq-section-title text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {t(title)}
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
  const {t}=useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-black/10 bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-muted/40"
      >
        <span className="text-sm font-semibold text-foreground">{t(title)}</span>
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
  const {locale,t}=useTranslation();
  const toc = useMemo(() => [
    { id: "overview" as const, label: "What to expect" },
    { id: "principles" as const, label: "Agreeing the work" },
    { id: "constraints" as const, label: "Non-negotiables" },
    { id: "what-we-do" as const, label: "Recruitment support" },
    { id: "what-we-dont" as const, label: "Service boundaries" },
    { id: "human" as const, label: "Who handles each decision" },
    { id: "explain" as const, label: "Checks and evidence" },
    { id: "data" as const, label: "Candidate information" },
    { id: "safety" as const, label: "Missing or conflicting information" },
    { id: "audits" as const, label: "Questions and corrections" },
    { id: "faq" as const, label: "Common questions" },
  ], []);

  return (
    <div className="sufoniq-page method-trust min-h-screen text-foreground">
      <header className="sticky top-16 z-40 border-b border-black/10 bg-background/80 backdrop-blur">
        <div className="flex sufoniq-container items-center justify-between py-3 ">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-black/10 bg-white p-2"><Shield className="h-5 w-5" /></div>
            <div className="leading-tight"><div className="text-sm font-semibold tracking-tight">{t("Method & Trust")}</div><div className="text-xs text-muted-foreground">{t("Recruitment, checks and responsibilities")}</div></div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <a href="#what-we-do" className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground hover:bg-card">{t("What we do")}</a>
            <a href="#constraints" className={styles.constraintsLink}>{t("Non-negotiables")}</a>
          </div>
        </div>
      </header>
      <StructuralGridBand>
        <main className="sufoniq-container py-10 sm:py-14">
              <div className="pb-12 md:pb-16">
                <div className="flex flex-col gap-3">
                  <p className="sufoniq-meta-label">{t("For employers and job seekers")}</p>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("How our recruitment support works.")}</h1>
                  <p className="sufoniq-lead max-w-2xl text-muted-foreground">{t("A candidate can fit the job and still have steps to complete before starting work. We connect sourcing and screening with the agreed preparation, so the employer and candidate know what has been checked, what needs action and who handles it.")}</p>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Pill icon={<ClipboardList className="h-5 w-5" />} title={t("A written brief")} desc={t("Agree the work, deliverables, responsibilities and any employer fees before delivery begins.")} />
                  <Pill icon={<Eye className="h-5 w-5" />} title={t("Checks made clear")} desc={t("See the evidence collected, the checks completed and questions still to resolve.")} />
                  <Pill icon={<UserCheck className="h-5 w-5" />} title={t("People make decisions")} desc={t("Your team chooses whom to hire. Authorities and professional bodies decide applications.")} />
                  <Pill icon={<Shield className="h-5 w-5" />} title={t("Candidate permission")} desc={t("Candidate details are shared for an employer introduction only with the candidate’s agreement.")} />
                </div>
              </div>

          <div className="grid gap-8 lg:grid-cols-[256px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-40 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto">
              <div className="rounded-3xl border border-black/10 bg-white p-4">
                <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("On this page")}</div>
                <nav aria-label={t("Method and responsibilities")} className="space-y-2">{toc.map(section => <Anchor key={section.id} id={section.id} label={section.label} />)}</nav>
              </div>
            </aside>
            <div className="space-y-8">
              <Section id="overview" kicker={t("What to expect")} title={t("Start with the actual hire or job search.")}>
                <p>{t("Tell us the role, country and difficulty you need help with. We discuss where our support fits and propose the next step. An enquiry does not commit you to paid work.")}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-white p-4"><h3 className="flex items-center gap-2 font-semibold text-foreground"><CheckCircle2 className="h-4 w-4" /> {t("Employers")}</h3><p className="mt-2">{t("Bring a vacancy or a question about someone you have selected. The proposal sets out what we would take on alongside your team.")}</p></div>
                  <div className="rounded-2xl border border-black/10 bg-white p-4"><h3 className="font-semibold text-foreground">{t("Job seekers")}</h3><p className="mt-2">{t("Start with your experience and where you want to work. We agree the support for your situation. Sufoniq does not charge job seekers.")}</p></div>
                </div>
              </Section>

              <Section id="principles" kicker={t("Agreeing the work")} title={t("Know what is included before we begin.")}>
                <p>{t("The written scope identifies the search or preparation work, what you receive and the information we need from you. It also sets out fees, responsibilities and any training, specialist advice or external costs that need arranging.")}</p>
                <p className="flex items-start gap-2"><GitBranch className="mt-1 h-4 w-4 shrink-0" /> {t("If requirements change, we discuss the effect on the work, timing and costs before agreeing the change.")}</p>
              </Section>

              <Section id="constraints" kicker={t("Non-negotiables")} title={t("The commitments behind our work.")}>
                <ul className="grid gap-4 sm:grid-cols-2">{[
                  { icon: <FileText className="h-4 w-4" />, title: "Genuine information", desc: "We do not fabricate CVs, employment records, references or qualification documents." },
                  { icon: <Scale className="h-4 w-4" />, title: "Lawful employment", desc: "Recruitment does not replace the permissions required to work. We do not arrange illegal workarounds." },
                  { icon: <Lock className="h-4 w-4" />, title: "Permission before introductions", desc: "We ask before sharing candidate details with prospective employers or recruitment partners." },
                  { icon: <Shield className="h-4 w-4" />, title: "No job-seeker fees", desc: "Our fee model is employer-funded. Separate authority or third-party costs are discussed before agreeing work." },
                ].map(item => <li key={t(item.title)} className="rounded-2xl border border-black/10 bg-white p-4"><h3 className="flex items-center gap-2 font-semibold text-foreground">{item.icon}{t(item.title)}</h3><p className="mt-2">{t(item.desc)}</p></li>)}</ul>
              </Section>

              <Section id="what-we-do" kicker={t("Recruitment support")} title={t("Bring in support for the part you need.")}>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>{t("Source and screen candidates:")}</strong> {t("agree the role criteria, discuss the terms with candidates and record relevant experience, interest and stated availability.")}</li>
                  <li><strong>{t("Prepare a selected candidate’s start:")}</strong> {t("coordinate the document and application steps agreed with your team and the candidate.")}</li>
                  <li><strong>{t("Clarify qualifications:")}</strong> {t("help identify recognition or licensing questions, the relevant body and the evidence to prepare.")}</li>
                </ul>
                <a href={localizedHref("/employers",locale)} className="font-semibold underline underline-offset-4">{t("Explore employer support →")}</a>
              </Section>

              <Section id="what-we-dont" kicker={t("Service boundaries")} title={t("An introduction is not permission to start.")}>
                <p className="flex items-start gap-2"><XCircle className="mt-1 h-4 w-4 shrink-0" /> {t("Candidate experience, interest and availability do not establish immigration permission or professional authorisation. Outstanding requirements remain part of the hiring plan.")}</p>
                <p>{t("We do not promise a job offer, visa approval, qualification outcome or fixed arrival date. Where an assignment needs regulated legal advice or training, the proposal identifies that need and who will arrange it.")}</p>
              </Section>

              <Section id="human" kicker={t("Responsibilities")} title={t("Know who handles each decision.")}>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>{t("Sufoniq:")}</strong> {t("the sourcing, screening and preparation work agreed in writing.")}</li>
                  <li><strong>{t("The employer:")}</strong> {t("selection, employment terms, the hiring decision and its employer obligations.")}</li>
                  <li><strong>{t("The candidate:")}</strong> {t("accurate information, genuine documents and confirmation of interest and availability.")}</li>
                  <li><strong>{t("Authorities and competent bodies:")}</strong> {t("permit, visa, recognition, registration and licensing decisions.")}</li>
                </ul>
              </Section>

              <Section id="explain" kicker={t("Checks and evidence")} title={t("A clear record of what is known.")}>
                <p>{t("Screening criteria and the evidence to collect are agreed for the role. Practical tests, reference checks and document verification are included when specified in the scope.")}</p>
                <p>{t("Candidate notes distinguish experience and statements from checks completed and matters still to verify. For agreed preparation work, the action plan identifies documents, responsibilities and outstanding steps.")}</p>
                <p>{t("Our public market data provides context for a search. Migration flows or vacancy rates do not prove that a particular candidate is available or eligible.")}</p>
              </Section>

              <Section id="data" kicker={t("Candidate information")} title={t("Share only what the conversation needs.")}>
                <p>{t("An initial enquiry needs a short description of the vacancy or your situation. Leave out passport numbers, candidate document scans and sensitive personal details.")}</p>
                <p>{t("If further documents are needed, we explain what to provide and for what purpose. Permission for an employer introduction is separate from the email and hosting providers that handle enquiries.")}</p>
                <a href={localizedHref("/privacy-policy",locale)} className="font-semibold underline underline-offset-4">{t("Read how we handle personal information →")}</a>
              </Section>

              <Section id="safety" kicker={t("Questions to resolve")} title={t("Missing information stays visible.")}>
                <p>{t("If a document is missing, a candidate’s account conflicts with the evidence or a requirement is unclear, we raise the question rather than record it as checked. The affected step waits for the information or decision it needs.")}</p>
                <p>{t("We do not accept requests to falsify evidence, conceal material employment terms or bypass legal requirements.")}</p>
              </Section>

              <Section id="audits" kicker={t("Questions and corrections")} title={t("Raise a concern with the team.")}>
                <p>{t("If you believe a candidate note, requirement or agreed action is wrong, tell us which item concerns you and share the relevant information. We review the issue against the brief and available evidence, explain the next action and correct our records where needed.")}</p>
                <a href="mailto:support@sufoniq.com" className="font-semibold underline underline-offset-4">support@sufoniq.com</a>
              </Section>

              <Section id="faq" kicker={t("Common questions")} title={t("Before you decide to work with us.")}>
                <div className="space-y-3">
                  <AccordionItem title={t("Can you work alongside our existing recruiter?")}>{t("Yes. We can agree sourcing, screening or preparation work alongside your internal team or existing recruiter. You keep the hiring decision.")}</AccordionItem>
                  <AccordionItem title={t("What determines the start date?")}>{t("The role, destination and candidate’s current permissions determine the preparation needed. We plan around your target date and identify outstanding checks and approvals before a start is confirmed.")}</AccordionItem>
                  <AccordionItem title={t("Where do Insights and the map fit?")}>{t("They explain market context and recruitment questions. The requirements of an actual hire are assessed against the specific job, country and candidate.")}</AccordionItem>
                </div>
              </Section>

              <footer className="rounded-3xl border border-black/10 bg-white p-6 text-sm text-muted-foreground">
                <h2 className="font-semibold text-foreground">{t("Tell us what you need help with.")}</h2>
                <p className="mt-2">{t("Start with a vacancy or your job-search situation. We’ll discuss the next step.")}</p>
                <div className="mt-4 flex flex-wrap gap-5 font-semibold"><a href={localizedHref("/employers#employer-enquiry",locale)} className="underline underline-offset-4">{t("Discuss a hire →")}</a><a href={localizedHref("/work-in-europe",locale)} className="underline underline-offset-4">{t("Job-seeker support →")}</a></div>
              </footer>
            </div>
          </div>
        </main>
      </StructuralGridBand>
    </div>
  );
}
