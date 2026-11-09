import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import WorkforceEnquiryForm from "@/components/WorkforceEnquiryForm";
import { situations } from "./situations";

const action = "inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const textLink = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export default function EmployerLanding() {
  return (
    <main className="bg-background text-foreground">
      <header id="overview" className="mx-auto max-w-6xl px-6 pb-12 pt-12 md:px-8 md:pb-16 md:pt-20">
        <p className="sufoniq-meta-label">For European employers</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Meet candidates screened for your role.</h1>
        <p className="mt-6 max-w-2xl text-lg sufoniq-body-text">Give us the vacancy you’re struggling to fill. We source candidates, screen against your agreed requirements and confirm their interest and availability—so your team has a relevant shortlist to interview.</p>
        <p className="mt-4 max-w-2xl sufoniq-body-text">For cross-border hires, we also coordinate the agreed document, permit and qualification steps. The search and preparation for starting work stay connected.</p>
        <div className="mt-8 flex flex-wrap items-center gap-5"><a href="#employer-enquiry" className={action}>Discuss your vacancy <ArrowRight size={18} aria-hidden="true" /></a><a href="#situations" className={textLink}>Already have a candidate? Explore support ↓</a></div>
        <p className="mt-5 text-sm text-muted-foreground">Start with one role. We agree the work, responsibilities and fees before delivery begins.</p>
        <div className="mt-10 grid gap-6 border-t border-[color:var(--card-border)] pt-6 md:grid-cols-3">
          <div><h2 className="text-base font-semibold">Screened against your brief</h2><p className="mt-2 text-sm sufoniq-body-text">Skills, experience and language considered against the actual job.</p></div>
          <div><h2 className="text-base font-semibold">Interest and availability confirmed</h2><p className="mt-2 text-sm sufoniq-body-text">A conversation about your role, terms and timing before an introduction.</p></div>
          <div><h2 className="text-base font-semibold">Checks made explicit</h2><p className="mt-2 text-sm sufoniq-body-text">See what has been checked, the evidence recorded and what still needs resolving.</p></div>
        </div>
      </header>

      <section id="situations" aria-labelledby="situations-title" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-12 md:px-8 md:pb-16">
        <span id="problem" className="scroll-mt-24" />
        <h2 id="situations-title" className="text-2xl font-semibold tracking-tight md:text-3xl">Start with the support your hire needs.</h2>
        <nav aria-label="Choose your hiring situation" className="mt-6 grid gap-4 md:grid-cols-3">
          {situations.map((item, index) => <a key={item.id} href={`#${item.id}`} className="group rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><span className="text-xs text-muted-foreground">0{index + 1}</span><span className="mt-3 flex items-center justify-between gap-4 text-base font-semibold">{item.label}<ArrowRight size={17} aria-hidden="true" /></span><p className="mt-2 text-sm sufoniq-body-text">{item.intro}</p></a>)}
        </nav>
        <p className="mt-6 max-w-3xl text-sm sufoniq-body-text">Our focus includes skilled trades, professional drivers, hospitality and industrial work. Hiring for another role? Tell us the requirement.</p>
      </section>

      <div className="border-y border-[color:var(--card-border)] bg-[color:var(--card)]">
        <div className="mx-auto max-w-6xl divide-y divide-[color:var(--card-border)] px-6 md:px-8">
          {situations.map((item, index) => <section key={item.id} id={item.id} aria-labelledby={`${item.id}-title`} className="scroll-mt-24 py-12 md:py-16">
            <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
              <div><p className="sufoniq-meta-label">0{index + 1} · {item.label}</p><h2 id={`${item.id}-title`} className="mt-4 max-w-xl text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{item.title}</h2><p className="mt-5 max-w-xl sufoniq-body-text">{item.help}</p><a href="#employer-enquiry" className={`${textLink} mt-5`}>{item.cta}<ArrowRight size={16} aria-hidden="true" /></a></div>
              <div className="rounded-2xl border border-[color:var(--card-border)] bg-background p-6"><h3 className="text-base font-semibold">What the engagement delivers</h3><ul className="mt-4 space-y-4">{item.outputs.map(output => <li key={output} className="flex items-start gap-3 text-sm sufoniq-body-text"><CheckCircle2 size={17} className="mt-1 shrink-0 text-sky-700" aria-hidden="true" /><span>{output}</span></li>)}</ul><details className="mt-6 border-t border-[color:var(--card-border)] pt-4"><summary className="cursor-pointer text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">How we define the work</summary><p className="mt-3 text-sm sufoniq-body-text">{item.detail}</p></details></div>
            </div>
          </section>)}
        </div>
      </div>

      <section id="engagement" aria-labelledby="working-title" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-12 md:px-8 md:py-16">
        <span id="pipeline" className="scroll-mt-24" /><span id="tradeoffs" className="scroll-mt-24" />
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14"><div><p className="sufoniq-meta-label">Working together</p><h2 id="working-title" className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">Keep your team.<br />Add the support you need.</h2><p className="mt-5 sufoniq-body-text">We can agree sourcing, screening or mobility coordination alongside your internal team or existing recruiter. You retain the hiring decision.</p><p className="mt-4 text-sm sufoniq-body-text">Sufoniq is operated by UAB Skillaxis: headquarters in Vilnius, management in Vienna, recruitment and operations in the Czech Republic.</p><Link href="/about" className={`${textLink} mt-3`}>About Sufoniq →</Link></div>
          <div><h3 className="text-lg font-semibold">From first conversation to agreed work</h3><ol className="mt-5 space-y-5">{[["Talk through the hire", "Share the vacancy or candidate situation, the terms and the difficulty you need resolved."], ["Receive a scoped proposal", "We propose the sourcing, screening or coordination work, its deliverables, responsibilities and fees."], ["Decide how to proceed", "You review the proposal. Delivery begins once the work and commercial terms are agreed in writing."]].map(([title, body], index) => <li key={title} className="flex gap-4"><span className="text-sm font-semibold text-sky-700">0{index + 1}</span><div><h4 className="text-sm font-semibold">{title}</h4><p className="mt-1 text-sm sufoniq-body-text">{body}</p></div></li>)}</ol></div></div>
      </section>

      <section id="employer-enquiry" aria-labelledby="enquiry-title" className="scroll-mt-24 border-y border-[color:var(--card-border)] bg-[color:var(--card)]">
        <span id="access" className="scroll-mt-24" />
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-6 py-12 md:px-8 md:py-16 lg:grid-cols-2 lg:gap-14"><div><p className="sufoniq-meta-label">Start with your requirement</p><h2 id="enquiry-title" className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Tell us what is holding the hire back.</h2><p className="mt-5 max-w-xl sufoniq-body-text">Share the role, work location and preferred timing. If you already have a candidate, describe the question you need help resolving. Leave documents and personal candidate details out of your first message.</p><p className="mt-4 text-sm sufoniq-body-text">The first conversation helps identify how we can contribute and a proposed next action. You do not need a complete hiring plan to begin.</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-2"><a href="mailto:support@sufoniq.com" className={textLink}>Email us</a><a href="https://wa.me/420778604430?text=Hello%20Sufoniq%2C%20I%27d%20like%20to%20discuss%20a%20hiring%20requirement." className={textLink} target="_blank" rel="noopener noreferrer">Message on WhatsApp ↗</a></div></div><WorkforceEnquiryForm source="Employers / Enquiry" /></div>
      </section>

      <section id="boundaries" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-10 md:px-8">
        <span id="compliance" className="scroll-mt-24" /><span id="signals" className="scroll-mt-24" />
        <details className="border-b border-[color:var(--card-border)] pb-5"><summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Responsibilities and further reading</summary><p className="mt-4 max-w-3xl text-sm sufoniq-body-text">We agree the work and responsibilities before delivery. Your team retains the hiring decision; permit, recognition and licensing decisions remain with the relevant authorities or competent bodies. Jobs, permit approvals and start dates are not guaranteed.</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2"><Link href="/method-trust" className={textLink}>Our method and responsibilities →</Link><Link href="/ghana-tde" className={textLink}>Ghana–Lithuania driver route guide →</Link><a href="https://europa.eu/youreurope/citizens/work/professional-qualifications/regulated-professions/" target="_blank" rel="noopener noreferrer" className={textLink}>EU qualification recognition guidance ↗</a></div></details>
      </section>
    </main>
  );
}
