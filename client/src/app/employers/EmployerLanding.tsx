import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import WorkforceEnquiryForm from "@/components/WorkforceEnquiryForm";
import { situations } from "./situations";
import { recruitmentPages } from "./recruitment-pages";
import styles from "./EmployerLanding.module.css";

const action = "inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const textLink = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export default function EmployerLanding() {
  return (
    <main className={`${styles.page} bg-background text-foreground`}>
      <header id="overview" className={`${styles.hero} mx-auto max-w-6xl px-6 pb-12 pt-12 md:px-8 md:pb-16 md:pt-20`}>
        <p className="sufoniq-meta-label">For European employers</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Meet candidates screened for your role.</h1>
        <p className="mt-6 max-w-2xl text-lg sufoniq-body-text">Tell us who you need to hire. We source candidates, screen them against your requirements and confirm their interest and availability, so your team can focus on relevant interviews.</p>
        <p className="mt-4 max-w-2xl sufoniq-body-text">For international hires, we connect the search with the document, permit and qualification steps needed before work can start.</p>
        <div className="mt-8 flex flex-wrap items-center gap-5"><a href="#employer-enquiry" className={action}>Discuss your vacancy <ArrowRight size={18} aria-hidden="true" /></a><a href="#candidate-start-date" className={textLink}>Already have a candidate? ↓</a></div>
      </header>

      <section id="situations" aria-labelledby="situations-title" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-12 md:px-8 md:pb-16">
        <span id="problem" className="scroll-mt-24" />
        <h2 id="situations-title" className="text-2xl font-semibold tracking-tight md:text-3xl">Where do you need help with the hire?</h2>
        <nav aria-label="Choose the support you need" className="mt-6 grid gap-4 md:grid-cols-3">
          {situations.map((item, index) => <a key={item.id} href={`#${item.id}`} className={`${styles.choiceCard} group rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}><span className="text-xs text-muted-foreground">0{index + 1}</span><span className="mt-3 flex items-center justify-between gap-4 text-base font-semibold">{item.label}<ArrowRight size={17} className="shrink-0" aria-hidden="true" /></span><p className="mt-2 text-sm sufoniq-body-text">{item.intro}</p></a>)}
        </nav>
      </section>

      <div className="border-y border-[color:var(--card-border)] bg-[color:var(--card)]">
        <div className="mx-auto max-w-6xl divide-y divide-[color:var(--card-border)] px-6 md:px-8">
          {situations.map((item, index) => <section key={item.id} id={item.id} aria-labelledby={`${item.id}-title`} className="scroll-mt-24 py-12 md:py-16">
            <div className={`${styles.detailGrid} grid gap-7 lg:grid-cols-[1.1fr_1fr] lg:gap-14`}>
              <div className={styles.serviceIntro}><p className="sufoniq-meta-label">0{index + 1} · {item.label}</p><h2 id={`${item.id}-title`} className="mt-4 max-w-xl text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{item.title}</h2><p className="mt-5 max-w-xl sufoniq-body-text">{item.help}</p><a href="#employer-enquiry" className={`${textLink} mt-5`}>{item.cta}<ArrowRight size={16} aria-hidden="true" /></a></div>
              <div className={`${styles.deliverables} rounded-2xl border border-[color:var(--card-border)] bg-background p-6`}><h3 className="text-base font-semibold">What you receive</h3><ul className="mt-4 space-y-4">{item.outputs.map(output => <li key={output} className="flex items-start gap-3 text-sm sufoniq-body-text"><CheckCircle2 size={17} className="mt-1 shrink-0 text-sky-700" aria-hidden="true" /><span>{output}</span></li>)}</ul><details className={`${styles.disclosure} mt-6 border-t border-[color:var(--card-border)] pt-4`}><summary className="cursor-pointer text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><span>{item.detailLabel}</span><ChevronDown size={18} aria-hidden="true" /></summary><p className="mt-3 text-sm sufoniq-body-text">{item.detail}</p></details></div>
            </div>
          </section>)}
        </div>
      </div>

      <section aria-labelledby="coverage-title" className={`${styles.coverage} mx-auto max-w-6xl px-6 md:px-8`}>
        <div className={styles.coverageIntro}>
          <h2 id="coverage-title">Recruitment for your sector</h2>
          <p>Our focus includes skilled trades, professional drivers, hospitality and industrial work. Hiring for another role? <a href="#employer-enquiry">Discuss your requirement.</a></p>
        </div>
        <nav aria-label="Specialist recruitment services">
          <ul className={styles.recruitmentPages}>
            {recruitmentPages.map(page => (
              <li key={page.id}>
                <Link href={page.href} className={styles.recruitmentCard} aria-labelledby={`recruitment-${page.id}`}>
                  <span className={styles.recruitmentScope}>{page.scope}</span>
                  <div className={styles.recruitmentHeading}><h3 id={`recruitment-${page.id}`}>{page.title}</h3><ArrowRight size={18} aria-hidden="true" /></div>
                  <p>{page.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section id="engagement" aria-labelledby="working-title" className={`${styles.engagement} mx-auto max-w-6xl scroll-mt-24 px-6 py-12 md:px-8 md:py-16`}>
        <span id="pipeline" className="scroll-mt-24" /><span id="tradeoffs" className="scroll-mt-24" />
        <div className={`${styles.workingGrid} grid gap-8 lg:grid-cols-2 lg:gap-14`}><div><p className="sufoniq-meta-label">Working together</p><h2 id="working-title" className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">Work alongside your existing team.</h2><p className="mt-5 sufoniq-body-text">Bring us in for the search, screening or preparation your team needs help with. We can work alongside your internal team or existing recruiter, while you keep the hiring decision.</p><p className="mt-4 text-sm sufoniq-body-text">Sufoniq is operated by UAB Skillaxis: headquarters in Vilnius, management in Vienna, recruitment and operations in the Czech Republic.</p><Link href="/about" className={`${textLink} mt-3`}>About Sufoniq →</Link></div>
          <div className={styles.process}><h3 className="text-lg font-semibold">From first conversation to agreed work</h3><ol className={`${styles.steps} mt-5 space-y-5`}>{[["Talk through the hire", "Share the vacancy or candidate situation, the terms and the difficulty you need resolved."], ["Review a proposal", "See the proposed work, what you will receive, who handles each step and the fees."], ["Decide how to proceed", "Choose whether to proceed. Paid work begins after the scope and commercial terms are agreed in writing."]].map(([title, body], index) => <li key={title} className="flex gap-4"><span className="text-sm font-semibold text-sky-700">0{index + 1}</span><div><h4 className="text-sm font-semibold">{title}</h4><p className="mt-1 text-sm sufoniq-body-text">{body}</p></div></li>)}</ol></div></div>
      </section>

      <section id="employer-enquiry" aria-labelledby="enquiry-title" className={`${styles.contact} scroll-mt-24 border-y border-[color:var(--card-border)] bg-[color:var(--card)]`}>
        <span id="access" className="scroll-mt-24" />
        <div className={`${styles.contactGrid} mx-auto grid max-w-6xl items-start gap-8 px-6 py-12 md:px-8 md:py-16 lg:grid-cols-2 lg:gap-14`}><div><p className="sufoniq-meta-label">Start with your requirement</p><h2 id="enquiry-title" className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Tell us what is holding the hire back.</h2><p className="mt-5 max-w-xl sufoniq-body-text">Tell us the role, work location and preferred timing, or the question about a candidate you have already selected. A few lines are enough to begin.</p><p className="mt-4 text-sm sufoniq-body-text">We’ll discuss the hiring problem and the work we could take on. If there’s a fit, we’ll send a proposal for you to consider.</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-2"><a href="mailto:support@sufoniq.com" className={textLink}>Email us</a><a href="https://wa.me/420778604430?text=Hello%20Sufoniq%2C%20I%27d%20like%20to%20discuss%20a%20hiring%20requirement." className={textLink} target="_blank" rel="noopener noreferrer">Message on WhatsApp ↗</a></div></div><WorkforceEnquiryForm source="Employers / Enquiry" title="Tell us about your hire" introduction="A vacancy or a question about an existing candidate is enough to begin." contextLabel="What do you need help with?" placeholder="For example: we need three people for our site in Germany by September. We have not found suitable candidates locally." help="Include the role, work location and preferred timing. Please leave out candidate names, document scans and sensitive personal details." submitLabel="Send our hiring enquiry" /></div>
      </section>

      <section id="boundaries" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-10 md:px-8">
        <span id="compliance" className="scroll-mt-24" /><span id="signals" className="scroll-mt-24" />
        <details className={`${styles.disclosure} border-b border-[color:var(--card-border)] pb-5`}><summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><span>Responsibilities and further reading</span><ChevronDown size={18} aria-hidden="true" /></summary><p className="mt-4 max-w-3xl text-sm sufoniq-body-text">Your business decides whom to hire. Authorities and competent bodies decide permit, recognition and licensing applications. We coordinate the preparation agreed with you; the start date depends on the required approvals.</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2"><Link href="/method-trust" className={textLink}>Our method and responsibilities →</Link><a href="https://europa.eu/youreurope/citizens/work/professional-qualifications/regulated-professions/" target="_blank" rel="noopener noreferrer" className={textLink}>EU qualification recognition guidance ↗</a></div></details>
      </section>
    </main>
  );
}
