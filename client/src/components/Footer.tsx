import Link from "next/link";
import { FaFacebook, FaLinkedin, FaTiktok } from "react-icons/fa6";
import { recruitmentPages } from "@/app/employers/recruitment-pages";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <Link href="/" className={styles.wordmark}>SUFONIQ</Link>
            <p className={styles.tagline}>Cross-border recruitment and mobility, scoped before work begins.</p>
            <a className={styles.email} href="mailto:support@sufoniq.com">support@sufoniq.com</a>
            <Link href="/#contact" className={styles.contact}>Contact Sufoniq →</Link>
          </div>
          <nav aria-label="Footer services" className={styles.services}>
            <h2>Find support</h2>
            <ul>
              <li><Link className={styles.primaryLink} href="/employers">For employers</Link></li>
              <li><Link className={styles.primaryLink} href="/work-in-europe">For job seekers</Link></li>
            </ul>
            <h3>Specialist recruitment</h3>
            <ul>{recruitmentPages.map(page => <li key={page.id}><Link href={page.href}>{page.title}{page.id === "austria-agriculture" ? " in Austria" : ""}</Link></li>)}</ul>
          </nav>
          <nav aria-label="Footer company" className={styles.company}>
            <h2>About Sufoniq</h2>
            <ul>
              <li><Link href="/about">Our story and team</Link></li>
              <li><Link href="/method-trust">Method &amp; Trust</Link></li>
              <li><Link href="/insights">Insights</Link></li>
            </ul>
          </nav>
          <div className={styles.sources}>
            <h2>Data &amp; sources</h2>
            <p><strong>Eurostat</strong>: migration flows and job-vacancy rates.</p>
            <p><strong>World Bank</strong>: economic context indicators.</p>
            <Link href="/method-trust">How we use these sources →</Link>
          </div>
        </div>

        <div className={styles.details}>
          <p>Sufoniq is operated by UAB Skillaxis — headquarters in Vilnius, management in Vienna, recruitment and operations in the Czech Republic.</p>
          <div className={styles.socials} aria-label="Social profiles">
            <a href="https://www.linkedin.com/in/amandeep-singh-610aa6384/" target="_blank" rel="noopener noreferrer"><FaLinkedin aria-hidden="true" /><span>Founder on LinkedIn<span className="sr-only"> (opens in a new tab)</span></span></a>
            <a href="https://www.facebook.com/profile.php?id=61588526631352" target="_blank" rel="noopener noreferrer"><FaFacebook aria-hidden="true" /><span>Facebook<span className="sr-only"> (opens in a new tab)</span></span></a>
            <a href="https://www.tiktok.com/@skillaxis" target="_blank" rel="noopener noreferrer"><FaTiktok aria-hidden="true" /><span>TikTok<span className="sr-only"> (opens in a new tab)</span></span></a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} UAB Skillaxis, operating Sufoniq</p>
          <nav aria-label="Legal information"><Link href="/privacy-policy">Privacy policy</Link><Link href="/terms-conditions">Terms and conditions</Link></nav>
          <a href="https://amuidesign.org" className={styles.credit}>
            <span>Developed by:</span><span className="sr-only">AMUI Design</span>
            <span aria-hidden="true" className={styles.creditLogo} />
          </a>
        </div>
      </div>
    </footer>
  );
}
