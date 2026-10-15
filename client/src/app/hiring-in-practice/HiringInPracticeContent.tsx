import Link from "next/link";

const hiringSituations = [
  {
    id: "overseas-sourcing",
    stage: "Before you source",
    title: "The role is not filling locally. Is overseas recruitment the right next step?",
    situation: "A vacancy has been open longer than expected. Applicants are scarce or do not meet the criteria, and the team suggests looking abroad. The first task is to understand what is limiting the search: candidate supply, eligibility, the offer, the role criteria or a combination of these.",
    checks: [
      "Separate essential requirements from preferences. Examine applicant evidence alongside pay, shifts, location and working conditions.",
      "Assess which markets could offer relevant skills and candidate interest, and what eligibility or qualification requirements the route would involve.",
      "Test the timing and cost assumptions before committing sourcing effort. Consider what would make a market unsuitable for this role.",
    ],
    help: "Sufoniq connects your hiring brief with labour-market context and route requirements. We help distinguish a plausible sourcing option from an assumption, identify what still needs testing and bring the employment offer into the assessment. Wider sourcing does not remove problems with employment terms or working conditions.",
    outputs: [
      "A written requirement separating must-haves from preferences.",
      "Candidate markets to assess, with the reasoning, route requirements and open questions for each.",
      "An initial view of timing dependencies and cost assumptions to verify.",
    ],
    takeaway: "A market statistic is a reason to investigate. It is not evidence that suitable candidates are available or willing to take your role.",
    action: "Discuss a hard-to-fill role",
  },
  {
    id: "candidate-start-date",
    stage: "Before the offer",
    title: "You have found the candidate. What needs to happen before they can start?",
    situation: "You have identified someone overseas for a role that is hard to fill locally. The team wants to move forward, and a start date is being discussed alongside shifts, accommodation or a client delivery. Finding the right person does not yet establish when they can lawfully start this job.",
    checks: [
      "Establish the candidate’s current position: existing right to work, a route still to be identified, an application in progress or a decision requiring further checks.",
      "Map the documents, qualification checks and other requirements that could affect the start. Record who owns each step and what it depends on.",
      "Separate the target date from confirmed milestones. Identify what has already been promised and agree a fallback if a dependency slips.",
    ],
    help: "Within the agreed scope, Sufoniq maps the route for the role and destination, reviews document requirements and coordinates handoffs across your team, the candidate and relevant partners. We make pending checks and blocked steps visible so your team can assess the start date against the route.",
    outputs: [
      "An assessment of the requirements and unresolved checks for the role and destination.",
      "A document checklist and sequence with named responsibilities and dependencies.",
      "A status view of completed, pending and blocked steps.",
    ],
    takeaway: "Treat the start date as a plan supported by verified milestones, rather than a promise based on the candidate’s availability alone.",
    action: "Discuss a candidate’s start date",
  },
  {
    id: "qualification-requirements",
    stage: "Before treating a candidate as ready",
    title: "The candidate is qualified at home. What does the destination require?",
    situation: "An experienced candidate holds a licence, certificate or professional qualification from their home country. Before treating them as ready to start, the employer needs to establish how that evidence meets the requirements of the particular role and destination.",
    checks: [
      "Check whether the occupation is regulated at the destination and which recognition, registration or licensing process applies to this candidate.",
      "Identify the relevant competent body, the documents it requires and any conditions that still need to be met. Recognition routes differ by profession, destination and qualification.",
      "Map any translation, assessment, training or renewal steps, including costs and responsibilities. Establish which can proceed alongside the rest of the hiring route.",
    ],
    help: "Within the agreed scope, Sufoniq identifies where qualification requirements enter the route, helps map documents and responsibilities, and makes timing dependencies visible. We coordinate the relevant checks with your team and partners; recognition and licensing decisions remain with the competent bodies.",
    outputs: [
      "A role-and-destination requirements note identifying the recognition or registration questions to resolve.",
      "A checklist of relevant documents, steps and responsibilities.",
      "The qualification-related dependencies to include in the hiring timeline.",
    ],
    takeaway: "Experience, documentary evidence and permission to practise are different questions. Establish what applies to this candidate before treating the qualification as sufficient.",
    action: "Discuss qualification requirements",
  },
] as const;

const primaryAction = "inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-5 py-3 text-center text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700 sm:w-auto";
const textLink = "font-semibold text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4";

export default function HiringInPracticeContent() {
  return (
    <main className="w-full bg-[var(--background)] text-[var(--foreground)]">
      <div className="structural-grid-band">
        <div className="mx-auto max-w-5xl space-y-12 px-5 py-14">
          <header className="max-w-3xl space-y-4">
            <p className="sufoniq-meta-label">Hiring in Practice</p>
            <h1 className="text-3xl font-semibold md:text-4xl">Three decisions before you commit to a cross-border hire</h1>
            <p className="text-base sufoniq-body-text">A role is hard to fill locally. Before you commit to sourcing abroad or a start date, three questions matter: can the role be filled from another market, can the candidate lawfully start, and do their qualifications meet the destination’s requirements?</p>
            <p className="text-sm sufoniq-body-text">These are connected checks, not a fixed sequence. A qualification requirement can change the sourcing plan, and a candidate’s circumstances can change the route. Start with the question you already face and revisit the others as evidence develops.</p>
          </header>

          <nav aria-label="On this page" className="flex flex-col items-start gap-1 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:py-2">
            <a href="#overseas-sourcing" className={textLink}>1. Overseas sourcing</a>
            <a href="#candidate-start-date" className={textLink}>2. Candidate eligibility and start dates</a>
            <a href="#qualification-requirements" className={textLink}>3. Qualification requirements</a>
          </nav>

          <div className="space-y-10">
            {hiringSituations.map((study, index) => (
              <article key={study.id} id={study.id} aria-labelledby={study.id + "-title"} className="scroll-mt-24 space-y-6 rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[0_15px_35px_rgba(15,23,42,0.08)] md:p-8">
                <header className="space-y-3">
                  <p className="sufoniq-meta-label">{String(index + 1).padStart(2, "0")} · {study.stage}</p>
                  <h2 id={study.id + "-title"} className="text-2xl font-semibold">{study.title}</h2>
                </header>
                <section aria-labelledby={study.id + "-situation"} className="space-y-2">
                  <h3 id={study.id + "-situation"} className="text-base font-semibold">The situation</h3>
                  <p className="text-sm sufoniq-body-text">{study.situation}</p>
                </section>
                <section aria-labelledby={study.id + "-assess"} className="space-y-3">
                  <h3 id={study.id + "-assess"} className="text-base font-semibold">What we assess</h3>
                  <ul className="list-disc space-y-3 pl-5 text-sm sufoniq-body-text">{study.checks.map(check => <li key={check}>{check}</li>)}</ul>
                </section>
                <section aria-labelledby={study.id + "-support"} className="space-y-2">
                  <h3 id={study.id + "-support"} className="text-base font-semibold">How Sufoniq helps</h3>
                  <p className="text-sm sufoniq-body-text">{study.help}</p>
                </section>
                <section aria-labelledby={study.id + "-deliverables"} className="space-y-3 rounded-2xl border border-[var(--card-border)] bg-[var(--background)] p-5">
                  <h3 id={study.id + "-deliverables"} className="text-base font-semibold">What you receive</h3>
                  <p className="text-sm sufoniq-body-text">Within the agreed scope, deliverables can include:</p>
                  <ul className="list-disc space-y-2 pl-5 text-sm sufoniq-body-text">{study.outputs.map(output => <li key={output}>{output}</li>)}</ul>
                </section>
                <p className="border-l-2 border-sky-600 pl-4 text-sm sufoniq-body-text"><strong className="font-semibold text-[var(--foreground)]">The takeaway: </strong>{study.takeaway}</p>
                <Link prefetch={false} href="/#contact" className={primaryAction}>{study.action}<span aria-hidden="true" className="ml-2">→</span></Link>
              </article>
            ))}
          </div>

          <section aria-labelledby="published-route-title" className="sufoniq-card space-y-4">
            <p className="sufoniq-meta-label">A route in detail</p>
            <h2 id="published-route-title" className="text-2xl font-semibold">Ghana to Lithuania: truck driver mobility</h2>
            <p className="text-sm sufoniq-body-text">Our published route guide brings employer matching, work and residence permit steps, documentation and driver qualification requirements into one view. It shows why the sequence matters and which responsibilities need to be clear.</p>
            <p className="text-sm sufoniq-body-text">Requirements and timing need to be checked for the specific candidate and current route. This guide does not establish a start date for another hire.</p>
            <Link prefetch={false} href="/ghana-tde" className={textLink}>See the Ghana → Lithuania route</Link>
          </section>

          <section aria-labelledby="market-context-title" className="space-y-4">
            <h2 id="market-context-title" className="text-2xl font-semibold">A market figure tells you where to look.</h2>
            <p className="max-w-3xl text-sm sufoniq-body-text">Economic and labour-market figures can inform a sourcing question. They do not establish whether a particular candidate can take your job. Check what a figure measures, its reference year and its relevance to your role, location and start date.</p>
            <Link prefetch={false} href="/insights/frameworks/cross-border-hiring-decisions" className={textLink}>How the three hiring decisions connect →</Link>
          </section>

          <section aria-labelledby="scope-title" className="space-y-3 border-t border-[var(--card-border)] pt-8">
            <h2 id="scope-title" className="text-lg font-semibold">Scope and responsibilities</h2>
            <p className="max-w-3xl text-sm sufoniq-body-text">We agree the service scope and responsibilities before substantive work begins. Your team retains the hiring decision; permit, recognition and licensing decisions remain with the relevant authorities or competent bodies. Support does not guarantee a job, permit or start date.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <Link prefetch={false} href="/method-trust" className={textLink}>Read our method and boundaries</Link>
              <a href="https://europa.eu/youreurope/citizens/work/professional-qualifications/regulated-professions/" target="_blank" rel="noopener noreferrer" className={textLink}>EU qualification recognition guidance ↗</a>
            </div>
          </section>

          <section aria-labelledby="discuss-role-title" className="sufoniq-card space-y-4">
            <h2 id="discuss-role-title" className="text-3xl font-semibold">Bring us one role.</h2>
            <p className="max-w-3xl text-base sufoniq-body-text">Start with a role that is hard to fill or a candidate whose start date is uncertain. Share the role, destination, timing and known obstacle. We will review the requirement and discuss whether our support fits, what needs checking and the scope of the next step.</p>
            <div className="flex flex-wrap items-center gap-5">
              <Link prefetch={false} href="/#contact" className={primaryAction}>Discuss a role <span aria-hidden="true" className="ml-2">→</span></Link>
              <Link prefetch={false} href="/method-trust" className={textLink}>See how we work</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
