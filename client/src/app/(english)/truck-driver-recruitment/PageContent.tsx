import {contactHref} from "@/lib/i18n/shared";
import { getTranslator } from '@/lib/i18n/server';
import type { Locale } from '@/lib/i18n/shared';
import { breadcrumbSchema } from "@/lib/structured-data";
import Link from "@/components/LocalizedLink";
import { ArrowRight, CheckCircle2, ChevronDown, Truck } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import DriverEnquiryForm from "./DriverEnquiryForm";
import { faqs, screening, steps } from "./content";
import styles from "./page.module.css";

const title = "Truck Driver Recruitment for Transport Companies | Sufoniq";
const description = "Truck driver recruitment for European transport employers. Source and screen international candidates, with licence and qualification requirements made clear.";
const pageUrl = `${SITE_URL}/truck-driver-recruitment`;

const germany = "https://www.make-it-in-germany.com/en/looking-for-foreign-professionals/entering/admission-labour-market/professional-drivers";
const qualificationRoute = "https://www.make-it-in-germany.com/en/visa-recognition/visa-types/other/professional-drivers";
const euQualifications = "https://eur-lex.europa.eu/eli/dir/2022/2561/oj/eng";
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbSchema("/truck-driver-recruitment", "Truck driver recruitment in Europe", [{ name: "For employers", path: "/employers" }]),
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Sufoniq", legalName: "UAB Skillaxis", url: SITE_URL },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Sufoniq", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` } },
    { "@type": "WebPage", breadcrumb: { "@id": `${pageUrl}#breadcrumb` }, "@id": `${pageUrl}#webpage`, name: title, description, url: pageUrl, inLanguage: "en", isPartOf: { "@id": `${SITE_URL}/#website` }, mainEntity: { "@id": `${pageUrl}#service` }, publisher: { "@id": `${SITE_URL}/#organization` } },
    { "@type": "Service", "@id": `${pageUrl}#service`, name: "Truck driver recruitment for European transport employers", serviceType: "International truck driver sourcing, screening and preparation coordination", description: "Candidate sourcing against fleet requirements, screening and agreed coordination of qualification and employment preparation.", url: pageUrl, mainEntityOfPage: { "@id": `${pageUrl}#webpage` }, provider: { "@id": `${SITE_URL}/#organization` }, areaServed: { "@type": "Place", name: "Europe" }, audience: { "@type": "BusinessAudience", audienceType: "Transport employers recruiting truck drivers" } },
  ],
};

export default function TruckDriverRecruitment({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <main className={`${styles.page} sufoniq-page`}>
      {locale === "en" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />}
      <header className={`${styles.container} ${styles.hero}`}>
        <div>
          <p className={styles.eyebrow}>{t("For European transport employers")}</p>
          <h1>{t("Find experienced truck drivers for your fleet.")}</h1>
          <p className={styles.lead}>{t("An unfilled driver role puts pressure on your routes, schedules and the team covering them. Sufoniq sources and screens international truck drivers for your fleet, with experience, availability and qualification steps made clear before you decide whom to interview.")}</p>
          <div className={styles.actions}><a href="#driver-enquiry" className={styles.primary}>{t("Discuss your driver requirements ")}<ArrowRight size={18} aria-hidden="true" /></a><a href="#screening" className={styles.link}>{t("What screening covers ↓")}</a></div>
        </div>
        <aside className={styles.brief} aria-labelledby="brief-title">
          <div className={styles.briefHeader}><Truck size={28} aria-hidden="true" /><span className={styles.eyebrow}>{t("Built around your driving work")}</span></div>
          <h2 id="brief-title">{t("Start with the fleet you run.")}</h2>
          <ul>{["Vehicle, trailer and freight types", "Routes, location and working pattern", "Language needs and employment terms", "Headcount, timing and qualification support"].map(item => <li key={t(item)}><CheckCircle2 size={17} aria-hidden="true" /><span>{t(item)}</span></li>)}</ul>
          <p>{t("Start with one driver vacancy. We agree the search, checks, responsibilities and fees before paid work begins.")}</p>
        </aside>
      </header>

      <section id="screening" aria-labelledby="screening-title" className={`${styles.container} ${styles.section}`}>
        <div className={styles.sectionIntro}><p className={styles.eyebrow}>{t("Before your interviews")}</p><h2 id="screening-title">{t("Spend your interview time on candidates who fit the work.")}</h2><p>{t("You need more than a licence category on a CV. We screen against the driving work, discuss your terms with candidates and record the questions your team needs answered before hiring.")}</p></div>
        <div className={styles.cards}>{screening.map(item => <article key={t(item.title)} className={styles.card}><h3>{t(item.title)}</h3><p>{t(item.body)}</p></article>)}</div>
      </section>

      <section aria-labelledby="readiness-title" className={styles.band}>
        <div className={`${styles.container} ${styles.section} ${styles.split}`}>
          <div><p className={styles.eyebrow}>{t("Experience and readiness")}</p><h2 id="readiness-title">{t("See what is ready—and what still needs to happen.")}</h2><p className={styles.body}>{t("With each introduction, receive a summary of the driver’s relevant experience, interest in your terms and stated availability, alongside completed and outstanding checks. Your team can see the basis for the introduction and what still needs resolving.")}</p><p className={styles.body}>{t("Full candidate information is shared privately, with consent and current availability confirmed.")}</p></div>
          <div className={styles.readiness}>
            <article><h3>{t("Drivers with the required credentials")}</h3><p>{t("Confirm the relevant licence, professional qualification, current validity and right to work for the destination before agreeing a driving start.")}</p></article>
            <article><h3>{t("Drivers who need qualification steps")}</h3><p>{t("Identify what must be completed, who will provide training and whether your business can support the preparation. Freight experience alone does not establish permission to drive professionally.")}</p></article>
          </div>
        </div>
      </section>

      <section id="driver-process" aria-labelledby="process-title" className={`${styles.container} ${styles.section}`}>
        <div className={styles.sectionIntro}><p className={styles.eyebrow}>{t("Working together")}</p><h2 id="process-title">{t("From your driver brief to a candidate introduction.")}</h2></div>
        <ol className={styles.steps}>{steps.map(([heading, body], index) => <li key={t(heading)}><span className={styles.number}>0{index + 1}</span><h3>{t(heading)}</h3><p>{t(body)}</p></li>)}</ol>
        <details className={`${styles.disclosure} ${styles.route}`}><summary><span>{t("Germany: an employer-supported qualification route")}</span><ChevronDown size={18} aria-hidden="true" /></summary><div><p>{t("For eligible non-EU drivers who need German licensing or professional qualification, an employer-supported route may combine qualification measures with other permitted work. It requires employment approval, a relevant existing foreign licence and a driving job with the same employer after qualification. The qualifying conditions and training arrangements must be confirmed for the individual case.")}</p><p>{t("During this qualification period, the person cannot work as a professional driver. This is a German route, not an EU-wide permission.")}</p><a href={germany} target="_blank" rel="noopener noreferrer" className={styles.link}>{t("Official guidance for German employers ↗")}</a></div></details>
      </section>

      <section aria-labelledby="faq-title" className={`${styles.container} ${styles.section} ${styles.faqGrid}`}>
        <div><p className={styles.eyebrow}>{t("Before you enquire")}</p><h2 id="faq-title">{t("Practical questions about your next driver hire.")}</h2><p className={styles.body}>{t("Sufoniq is operated by UAB Skillaxis, with management in Vienna and recruitment and operations in the Czech Republic.")}</p><Link locale={locale} href="/about" className={styles.link}>{t("About Sufoniq ")}<ArrowRight size={16} aria-hidden="true" /></Link></div>
        <div className={styles.faqs}>{faqs.map(([question, answer]) => <details key={t(question)} className={styles.disclosure}><summary><span>{t(question)}</span><ChevronDown size={18} aria-hidden="true" /></summary><div><p>{t(answer)}</p></div></details>)}</div>
      </section>

      <section id="driver-enquiry" aria-labelledby="enquiry-title" className={styles.contact}>
        <div className={`${styles.container} ${styles.section} ${styles.split}`}>
          <div><p className={styles.eyebrow}>{t("For transport employers")}</p><h2 id="enquiry-title">{t("Tell us which routes you need to cover.")}</h2><p className={styles.body}>{t("Share one vacancy or a larger fleet requirement. We’ll discuss candidate suitability, the qualification steps involved and whether the proposed search fits your timing. If there’s a fit, we’ll set out the work, responsibilities and costs.")}</p><div className={styles.contactLinks}><a href={contactHref("mailto:support@sufoniq.com?subject=Truck%20driver%20recruitment",locale,t)} className={styles.link}>{t("Email your requirement")}</a><a href={contactHref("https://wa.me/420778604430?text=Hello%20Sufoniq%2C%20I%27d%20like%20to%20discuss%20truck%20driver%20recruitment%20for%20our%20fleet.",locale,t)} target="_blank" rel="noopener noreferrer" className={styles.link}>{t("Message on WhatsApp ↗")}</a></div></div>
          <DriverEnquiryForm />
        </div>
      </section>
      <section className={`${styles.container} ${styles.sources}`}>
        <details className={styles.disclosure}><summary><span>{t("Responsibilities and official sources")}</span><ChevronDown size={18} aria-hidden="true" /></summary><div><p>{t("Your company employs the drivers and makes the hiring decision. Authorities and competent bodies decide immigration and professional qualification matters. Sufoniq coordinates the recruitment and preparation agreed for your assignment.")}</p><div className={styles.sourceLinks}><a href={germany} target="_blank" rel="noopener noreferrer" className={styles.link}>{t("German employer guidance ↗")}</a><a href={qualificationRoute} target="_blank" rel="noopener noreferrer" className={styles.link}>{t("Germany’s qualification route ↗")}</a><a href={euQualifications} target="_blank" rel="noopener noreferrer" className={styles.link}>{t("EU driver qualification rules ↗")}</a><Link locale={locale} href="/employers" className={styles.link}>{t("Other hiring requirements ")}<ArrowRight size={16} aria-hidden="true" /></Link></div><p className={styles.sourceNote}>{t("Guidance checked 9 November 2026. The applicable country and candidate requirements are established for each assignment.")}</p></div></details>
      </section>
    </main>
  );
}
