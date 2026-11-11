import {contactHref} from "@/lib/i18n/shared";
import { getTranslator } from '@/lib/i18n/server';
import type { Locale } from '@/lib/i18n/shared';
import { breadcrumbSchema } from "@/lib/structured-data";
import Link from "@/components/LocalizedLink";
import { ArrowRight, CheckCircle2, Sprout, CalendarDays, ClipboardCheck } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import WorkforceEnquiryForm from "@/components/WorkforceEnquiryForm";

const title = "Agricultural Recruitment in Austria | Sufoniq";
const description = "Recruit seasonal workers for your Austrian farm, orchard or greenhouse. Sufoniq sources and screens candidates and coordinates agreed employment preparation.";
const pageUrl = `${SITE_URL}/austria-seasonal-workers`;


const primary = "inline-flex max-w-full min-h-12 items-center justify-center gap-3 rounded-2xl bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const link = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const officialRoute = "https://www.migration.gv.at/en/types-of-immigration/fixed-term-employment/seasonal-workers/";
const ams = "https://www.ams.at/unternehmen/service-zur-personalsuche/beschaeftigung-auslaendischer-arbeitskraefte/beschaeftigung-auslaendischer-saison-arbeitskraefte";

const faqs = [
  ["Can we enquire at short notice?", "Yes. Tell us the work, headcount and date you need people. We can begin sourcing at short notice and will confirm candidate availability against your requirement. The earliest lawful start also depends on employment permission, visa arrangements and the readiness of the employer and worker documents."],
  ["What work can we discuss?", "Seasonal agricultural work such as fruit harvesting, vineyard tasks, greenhouse work and field work. Explain the tasks, equipment, working conditions and experience you need so screening reflects the actual job. Activities such as packing need to be checked against the employer’s business and applicable route."],
  ["Are these workers coming from abroad?", "Yes. This service sources international candidates for Austrian agricultural employers. We discuss the source market and relevant experience against your requirement. Employment permission and the appropriate visa are part of the preparation before work starts."],
  ["What does the employer need to provide?", "The work location, jobs, headcount, employment dates, pay and conditions, plus accommodation arrangements. The Austrian employer applies to AMS for the employment permit. We agree the recruitment and preparation work and who handles each action before delivery."],
  ["What does it cost?", "We quote for the agreed sourcing, screening and coordination work. The proposal identifies service fees, responsibilities and how official or third-party costs are allocated. Sufoniq does not charge workers recruitment fees."],
  ["Does seasonal work require a visa?", "The route can require both AMS employment permission and a visa. Austria’s guidance distinguishes visa C for short seasonal stays from visa D where employment or the stay exceeds 90 days. The worker applies personally through the competent Austrian representation. We establish the applicable steps for the specific assignment."],
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbSchema("/austria-seasonal-workers", "Seasonal agricultural recruitment in Austria", [{ name: "For employers", path: "/employers" }]),
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sufoniq",
      legalName: "UAB Skillaxis",
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Sufoniq",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage", breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${pageUrl}#service` },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Seasonal agricultural recruitment for Austrian employers",
      serviceType: "Seasonal agricultural recruitment and preparation coordination",
      description: "International candidate sourcing, screening and agreed preparation coordination for seasonal agricultural employment in Austria.",
      url: pageUrl,
      mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Austria" },
      audience: { "@type": "BusinessAudience", audienceType: "Austrian agricultural employers" },
    },
  ],
};

export default function AustriaSeasonalWorkersPage({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <main className="sufoniq-page bg-background text-foreground">
      {locale === "en" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />}
      <header className="grid grid-cols-1 sufoniq-container items-start gap-10 py-12 md:py-16 lg:grid-cols-[1.3fr_0.8fr] lg:gap-14">
        <div><p className="sufoniq-meta-label">{t("For Austrian agricultural employers")}</p><h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{t("Need seasonal workers for your farm in Austria?")}</h1><p className="mt-6 max-w-2xl text-lg sufoniq-body-text">{t("When harvest dates are set, an unfilled shift becomes your problem. Sufoniq sources workers from abroad for farms, orchards, vineyards and greenhouses, screens them against your requirements, and coordinates the preparation for employment in Austria.")}</p><div className="mt-8 flex flex-wrap items-center gap-5"><a href="#seasonal-enquiry" className={primary}>{t("Tell us your staffing needs ")}<ArrowRight size={18} aria-hidden="true" /></a><a href="#how-it-works" className={link}>{t("How it works ↓")}</a></div><p className="mt-5 text-sm sufoniq-body-text">{t("Need people soon? Short-notice requests are welcome. We’ll check candidate availability and the permissions needed against your dates.")}</p></div>
        <aside className="rounded-3xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-6 sm:p-7" aria-labelledby="brief-title"><Sprout className="h-7 w-7 text-sky-700" aria-hidden="true" /><h2 id="brief-title" className="mt-5 text-xl font-semibold">{t("Tell us what your season needs.")}</h2><ul className="mt-5 space-y-4 text-sm sufoniq-body-text">{["How many people do you need?", "What work will they do, and where?", "When does the assignment start and end?", "What accommodation can you provide?"].map(item => <li key={t(item)} className="flex gap-3"><CheckCircle2 size={17} className="mt-1 shrink-0 text-sky-700" aria-hidden="true" /><span>{t(item)}</span></li>)}</ul><p className="mt-6 border-t border-[color:var(--card-border)] pt-4 text-sm sufoniq-body-text">{t("Your first conversation covers candidate availability, what needs preparing and the next practical step. You can decide whether to take it further.")}</p></aside>
      </header>

      <section aria-labelledby="delivery-title" className="sufoniq-container border-t border-[color:var(--card-border)] py-12 md:py-16">
        <p className="sufoniq-meta-label">{t("Recruitment built around the actual work")}</p><h2 id="delivery-title" className="sufoniq-section-title mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight">{t("A candidate’s availability is only part of a seasonal hire.")}</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[[Sprout, "Screened for your work", "Harvesting, greenhouse tasks or vineyard work: tell us what the job involves. We screen for the experience and language you need, explain the conditions, and confirm candidate interest and availability."], [ClipboardCheck, "Know what is ready", "You need to know which documents are ready, which checks are outstanding and who handles each application step. We coordinate the agreed preparation with you and the candidates."], [CalendarDays, "Plan around your start date", "An interested candidate still needs permission to work. We track availability and preparation against your dates, with outstanding approvals made clear before you plan the start."]].map(([Icon, heading, body]) => {
            const DisplayIcon = Icon as typeof Sprout;
            return <article key={t(heading as string)} className="sufoniq-card"><DisplayIcon size={23} className="text-sky-700" aria-hidden="true" /><h3 className="mt-5 text-lg font-semibold">{t(heading as string)}</h3><p className="mt-3 text-sm sufoniq-body-text">{t(body as string)}</p></article>;
          })}
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="process-title" className="scroll-mt-24 border-y border-[color:var(--card-border)] bg-[color:var(--card)]">
        <div className="sufoniq-container py-12 md:py-16"><p className="sufoniq-meta-label">{t("How we work together")}</p><h2 id="process-title" className="sufoniq-section-title mt-4 text-3xl font-semibold tracking-tight">{t("From your staffing brief to screened candidates.")}</h2><ol className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{[["Define the assignment", "Work, pay, hours, location, dates and accommodation form the brief."], ["Agree delivery", "Before paid work begins, agree the sourcing and screening work, responsibilities and fees in writing."], ["Meet screened candidates", "Review candidates against your requirements, with interest, availability and outstanding checks recorded."], ["Coordinate preparation", "Coordinate the agreed documents and application steps with you and the workers. Required permissions must be in place before travel and employment." ]].map(([heading, body], index) => <li key={t(heading)} className="border-t border-[color:var(--card-border)] pt-5"><span className="text-sm font-semibold text-sky-700">0{index + 1}</span><h3 className="mt-3 text-base font-semibold">{t(heading)}</h3><p className="mt-2 text-sm sufoniq-body-text">{t(body)}</p></li>)}</ol><p className="mt-8 max-w-3xl text-sm sufoniq-body-text">{t("Your business employs the workers directly and makes the hiring decision. Sufoniq provides the recruitment and coordination work agreed for the assignment.")}</p></div>
      </section>

      <section aria-labelledby="questions-title" className="grid sufoniq-container gap-8 py-12 md:py-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14"><div><p className="sufoniq-meta-label">{t("Before you enquire")}</p><h2 id="questions-title" className="sufoniq-section-title mt-4 text-3xl font-semibold tracking-tight">{t("Practical answers for your season.")}</h2><p className="mt-5 text-sm sufoniq-body-text">{t("Sufoniq is operated by UAB Skillaxis, with management in Vienna and recruitment and operations in the Czech Republic.")}</p><Link locale={locale} href="/about" className={`${link} mt-3`}>{t("About Sufoniq →")}</Link></div><div className="divide-y divide-[color:var(--card-border)] border-y border-[color:var(--card-border)]">{faqs.map(([question, answer]) => <details key={t(question)} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-1 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">{t(question)}<span aria-hidden="true" className="text-xl font-normal text-sky-700 group-open:rotate-45">+</span></summary><p className="mt-3 pb-2 text-sm sufoniq-body-text">{t(answer)}</p></details>)}</div></section>

      <section id="seasonal-enquiry" aria-labelledby="enquiry-title" className="scroll-mt-24 border-y border-[color:var(--card-border)] bg-[color:var(--card)]"><div className="grid sufoniq-container items-start gap-8 py-12 md:py-16 lg:grid-cols-2 lg:gap-14"><div><p className="sufoniq-meta-label">{t("Start with a short conversation")}</p><h2 id="enquiry-title" className="sufoniq-section-title mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{t("Tell us your tasks, headcount and dates.")}</h2><p className="mt-5 max-w-xl sufoniq-body-text">{t("Send a short outline of your staffing needs. We’ll discuss candidate availability, the preparation needed for your dates and what Sufoniq would handle. If there’s a fit, we’ll set out the proposed work and costs for you to consider.")}</p><p className="mt-4 text-sm sufoniq-body-text">{t("You don’t need a finished recruitment brief or worker documents to get in touch.")}</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-2"><a href={contactHref("mailto:support@sufoniq.com?subject=Austria%20seasonal%20agricultural%20workers",locale,t)} className={link}>{t("Email your requirement")}</a><a href={contactHref("https://wa.me/420778604430?text=Hello%20Sufoniq%2C%20we%20need%20seasonal%20agricultural%20workers%20in%20Austria.%20I%27d%20like%20to%20discuss%20our%20headcount%20and%20dates.",locale,t)} target="_blank" rel="noopener noreferrer" className={link}>{t("Message on WhatsApp ↗")}</a></div></div><WorkforceEnquiryForm source="Austria / Seasonal agricultural workforce" title={t("Tell us about your season")} introduction={t("A few lines are enough. We’ll follow up about your staffing needs and next steps.")} contextLabel={t("What seasonal workforce do you need?")} placeholder={t("For example: 8 people for fruit harvesting in Styria, from June to September. Accommodation is available. We’d like to discuss sourcing and preparation.")} help={t("Include the tasks, headcount, location and employment dates. Please leave out worker names, passport numbers and document scans.")} submitLabel={t("Send our staffing enquiry")} /></div></section>

      <section className="sufoniq-container py-10 "><details className="border-b border-[color:var(--card-border)] pb-5"><summary className="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{t("Seasonal permissions, responsibilities and official sources")}</summary><p className="mt-4 max-w-3xl text-sm sufoniq-body-text">{t("For the ordinary seasonal quota route, the employer applies to AMS. Quota availability, the labour-market check, employment conditions and accommodation matter. The worker then follows the applicable visa process. Authorities decide applications; recruitment availability does not establish a lawful start date.")}</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2"><a href={officialRoute} target="_blank" rel="noopener noreferrer" className={link}>{t("Austria’s seasonal-worker guidance ↗")}</a><a href={ams} target="_blank" rel="noopener noreferrer" className={link}>{t("AMS employer guidance ↗")}</a><Link locale={locale} href="/employers" className={link}>{t("Other recruitment requirements →")}</Link></div><p className="mt-3 text-xs text-muted-foreground">{t("Official guidance checked 9 November 2026. Requirements are established for the particular employer, worker and assignment.")}</p></details></section>
    </main>
  );
}
