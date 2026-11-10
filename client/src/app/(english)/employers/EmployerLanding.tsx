import {contactHref} from "@/lib/i18n/shared";
import { getTranslator } from '@/lib/i18n/server';
import type { Locale } from '@/lib/i18n/shared';
import Link from "@/components/LocalizedLink";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import WorkforceEnquiryForm from "@/components/WorkforceEnquiryForm";
import { situations } from "./situations";
import { recruitmentPages } from "./recruitment-pages";
import styles from "./EmployerLanding.module.css";

const action = "inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const textLink = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export default function EmployerLanding({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <main className={`${styles.page} sufoniq-page bg-background text-foreground`}>
      <header id="overview" className={`${styles.hero} sufoniq-container pb-12 pt-12 md:pb-16 md:pt-16`}>
        <p className="sufoniq-meta-label">{t("For European employers")}</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{t("Meet candidates screened for your role.")}</h1>
        <p className="mt-6 max-w-2xl text-lg sufoniq-body-text">{t("Tell us who you need to hire. We source candidates, screen them against your requirements and confirm their interest and availability, so your team can focus on relevant interviews.")}</p>
        <p className="mt-4 max-w-2xl sufoniq-body-text">{t("For international hires, we connect the search with the document, permit and qualification steps needed before work can start.")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-5"><a href="#employer-enquiry" className={action}>{t("Discuss your vacancy ")}<ArrowRight size={18} aria-hidden="true" /></a><a href="#candidate-start-date" className={textLink}>{t("Already have a candidate? ↓")}</a></div>
      </header>

      <section id="situations" aria-labelledby="situations-title" className="sufoniq-container scroll-mt-24 pb-12 md:pb-16">
        <span id="problem" className="scroll-mt-24" />
        <h2 id="situations-title" className="sufoniq-section-title text-2xl font-semibold tracking-tight md:text-3xl">{t("Where do you need help with the hire?")}</h2>
        <nav aria-label={t("Choose the support you need")} className="mt-6 grid gap-4 md:grid-cols-3">
          {situations.map((item, index) => <a key={item.id} href={`#${item.id}`} className={`${styles.choiceCard} group rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary`}><span className="text-xs text-muted-foreground">0{index + 1}</span><span className="mt-3 flex items-center justify-between gap-4 text-base font-semibold"><span className="min-w-0 flex-1 hyphens-auto [overflow-wrap:anywhere]">{t(item.label)}</span><ArrowRight size={17} className="shrink-0" aria-hidden="true" /></span><p className="mt-2 text-sm sufoniq-body-text">{t(item.intro)}</p></a>)}
        </nav>
      </section>

      <div className="border-y border-[color:var(--card-border)] bg-[color:var(--card)]">
        <div className="sufoniq-container divide-y divide-[color:var(--card-border)] ">
          {situations.map((item, index) => <section key={item.id} id={item.id} aria-labelledby={`${item.id}-title`} className="scroll-mt-24 py-12 md:py-16">
            <div className={`${styles.detailGrid} grid gap-7 lg:grid-cols-[1.1fr_1fr] lg:gap-14`}>
              <div className={styles.serviceIntro}><p className="sufoniq-meta-label">0{index + 1} · {t(item.label)}</p><h2 id={`${item.id}-title`} className="sufoniq-section-title mt-4 max-w-xl text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{t(item.title)}</h2><p className="mt-5 max-w-xl sufoniq-body-text">{t(item.help)}</p><a href="#employer-enquiry" className={`${textLink} mt-5`}>{t(item.cta)}<ArrowRight size={16} aria-hidden="true" /></a></div>
              <div className={`${styles.deliverables} rounded-2xl border border-[color:var(--card-border)] bg-background p-6`}><h3 className="text-base font-semibold">{t("What you receive")}</h3><ul className="mt-4 space-y-4">{item.outputs.map(output => <li key={t(output)} className="flex items-start gap-3 text-sm sufoniq-body-text"><CheckCircle2 size={17} className="mt-1 shrink-0 text-sky-700" aria-hidden="true" /><span>{t(output)}</span></li>)}</ul><details className={`${styles.disclosure} mt-6 border-t border-[color:var(--card-border)] pt-4`}><summary className="cursor-pointer text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><span>{t(item.detailLabel)}</span><ChevronDown size={18} aria-hidden="true" /></summary><p className="mt-3 text-sm sufoniq-body-text">{t(item.detail)}</p></details></div>
            </div>
          </section>)}
        </div>
      </div>

      <section aria-labelledby="coverage-title" className={`${styles.coverage} sufoniq-container `}>
        <div className={styles.coverageIntro}>
          <h2 id="coverage-title">{t("Recruitment for your sector")}</h2>
          <p>{t("Our focus includes skilled trades, professional drivers, hospitality and industrial work. Hiring for another role? ")}<a href="#employer-enquiry">{t("Discuss your requirement.")}</a></p>
        </div>
        <nav aria-label={t("Specialist recruitment services")}>
          <ul className={styles.recruitmentPages}>
            {recruitmentPages.map(page => (
              <li key={page.id}>
                <Link locale={locale} href={page.href} className={styles.recruitmentCard} aria-labelledby={`recruitment-${page.id}`}>
                  <span className={styles.recruitmentScope}>{t(page.scope)}</span>
                  <div className={styles.recruitmentHeading}><h3 id={`recruitment-${page.id}`}>{t(page.title)}</h3><ArrowRight size={18} aria-hidden="true" /></div>
                  <p>{t(page.description)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section id="engagement" aria-labelledby="working-title" className={`${styles.engagement} sufoniq-container scroll-mt-24 py-12 md:py-16`}>
        <span id="pipeline" className="scroll-mt-24" /><span id="tradeoffs" className="scroll-mt-24" />
        <div className={`${styles.workingGrid} grid gap-8 lg:grid-cols-2 lg:gap-14`}><div><p className="sufoniq-meta-label">{t("Working together")}</p><h2 id="working-title" className="sufoniq-section-title mt-4 text-2xl font-semibold tracking-tight md:text-3xl">{t("Work alongside your existing team.")}</h2><p className="mt-5 sufoniq-body-text">{t("Bring us in for the search, screening or preparation your team needs help with. We can work alongside your internal team or existing recruiter, while you keep the hiring decision.")}</p><p className="mt-4 text-sm sufoniq-body-text">{t("Sufoniq is operated by UAB Skillaxis: headquarters in Vilnius, management in Vienna, recruitment and operations in the Czech Republic.")}</p><Link locale={locale} href="/about" className={`${textLink} mt-3`}>{t("About Sufoniq →")}</Link></div>
          <div className={styles.process}><h3 className="text-lg font-semibold">{t("From first conversation to agreed work")}</h3><ol className={`${styles.steps} mt-5 space-y-5`}>{[["Talk through the hire", "Share the vacancy or candidate situation, the terms and the difficulty you need resolved."], ["Review a proposal", "See the proposed work, what you will receive, who handles each step and the fees."], ["Decide how to proceed", "Choose whether to proceed. Paid work begins after the scope and commercial terms are agreed in writing."]].map(([title, body], index) => <li key={t(title)} className="flex gap-4"><span className="text-sm font-semibold text-sky-700">0{index + 1}</span><div><h4 className="text-sm font-semibold">{t(title)}</h4><p className="mt-1 text-sm sufoniq-body-text">{t(body)}</p></div></li>)}</ol></div></div>
      </section>

      <section id="employer-enquiry" aria-labelledby="enquiry-title" className={`${styles.contact} scroll-mt-24 border-y border-[color:var(--card-border)] bg-[color:var(--card)]`}>
        <span id="access" className="scroll-mt-24" />
        <div className={`${styles.contactGrid} grid sufoniq-container items-start gap-8 py-12 md:py-16 lg:grid-cols-2 lg:gap-14`}><div><p className="sufoniq-meta-label">{t("Start with your requirement")}</p><h2 id="enquiry-title" className="sufoniq-section-title mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{t("Tell us what is holding the hire back.")}</h2><p className="mt-5 max-w-xl sufoniq-body-text">{t("Tell us the role, work location and preferred timing, or the question about a candidate you have already selected. A few lines are enough to begin.")}</p><p className="mt-4 text-sm sufoniq-body-text">{t("We’ll discuss the hiring problem and the work we could take on. If there’s a fit, we’ll send a proposal for you to consider.")}</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-2"><a href={contactHref("mailto:support@sufoniq.com",locale,t)} className={textLink}>{t("Email us")}</a><a href={contactHref("https://wa.me/420778604430?text=Hello%20Sufoniq%2C%20I%27d%20like%20to%20discuss%20a%20hiring%20requirement.",locale,t)} className={textLink} target="_blank" rel="noopener noreferrer">{t("Message on WhatsApp ↗")}</a></div></div><WorkforceEnquiryForm source="Employers / Enquiry" title={t("Tell us about your hire")} introduction={t("A vacancy or a question about an existing candidate is enough to begin.")} contextLabel={t("What do you need help with?")} placeholder={t("For example: we need three people for our site in Germany by September. We have not found suitable candidates locally.")} help={t("Include the role, work location and preferred timing. Please leave out candidate names, document scans and sensitive personal details.")} submitLabel={t("Send our hiring enquiry")} /></div>
      </section>

      <section id="boundaries" className="sufoniq-container scroll-mt-24 py-10 ">
        <span id="compliance" className="scroll-mt-24" /><span id="signals" className="scroll-mt-24" />
        <details className={`${styles.disclosure} border-b border-[color:var(--card-border)] pb-5`}><summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><span>{t("Responsibilities and further reading")}</span><ChevronDown size={18} aria-hidden="true" /></summary><p className="mt-4 max-w-3xl text-sm sufoniq-body-text">{t("Your business decides whom to hire. Authorities and competent bodies decide permit, recognition and licensing applications. We coordinate the preparation agreed with you; the start date depends on the required approvals.")}</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2"><Link locale={locale} href="/method-trust" className={textLink}>{t("Our method and responsibilities →")}</Link><a href="https://europa.eu/youreurope/citizens/work/professional-qualifications/regulated-professions/" target="_blank" rel="noopener noreferrer" className={textLink}>{t("EU qualification recognition guidance ↗")}</a></div></details>
      </section>
    </main>
  );
}
