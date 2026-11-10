import { getTranslator } from '@/lib/i18n/server';
import type { Locale } from '@/lib/i18n/shared';
import Link from "@/components/LocalizedLink";
import { FaFacebook, FaLinkedin, FaTiktok } from "react-icons/fa6";
import { recruitmentPages } from "@/app/(english)/employers/recruitment-pages";
import styles from "./Footer.module.css";

export default function Footer({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <Link locale={locale} href="/" className={styles.wordmark}>{t("SUFONIQ")}</Link>
            <p className={styles.tagline}>{t("Cross-border recruitment and mobility, scoped before work begins.")}</p>
            <a className={styles.email} href="mailto:support@sufoniq.com">{t("support@sufoniq.com")}</a>
            <Link locale={locale} href="/#contact" className={styles.contact}>{t("Contact Sufoniq →")}</Link>
          </div>
          <nav aria-label={t("Footer services")} className={styles.services}>
            <h2>{t("Find support")}</h2>
            <ul>
              <li><Link locale={locale} className={styles.primaryLink} href="/employers">{t("For employers")}</Link></li>
              <li><Link locale={locale} className={styles.primaryLink} href="/work-in-europe">{t("For job seekers")}</Link></li>
            </ul>
            <h3>{t("Specialist recruitment")}</h3>
            <ul>{recruitmentPages.map(page => <li key={page.id}><Link locale={locale} href={page.href}>{t(page.title)}{page.id === "austria-agriculture" ? t(" in Austria") : ""}</Link></li>)}</ul>
          </nav>
          <nav aria-label={t("Footer company")} className={styles.company}>
            <h2>{t("About Sufoniq")}</h2>
            <ul>
              <li><Link locale={locale} href="/about">{t("Our story and team")}</Link></li>
              <li><Link locale={locale} href="/method-trust">{t("Method & Trust")}</Link></li>
              <li><Link locale={locale} href="/insights">{t("Insights")}</Link></li>
            </ul>
          </nav>
          <div className={styles.sources}>
            <h2>{t("Data & sources")}</h2>
            <p><strong>{t("Eurostat")}</strong>{t(": migration flows and job-vacancy rates.")}</p>
            <p><strong>{t("World Bank")}</strong>{t(": economic context indicators.")}</p>
            <Link locale={locale} href="/method-trust">{t("How we use these sources →")}</Link>
          </div>
        </div>

        <div className={styles.details}>
          <p>{t("Sufoniq is operated by UAB Skillaxis — headquarters in Vilnius, management in Vienna, recruitment and operations in the Czech Republic.")}</p>
          <div className={styles.socials} aria-label={t("Social profiles")}>
            <a href="https://www.linkedin.com/in/amandeep-singh-610aa6384/" target="_blank" rel="noopener noreferrer"><FaLinkedin aria-hidden="true" /><span>{t("Founder on LinkedIn")}<span className="sr-only"> {t("(opens in a new tab)")}</span></span></a>
            <a href="https://www.facebook.com/profile.php?id=61588526631352" target="_blank" rel="noopener noreferrer"><FaFacebook aria-hidden="true" /><span>{t("Facebook")}<span className="sr-only"> {t("(opens in a new tab)")}</span></span></a>
            <a href="https://www.tiktok.com/@skillaxis" target="_blank" rel="noopener noreferrer"><FaTiktok aria-hidden="true" /><span>{t("TikTok")}<span className="sr-only"> {t("(opens in a new tab)")}</span></span></a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} {t("UAB Skillaxis, operating Sufoniq")}</p>
          <nav aria-label={t("Legal information")}><Link locale={locale} href="/privacy-policy">{t("Privacy policy")}</Link><Link locale={locale} href="/terms-conditions">{t("Terms and conditions")}</Link></nav>
          <a href="https://amuidesign.org" className={styles.credit}>
            <span>{t("Developed by:")}</span><span className="sr-only">{t("AMUI Design")}</span>
            <span aria-hidden="true" className={styles.creditLogo} />
          </a>
        </div>
      </div>
    </footer>
  );
}
