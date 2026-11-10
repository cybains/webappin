import {getTranslator} from '@/lib/i18n/server';
import type {Locale} from '@/lib/i18n/shared';
import Link from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import styles from "./page.module.css";

const principles = [
  ["Written agreements", "The work, responsibilities and fees are agreed before paid work starts."],
  ["Candidate consent", "Candidate details are shared with employers or partners only with the candidate’s permission."],
  ["Clear accountability", "We distinguish the work we coordinate from the decisions made by employers, authorities and qualification bodies."],
] as const;

export default function AboutPage({locale="en"}:{locale?:Locale}) {
  const t=getTranslator(locale);
  return (
    <main className={`${styles.page} sufoniq-page`}>
      <StructuralGridBand>
        <header id="who" className={`${styles.container} ${styles.hero}`}>
          <p className={styles.eyebrow}>{t("Recruitment and mobility in Europe")}</p>
          <h1>{t("About Sufoniq")}</h1>
          <p className={styles.lead}>{t("Sufoniq is a recruitment and mobility service for European employers and job seekers, operated by UAB Skillaxis.")}</p>
        </header>
      </StructuralGridBand>

      <section id="story" aria-labelledby="story-title" className={`${styles.container} ${styles.section}`}>
        <h2 id="story-title">{t("Why Sufoniq began")}</h2>
        <p className={styles.body}>{t("Engineer Amandeep Singh Parhar launched Sufoniq in 2025. It grew from seeing employers and job seekers struggle with the gaps in cross-border hiring.")}</p>
        <p className={styles.body}>{t("An employer could find someone they wanted to hire and still face unresolved permit or qualification requirements. A candidate could have the experience needed for the job and still be unsure where to apply or which documents to prepare. Finding each other was only part of the problem.")}</p>
        <p className={styles.body}>{t("We built Sufoniq to connect those steps, with responsibilities made clear from the beginning.")}</p>
      </section>

      <section id="team" aria-labelledby="team-title" className={`${styles.container} ${styles.section}`}>
        <h2 id="team-title">{t("A small team working across borders")}</h2>
        <p className={styles.body}>{t("We are now a small team of different nationalities and languages, working across Lithuania, Austria and the Czech Republic. We bring different work cultures to a shared task: helping employers and job seekers understand each other and the steps ahead.")}</p>
      </section>

      <section id="company" aria-labelledby="company-title" className={`${styles.container} ${styles.section}`}>
        <h2 id="company-title">{t("The company behind Sufoniq")}</h2>
        <p className={styles.body}>{t("UAB Skillaxis was incorporated in Lithuania on 19 August 2025. Sufoniq launched under the company later that year.")}</p>
        <dl className={styles.facts}>
          <div><dt>{t("Legal entity")}</dt><dd>{t("UAB Skillaxis")}</dd></div>
          <div><dt>{t("Company code")}</dt><dd>307395574</dd></div>
          <div><dt>{t("Registered in")}</dt><dd>{t("Lithuania")}</dd></div>
          <div><dt>{t("Headquarters")}</dt><dd>{t("Vilnius, Lithuania")}</dd></div>
          <div><dt>{t("Management")}</dt><dd>{t("Vienna, Austria")}</dd></div>
          <div><dt>{t("Recruitment and operations")}</dt><dd>{t("Czech Republic")}</dd></div>
        </dl>
        <div className={styles.companyLinks}>
          <a href="https://www.registrucentras.lt/jar/p_en/index.php?kod=307395574&p=1" target="_blank" rel="noopener noreferrer" className={styles.link}>{t("Check the company registration ↗")}</a>
          <a href="mailto:support@sufoniq.com" className={styles.link}>support@sufoniq.com</a>
        </div>
      </section>

      <section id="operate" aria-labelledby="principles-title" className={`${styles.container} ${styles.section}`}>
        <h2 id="principles-title">{t("Our working principles")}</h2>
        <dl className={styles.principles}>{principles.map(([title, description]) => <div key={t(title)}><dt>{t(title)}</dt><dd>{t(description)}</dd></div>)}</dl>
        <Link locale={locale} href="/method-trust" className={styles.link}>{t("Our method and responsibilities ")}<ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      <section id="what" aria-labelledby="next-title" className={`${styles.container} ${styles.closing}`}>
        <div className={styles.next}>
          <h2 id="next-title">{t("Explore our services")}</h2>
          <div className={styles.actions}>
            <Link locale={locale} href="/employers" className={styles.primary}>{t("Employer support ")}<ArrowRight size={18} aria-hidden="true" /></Link>
            <Link locale={locale} href="/work-in-europe" className={styles.link}>{t("Job-seeker support ")}<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
