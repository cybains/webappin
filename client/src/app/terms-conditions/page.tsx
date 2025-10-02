import type { Metadata } from "next";

/**
 * Terms & Conditions page for Sufoniq by UAB Skillaxis
 * Single-page doc covering BOTH B2C (consumers) and B2B (business customers), EU-friendly.
 * IMPORTANT: Replace placeholder links/emails and verify local counsel review before production.
 */

// ---------- CONFIGURABLE CONSTANTS ----------
const BRAND = "Sufoniq";
const COMPANY_LEGAL = "UAB Skillaxis"; // Lithuanian private limited company (UAB)
const COMPANY_CODE = "307395574"; // Company code (from Lithuanian register)
const COMPANY_ADDRESS = "Architektų g. 56-101, LT-04111 Vilnius, Lithuania";
const CONTACT_EMAIL = "legal@sufoniq.com"; // TODO: confirm or replace
const CONTACT_POSTAL = `${COMPANY_LEGAL}, ${COMPANY_ADDRESS}`;
const WEBSITE = "sufoniq.com"; // used for copy only; no external calls
const LAST_UPDATED_ISO = "2025-10-02"; // YYYY-MM-DD

// ---------- UI TEXT ----------
const PAGE_TITLE = `Terms & Conditions | ${BRAND}`;
const TAGLINE = "Ground Rules for a Future‑Proof Mobility & Employment Experience";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description:
    `Read the Terms & Conditions for ${BRAND} by ${COMPANY_LEGAL}. This page covers both consumers (B2C) and business customers (B2B), including EU‑specific rights, privacy/GDPR hooks, subscription terms, acceptable use, and liability.`,
};

const sections = [
  { id: "who-we-are", label: "Who we are" },
  { id: "eligibility", label: "Eligibility & Accounts" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "services", label: "Services, Changes & Availability" },
  { id: "plans-payments", label: "Plans, Payments, Taxes (B2C & B2B)" },
  { id: "consumer-rights", label: "EU Consumer Rights (B2C only)" },
  { id: "your-content", label: "Your Content & Licenses" },
  { id: "ip", label: "Intellectual Property" },
  { id: "ai", label: "AI & Automation" },
  { id: "privacy", label: "Data Protection & Privacy (GDPR)" },
  { id: "third-parties", label: "Third‑Party Services & Partners" },
  { id: "warranties", label: "Warranties & Disclaimers" },
  { id: "indemnity", label: "Indemnity (B2B only)" },
  { id: "liability", label: "Limitations of Liability (B2C & B2B)" },
  { id: "export", label: "Export Controls & Sanctions" },
  { id: "termination", label: "Suspension & Termination" },
  { id: "changes", label: "Changes to these Terms" },
  { id: "law", label: "Governing Law & Disputes" },
  { id: "misc", label: "Miscellaneous" },
  { id: "contact", label: "Contact" },
];

function LastUpdated({ dateISO }: { dateISO: string }) {
  const dt = new Date(dateISO);
  const display = dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return <time dateTime={dateISO}>{display}</time>;
}

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-[var(--accent)]">Terms & Conditions</p>
          <h1 className="text-4xl font-bold">{TAGLINE}</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: <LastUpdated dateISO={LAST_UPDATED_ISO} />
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            These terms govern your access to the {BRAND} platform and related services operated by {COMPANY_LEGAL}. By creating an account or using our site, you agree to these conditions. This page covers <strong>both consumers (B2C)</strong> and <strong>business customers (B2B)</strong>; sections are labelled where they apply to one group only.
          </p>
        </header>

        {/* Jump navigation */}
        <nav aria-label="Terms and conditions sections" className="bg-background/60 border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Jump to a section</h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm">
            {sections.map((s) => (
              <li key={s.id}><a className="hover:underline" href={`#${s.id}`}>{s.label}</a></li>
            ))}
          </ul>
        </nav>

        {/* 1. Who we are */}
        <section id="who-we-are" className="space-y-4">
          <h2 className="text-2xl font-semibold">1) Who we are</h2>
          <p>
            {BRAND} is a brand operated by <strong>{COMPANY_LEGAL}</strong> (company code {COMPANY_CODE}), with registered address {COMPANY_ADDRESS}. References to “we”, “us” or “our” mean {COMPANY_LEGAL}. References to “you” or “your” mean the individual end user (B2C) or the contracting business customer (B2B), as applicable.
          </p>
        </section>

        {/* 2. Eligibility & Accounts */}
        <section id="eligibility" className="space-y-4">
          <h2 className="text-2xl font-semibold">2) Eligibility & Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 18 and have legal capacity to enter this agreement.</li>
            <li>You are responsible for safeguarding credentials and all activity under your account; notify us promptly of any suspected unauthorized use or security incident.</li>
            <li>We may refuse, suspend, or terminate accounts for violations of these terms or applicable law (see §16).</li>
          </ul>
        </section>

        {/* 3. Acceptable Use */}
        <section id="acceptable-use" className="space-y-4">
          <h2 className="text-2xl font-semibold">3) Acceptable Use</h2>
          <p>Use the Services lawfully. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>breach immigration, employment, export control, or sanctions laws;</li>
            <li>upload or transmit unlawful, infringing, defamatory, or harmful content;</li>
            <li>reverse engineer, decompile, or circumvent security/access controls (unless permitted by law);</li>
            <li>introduce malware or interfere with service integrity/performance;</li>
            <li>scrape, bulk‑download, or evade rate limits;</li>
            <li>use outputs or the Services to train competing models/datasets without written consent;</li>
            <li>misrepresent your identity or affiliation.</li>
          </ul>
        </section>

        {/* 4. Services, Changes & Availability */}
        <section id="services" className="space-y-4">
          <h2 className="text-2xl font-semibold">4) Services, Changes & Availability</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We aim for high availability but do not guarantee uninterrupted service. Maintenance windows, beta features, or third‑party outages may affect access.</li>
            <li>We may modify or discontinue features. Where changes are material and adverse, we will provide reasonable advance notice when feasible.</li>
            <li><strong>Beta/Preview.</strong> Provided <em>as‑is</em>, may be throttled or withdrawn, and excluded from service levels/support.</li>
          </ul>
        </section>

        {/* 5. Plans, Payments, Taxes */}
        <section id="plans-payments" className="space-y-4">
          <h2 className="text-2xl font-semibold">5) Plans, Payments, Taxes (B2C & B2B)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pricing, plan limits, and included features are shown at checkout or in your account.</li>
            <li>Subscriptions renew automatically for the same term unless cancelled before the current term ends. You can cancel in your account anytime.</li>
            <li>Unless stated otherwise, fees are non‑refundable and exclude applicable taxes; you are responsible for taxes and duties we do not collect.</li>
            <li>We may change prices with at least 30 days’ notice for the next term.</li>
          </ul>
        </section>

        {/* 6. EU Consumer Rights (B2C only) */}
                {/* 6. EU Consumer Rights (B2C only) */}
        <section id="consumer-rights" className="space-y-4">
          <h2 className="text-2xl font-semibold">6) EU Consumer Rights (B2C only)</h2>
          <div className="space-y-3">
            <p><strong>Cooling‑off period:</strong> If you are a consumer purchasing at a distance (online), you have a <strong>14‑day</strong> right to withdraw without giving any reason.</p>
            <p><strong>How to withdraw:</strong> Send us a clear statement (e.g., email to <a className="text-[var(--accent)] hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>) within 14 days of purchase. You may (but don’t have to) use the EU Model Withdrawal Form: <a className="text-[var(--accent)] hover:underline" href="https://eur-lex.europa.eu/eli/dec_impl/2014/871/oj">link</a>. We will confirm receipt on a durable medium.</p>
            <p><strong>Refunds:</strong> We will refund payments without undue delay and in any event within 14 days of receiving your withdrawal notice, using the same payment method where possible. Deductions may apply as set out below.</p>

            <h3 className="text-xl font-semibold">Services started during the 14 days</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you <em>request</em> that we begin providing a <strong>service</strong> during the cooling‑off period and then withdraw <em>before completion</em>, you owe a <strong>proportionate amount</strong> for the service provided up to your withdrawal.</li>
              <li>If the service is <strong>fully performed</strong> within the cooling‑off period, and you gave <strong>express request to start</strong> and <strong>explicit acknowledgment</strong> that you would lose the right upon full performance, your right of withdrawal is <strong>lost</strong>.</li>
            </ul>

            <h3 className="text-xl font-semibold">Digital content/services not supplied on a tangible medium (e.g., immediate platform/AI access)</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your 14‑day right of withdrawal is <strong>lost at the moment delivery begins</strong> <em>if and only if</em> you gave <strong>prior express consent</strong> to immediate access and <strong>explicitly acknowledged</strong> that you lose the right once delivery starts. We confirm this on a durable medium.</li>
            </ul>

            <p className="text-sm text-muted-foreground">This section is intended to reflect EU consumer law (including Directive 2011/83/EU and Directive (EU) 2019/770). Your mandatory rights remain unaffected.</p>

            <div className="rounded-lg border border-border p-4 bg-background/60">
              <h4 className="font-semibold mb-2">Immediate Start Consent (B2C — informational)</h4>
              <ol className="list-decimal pl-6 space-y-2 text-sm">
                <li>“I <strong>request</strong> that you begin providing the service/digital service <strong>immediately</strong> (before the 14‑day withdrawal period ends).”</li>
                <li>“I <strong>understand</strong> that once the service is <strong>fully performed</strong> <em>or</em> once digital access <strong>starts</strong>, I <strong>will lose</strong> my 14‑day right of withdrawal. If I withdraw before completion of a service, I will pay a <strong>proportionate amount</strong> for what has been provided.”</li>
              </ol>
              <p className="mt-2 text-xs text-muted-foreground">Note: These statements are shown here for transparency; they may also appear in checkout/sign‑up flows.</p>
            </div>
          </div>
        </section>

        {/* 7. Your Content & Licenses */}
        <section id="your-content" className="space-y-4">
          <h2 className="text-2xl font-semibold">7) Your Content & Licenses</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You retain ownership of content you upload (&ldquo;Your Content&rdquo;).</li>
            <li>You grant {COMPANY_LEGAL} a worldwide, non‑exclusive, royalty‑free license to host, process, transmit, reproduce, and display Your Content solely to operate, secure, maintain, and improve the Services, and to comply with law. We do not sell Your Content.</li>
            <li>You warrant you have all rights necessary and that Your Content does not infringe third‑party rights.</li>
            <li><strong>Feedback.</strong> You grant us a perpetual, irrevocable, royalty‑free license to use suggestions without restriction.</li>
          </ul>
        </section>

        {/* 8. Intellectual Property */}
        <section id="ip" className="space-y-4">
          <h2 className="text-2xl font-semibold">8) Intellectual Property</h2>
          <p>
            The Services (including software, models, algorithms, curated datasets, UI, and trademarks) are owned by {COMPANY_LEGAL} or its licensors and protected by IP laws. No rights are granted except as expressly stated. Do not remove proprietary notices or use our marks without written permission.
          </p>
        </section>

        {/* 9. AI & Automation */}
        <section id="ai" className="space-y-4">
          <h2 className="text-2xl font-semibold">9) AI & Automation</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Outputs may be generated by machine‑learning models and can be probabilistic or incomplete.</li>
            <li>Outputs are guidance only and not legal, immigration, tax, or financial advice. Consult qualified professionals for high‑stakes decisions.</li>
            <li>We implement safeguards and quality controls, but we do not warrant that outputs will be correct or fit for a particular purpose. You are responsible for reviewing outputs before relying on them.</li>
          </ul>
        </section>

        {/* 10. Data Protection & Privacy (GDPR) */}
        <section id="privacy" className="space-y-4">
          <h2 className="text-2xl font-semibold">10) Data Protection & Privacy (GDPR)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Our processing of personal data is described in our <a className="text-[var(--accent)] hover:underline" href="/legal/privacy">Privacy Policy</a>, which forms part of these terms.</li>
            <li>Where we act as a processor for business customers, our <a className="text-[var(--accent)] hover:underline" href="/legal/dpa">Data Processing Addendum (DPA)</a> applies and incorporates Standard Contractual Clauses where relevant.</li>
            <li>We maintain appropriate technical and organizational measures. In case of a personal‑data breach, we will notify affected customers/authorities as required by law.</li>
            <li>Upon account closure or request, we will delete or anonymize personal data within a reasonable period, subject to backups and legal retention. You may export Your Content prior to termination.</li>
          </ul>
        </section>

        {/* 11. Third‑Party Services */}
        <section id="third-parties" className="space-y-4">
          <h2 className="text-2xl font-semibold">11) Third‑Party Services & Partners</h2>
          <p>
            The Services may integrate third‑party products. Your use of such products is subject to their terms. We are not responsible for third‑party services and do not guarantee their availability. Partner offerings may carry additional terms or fees disclosed at engagement.
          </p>
        </section>

        {/* 12. Warranties & Disclaimers */}
        <section id="warranties" className="space-y-4">
          <h2 className="text-2xl font-semibold">12) Warranties & Disclaimers</h2>
          <p>
            Except as expressly stated, the Services are provided <strong>“as is” and “as available”</strong> without warranties of any kind, whether express, implied, or statutory (including merchantability, fitness for a particular purpose, and non‑infringement). This does not limit warranties that cannot be excluded under applicable law, especially for consumers.
          </p>
        </section>

        {/* 13. Indemnity (B2B only) */}
        <section id="indemnity" className="space-y-4">
          <h2 className="text-2xl font-semibold">13) Indemnity (B2B only)</h2>
          <p>
            The business customer will defend and indemnify {COMPANY_LEGAL} against third‑party claims arising from (a) the customer’s content; (b) breach of these terms; or (c) unlawful use of the Services, to the extent permitted by law.
          </p>
        </section>

        {/* 14. Limitations of Liability */}
        <section id="liability" className="space-y-4">
          <h2 className="text-2xl font-semibold">14) Limitations of Liability (B2C & B2B)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To the maximum extent permitted by law, {COMPANY_LEGAL} and its affiliates, directors, employees, and partners are not liable for indirect, incidental, special, punitive, or consequential damages, or for loss of profits, revenue, data, or goodwill.</li>
            <li><strong>Aggregate cap (B2B).</strong> Our total liability for all claims relating to the Services in any 12‑month period is limited to the amounts paid by the business customer for the Services giving rise to the claim in that period.</li>
            <li><strong>Consumers.</strong> Nothing in these terms limits liability that cannot be limited under applicable law (including for death/personal injury caused by negligence, fraud, or statutory consumer guarantees).</li>
          </ul>
        </section>

        {/* 15. Export Controls & Sanctions */}
        <section id="export" className="space-y-4">
          <h2 className="text-2xl font-semibold">15) Export Controls & Sanctions</h2>
          <p>
            You must comply with applicable export control, sanctions, and anti‑boycott laws. You may not use the Services if you are located in a comprehensively sanctioned jurisdiction or are otherwise a restricted party.
          </p>
        </section>

        {/* 16. Suspension & Termination */}
        <section id="termination" className="space-y-4">
          <h2 className="text-2xl font-semibold">16) Suspension & Termination</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You may close your account at any time via settings or by contacting support.</li>
            <li>We may suspend or terminate access for violations, legal/security risks, non‑payment, or prolonged inactivity.</li>
            <li>Upon termination, sections that by their nature should survive (e.g., confidentiality, IP, fees, limitations of liability, indemnities, dispute resolution) will continue to apply. We will make commercially reasonable efforts to enable export of Your Content prior to closure where feasible.</li>
          </ul>
        </section>

        {/* 17. Changes to these Terms */}
        <section id="changes" className="space-y-4">
          <h2 className="text-2xl font-semibold">17) Changes to these Terms</h2>
          <p>
            We may update these terms from time to time. For material adverse changes, we will provide notice (e.g., email or in‑product) at least 15 days before they take effect unless immediate changes are required by law or for security. Continued use after the effective date constitutes acceptance.
          </p>
        </section>

        {/* 18. Governing Law & Disputes */}
        <section id="law" className="space-y-4">
          <h2 className="text-2xl font-semibold">18) Governing Law & Disputes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Governing law:</strong> Laws of the Republic of Lithuania, without regard to conflict‑of‑law principles.</li>
            <li><strong>Venue:</strong> Courts of Vilnius, Lithuania, except where mandatory consumer venue rules or other non‑waivable rights apply.</li>
            <li><strong>EU ODR:</strong> If you are an EU consumer, you may use the European Commission’s Online Dispute Resolution (ODR) platform.</li>
          </ul>
        </section>

        {/* 19. Miscellaneous */}
        <section id="misc" className="space-y-4">
          <h2 className="text-2xl font-semibold">19) Miscellaneous</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Severability.</strong> If any provision is unenforceable, the remainder remains in effect.</li>
            <li><strong>No waiver.</strong> Failure to enforce any term is not a waiver.</li>
            <li><strong>Assignment.</strong> You may not assign without our consent. We may assign to an affiliate or in connection with a merger, acquisition, or asset transfer.</li>
            <li><strong>Entire agreement.</strong> These terms, the Privacy Policy, the DPA (if applicable), and plan‑specific terms form the entire agreement regarding the Services.</li>
          </ul>
        </section>

        {/* 20. Contact */}
        <section id="contact" className="space-y-4">
          <h2 className="text-2xl font-semibold">20) Contact</h2>
          <p>
            Questions? Email <a className="text-[var(--accent)] hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or write to {CONTACT_POSTAL}. For faster resolution of account issues, please contact support via your account.
          </p>
        </section>

        <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {COMPANY_LEGAL} — {BRAND} ({WEBSITE}). All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
