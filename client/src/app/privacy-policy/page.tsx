import type { Metadata } from "next";

const LAST_UPDATED = "October 2, 2025";

export const metadata: Metadata = {
  title: "Privacy Policy | Sufoniq",
  description:
    "Learn how Sufoniq (UAB Skillaxis) collects, uses, and protects personal data across our global talent platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-[var(--accent)]">Privacy Policy</p>
          <h1 className="text-4xl font-bold">Modern Data Practices for Global Talent</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Sufoniq empowers professionals to navigate global opportunities through a tech-forward
            platform. This privacy policy explains how we collect, safeguard, and leverage data to
            deliver personalized experiences across AI-powered workflows, analytics, and
            cross-border services.
          </p>
        </header>

        {/* Jump Navigation */}
        <nav aria-label="Privacy policy sections" className="bg-background/60 border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Jump to a section</h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm">
            <li><a className="hover:underline" href="#controller">Who We Are (Controller)</a></li>
            <li><a className="hover:underline" href="#scope">Scope</a></li>
            <li><a className="hover:underline" href="#summary">At-a-glance Summary</a></li>
            <li><a className="hover:underline" href="#collection">Data We Collect</a></li>
            <li><a className="hover:underline" href="#sources">Sources of Data</a></li>
            <li><a className="hover:underline" href="#notice">Notice at Collection (CPRA)</a></li>
            <li><a className="hover:underline" href="#purposes">Purposes & Legal Bases (GDPR)</a></li>
            <li><a className="hover:underline" href="#ai">AI, Profiling & Human Oversight</a></li>
            <li><a className="hover:underline" href="#cookies">Cookies & Tracking</a></li>
            <li><a className="hover:underline" href="#sharing">Sharing & Disclosures</a></li>
            <li><a className="hover:underline" href="#transfers">International Transfers</a></li>
            <li><a className="hover:underline" href="#retention">Retention</a></li>
            <li><a className="hover:underline" href="#rights">Your Rights & Privacy Choices</a></li>
            <li><a className="hover:underline" href="#cookie-list">Cookie List</a></li>
            <li><a className="hover:underline" href="#security">Security</a></li>
            <li><a className="hover:underline" href="#changes">Changes</a></li>
            <li><a className="hover:underline" href="#contact">Contact Us</a></li>
          </ul>
        </nav>

        {/* Controller */}
        <section id="controller" className="space-y-4">
          <h2 className="text-2xl font-semibold">1) Who We Are (Controller)</h2>
          <p>
            UAB Skillaxis, operating as <strong>Sufoniq</strong> (the “Company,” “we,” “us,” or “our”), is the
            <strong> data controller</strong> for the processing activities described in this policy, unless otherwise stated.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Legal entity:</strong> UAB Skillaxis</li>
            <li><strong>Company code:</strong> 307395574</li>
            <li><strong>Registered address:</strong> Architektų g. 56-101, LT-04111, Vilnius, Lithuania</li>
            <li><strong>Trading/brand name:</strong> Sufoniq (sufoniq.com)</li>
            <li><strong>EU/EEA establishment:</strong> Lithuania</li>
            <li>
              <strong>UK representative (UK GDPR Art. 27):</strong> We target users in the UK. Our UK representative details
              will be published at <code>/legal/uk-representative</code> once appointed. Until then, UK users can contact our DPO below.
            </li>
            <li>
              <strong>Data Protection Officer (DPO):</strong>{" "}
              <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@sufoniq.com">
                privacy@sufoniq.com
              </a>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Where we provide services to employers or other clients who instruct us (e.g., background screening
            facilitated by a partner), we may act as a <strong>processor</strong> and the client is the controller; their privacy
            policy applies to their own use of personal data.
          </p>
        </section>

        {/* Scope */}
        <section id="scope" className="space-y-4">
          <h2 className="text-2xl font-semibold">2) Scope</h2>
          <p>
            This policy applies to our websites, web and mobile apps, and services that link to it (collectively, the
            “Services”). It covers users such as job seekers, talent, employer contacts, and visitors.
          </p>
        </section>

        {/* Summary */}
        <section id="summary" className="space-y-4">
          <h2 className="text-2xl font-semibold">3) At-a-glance Summary</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We collect account, profile/CV, usage, device, and approximate location data.</li>
            <li>We use AI models to extract skills, match opportunities, and personalize guidance. Outputs are <strong>decision support</strong>; humans make final hiring decisions.</li>
            <li>We <strong>do not sell or share</strong> personal information for cross-context behavioral advertising.</li>
            <li>You have rights to <strong>access, correct, delete, port, and object</strong>, and to <strong>appeal</strong> where applicable.</li>
            <li>International transfers are protected by <strong>Standard Contractual Clauses</strong> (and UK IDTA where applicable).</li>
            <li>Retention is limited and purpose-based (see Retention).</li>
          </ul>
        </section>

        {/* Data We Collect */}
        <section id="collection" className="space-y-4">
          <h2 className="text-2xl font-semibold">4) Data We Collect</h2>
          <p>We collect the following categories (examples are illustrative):</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identifiers & contact</strong> — name, email, phone, country, account IDs.</li>
            <li><strong>Professional & CV data</strong> — employment history, skills, education, certificates, portfolio links.</li>
            <li><strong>Inferences & profile signals</strong> — derived skills, seniority, job match scores.</li>
            <li><strong>Device & internet activity</strong> — IP address, device type, OS, browser, pages viewed, events (crash logs).</li>
            <li><strong>Approximate location</strong> — city/country based on IP or user preference.</li>
            <li><strong>Support & communications</strong> — messages, tickets, survey responses.</li>
            <li><strong>Partner data</strong> — (if you choose) information from background-check and mobility partners, or publicly available professional sources.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            <strong>Children:</strong> Our Services are <strong>not intended for children under 16</strong>. We do not knowingly collect data from children.
            If you believe a child has provided data, contact us to delete it.
          </p>
        </section>

        {/* Sources */}
        <section id="sources" className="space-y-4">
          <h2 className="text-2xl font-semibold">5) Sources of Data</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Directly from you (account creation, profile uploads, forms, communications).</li>
            <li>Automatically from your device and interactions (cookies, SDKs, logs).</li>
            <li>From partners and publicly available professional sources, under contract or where permitted by law.</li>
          </ul>
        </section>

        {/* Notice at Collection */}
        <section id="notice" className="space-y-4">
          <h2 className="text-2xl font-semibold">6) Notice at Collection (California/CPRA)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-3 border-b">Category</th>
                  <th className="text-left p-3 border-b">Examples</th>
                  <th className="text-left p-3 border-b">Sold?</th>
                  <th className="text-left p-3 border-b">Shared for cross-context ads?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="p-3 border-b">Identifiers</td>
                  <td className="p-3 border-b">name, email, IP</td>
                  <td className="p-3 border-b">No</td>
                  <td className="p-3 border-b">No</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Professional info</td>
                  <td className="p-3 border-b">CV, skills, work history</td>
                  <td className="p-3 border-b">No</td>
                  <td className="p-3 border-b">No</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Internet/Device activity</td>
                  <td className="p-3 border-b">logs, analytics events</td>
                  <td className="p-3 border-b">No</td>
                  <td className="p-3 border-b">No</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Approx. geolocation</td>
                  <td className="p-3 border-b">city/country</td>
                  <td className="p-3 border-b">No</td>
                  <td className="p-3 border-b">No</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Inferences</td>
                  <td className="p-3 border-b">match scores, interests</td>
                  <td className="p-3 border-b">No</td>
                  <td className="p-3 border-b">No</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3">Sensitive PI</td>
                  <td className="p-3">
                    Collected only when necessary (e.g., national ID/passport for compliance, background screening).
                    Used solely for the requested or legally required purpose; not used for additional purposes without your consent.
                  </td>
                  <td className="p-3">No</td>
                  <td className="p-3">No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><strong>Right to opt-out:</strong> We do not sell/share PI. You can still reach us for any request at <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@sufoniq.com">privacy@sufoniq.com</a>.</p>
          <p><strong>Limit SPI:</strong> If SPI is collected for a limited purpose, we use it only for that purpose and permit you to limit additional uses.</p>
        </section>

        {/* Purposes & Legal Bases */}
        <section id="purposes" className="space-y-4">
          <h2 className="text-2xl font-semibold">7) Purposes & Legal Bases (GDPR/EEA)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-3 border-b">Purpose</th>
                  <th className="text-left p-3 border-b">Typical data</th>
                  <th className="text-left p-3 border-b">Legal basis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="p-3 border-b">Account creation & authentication</td>
                  <td className="p-3 border-b">Identifiers, contact</td>
                  <td className="p-3 border-b"><strong>Contract</strong> (Art. 6(1)(b))</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Deliver core Services (job matching, relocation guidance)</td>
                  <td className="p-3 border-b">Profile/CV, inferences</td>
                  <td className="p-3 border-b"><strong>Contract</strong>; <strong>Legitimate interests</strong> in relevance</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Personalization & recommendations</td>
                  <td className="p-3 border-b">Usage, inferences</td>
                  <td className="p-3 border-b"><strong>Legitimate interests</strong>; <strong>Consent</strong> where required</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Communications & support</td>
                  <td className="p-3 border-b">Contact, messages</td>
                  <td className="p-3 border-b"><strong>Contract</strong>; <strong>Legitimate interests</strong></td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Analytics, service improvement, security</td>
                  <td className="p-3 border-b">Device, logs</td>
                  <td className="p-3 border-b"><strong>Legitimate interests</strong>; <strong>Legal obligation</strong> for security in some cases</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Marketing (non-essential)</td>
                  <td className="p-3 border-b">Contact, preferences</td>
                  <td className="p-3 border-b"><strong>Consent</strong> (EEA/UK). Outside the EEA/UK, you can opt out anytime via unsubscribe links or in-app settings.</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3">Compliance/fraud & legal requests</td>
                  <td className="p-3">Identifiers, logs, SPI where strictly necessary</td>
                  <td className="p-3"><strong>Legal obligation</strong>; <strong>Legitimate interests</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Legitimate interests:</strong> providing relevant opportunities, protecting platform integrity, and improving the Services.
            You may <strong>object</strong> at any time; see Rights below. For Sensitive Personal Information collected for compliance/background checks,
            we <strong>limit use</strong> to those purposes and provide controls on request at{" "}
            <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@sufoniq.com">privacy@sufoniq.com</a>.
          </p>
        </section>

        {/* AI & Profiling */}
        <section id="ai" className="space-y-4">
          <h2 className="text-2xl font-semibold">8) AI, Profiling & Human Oversight</h2>
          <p>
            We use machine learning to: (i) parse CVs and extract skills; (ii) align experience to role requirements;
            (iii) compute match scores; (iv) suggest destinations and relocation pathways.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Models are routinely evaluated for <strong>fairness, drift, and relevance</strong>; we monitor for disparate impact indicators.</li>
            <li>Outputs are <strong>assistive</strong>. Employers and Sufoniq staff make final decisions.</li>
            <li>Your rights: request <strong>human review</strong>, <strong>express your view</strong>, and <strong>contest</strong> a recommendation; you may <strong>object to profiling</strong> used for personalization.</li>
          </ul>
        </section>

        {/* Cookies */}
        <section id="cookies" className="space-y-4">
          <h2 className="text-2xl font-semibold">9) Cookies & Tracking</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>By default, we use <strong>essential</strong> cookies for authentication, security, and load-balancing.</li>
            <li><strong>Non-essential</strong> analytics/personalization cookies will operate only if we enable them and obtain your consent in the EEA/UK.</li>
            <li>You can manage preferences via our banner (when present) or your browser settings.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Unsure whether your current build sets any cookies? Open DevTools → Application/Storage → Cookies.
            If none appear beyond session/auth, you’re using essential-only at this time.
          </p>
        </section>

        {/* Sharing */}
        <section id="sharing" className="space-y-4">
          <h2 className="text-2xl font-semibold">10) Sharing & Disclosures</h2>
          <p>We do <strong>not</strong> sell or share PI for cross-context behavioral advertising. We disclose data as follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service providers (processors):</strong> cloud hosting, analytics (if enabled), support tooling, document parsing, background screening facilitators, and mobility partners—each under a Data Processing Agreement.</li>
            <li><strong>Employers & independent controllers:</strong> when you apply to a role or request introduction, the employer (or partner) becomes an independent controller; their notices govern their use.</li>
            <li><strong>Legal & safety:</strong> to comply with law, enforce terms, or protect rights, safety, or security.</li>
            <li><strong>Corporate events:</strong> in a merger, acquisition, or reorganization, we may transfer data subject to this policy and law.</li>
          </ul>
        </section>

        {/* International Transfers */}
        <section id="transfers" className="space-y-4">
          <h2 className="text-2xl font-semibold">11) International Transfers</h2>
          <p>
            If data is transferred outside the EEA/UK, we use <strong>Standard Contractual Clauses</strong> (and the <strong>UK IDTA</strong> where applicable),
            implement supplementary measures where required, and rely on adequacy decisions where available. You may request a copy of relevant safeguards.
          </p>
        </section>

        {/* Retention */}
        <section id="retention" className="space-y-4">
          <h2 className="text-2xl font-semibold">12) Retention</h2>
          <p>We keep personal data only as long as necessary for the purposes described or as required by law. Examples:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-3 border-b">Data</th>
                  <th className="text-left p-3 border-b">Typical retention</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="p-3 border-b">Account & profile</td>
                  <td className="p-3 border-b">Life of account + <strong>24 months</strong> of inactivity</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">CV/resumes & uploads</td>
                  <td className="p-3 border-b">Until deleted by you or after <strong>24 months</strong> inactivity</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Match & analytics events</td>
                  <td className="p-3 border-b"><strong>12–24 months</strong></td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">Support tickets</td>
                  <td className="p-3 border-b"><strong>36 months</strong></td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 border-b">System logs & security records</td>
                  <td className="p-3 border-b"><strong>12–24 months</strong></td>
                </tr>
                <tr className="align-top">
                  <td className="p-3">Compliance (e.g., KYC/AML docs, if applicable)</td>
                  <td className="p-3">As required by law</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">We periodically de-identify and aggregate data for metrics and product improvement.</p>
        </section>

        {/* Rights + Privacy Choices */}
        <section id="rights" className="space-y-4">
          <h2 className="text-2xl font-semibold">13) Your Rights & Privacy Choices</h2>
          <p><strong>EEA/UK:</strong> access, rectification, erasure, restriction, portability, objection, and rights related to automated decision-making.</p>
          <p><strong>US (CA, CO, CT, VA, UT):</strong> know/access, delete, correct, portability, opt-out of sale/share/targeted advertising, limit SPI, and <strong>appeal</strong> a rights decision (where applicable).</p>
          <p>
            <strong>Marketing choices:</strong> We send product/service emails necessary to operate the Services.
            Marketing emails are sent <strong>only with your consent</strong> in the EEA/UK. You can withdraw consent or opt out at any time via the unsubscribe link or by emailing{" "}
            <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@sufoniq.com">privacy@sufoniq.com</a>.
          </p>
          <p>
            <strong>SPI limits:</strong> Where we collect <strong>Sensitive Personal Information</strong> (e.g., national IDs for compliance or background checks),
            we limit its use to the specific purpose. For limits or questions, contact{" "}
            <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@sufoniq.com">privacy@sufoniq.com</a>.
          </p>
          <p>
            <strong>How to exercise rights:</strong> Email{" "}
            <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@sufoniq.com">privacy@sufoniq.com</a>.
            Expected timelines: <strong>1 month</strong> (GDPR; extendable by 2 months if complex) and <strong>45 days</strong> (CCPA/CPRA; extendable by 45 days where reasonable).
          </p>
        </section>

        {/* Inline Cookie List */}
        <section id="cookie-list" className="space-y-4">
          <h2 className="text-2xl font-semibold">14) Cookie List (current)</h2>
          <p className="text-sm text-muted-foreground">
            Below is our current cookie overview. If non-essential analytics are not enabled in your region, only essential cookies will appear.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-3 border-b">Provider</th>
                  <th className="text-left p-3 border-b">Purpose</th>
                  <th className="text-left p-3 border-b">Category</th>
                  <th className="text-left p-3 border-b">Retention</th>
                </tr>
              </thead>
              <tbody>
                <tr className="align-top">
                  <td className="p-3 border-b">First-party (session)</td>
                  <td className="p-3 border-b">Authentication/session continuity</td>
                  <td className="p-3 border-b">Essential</td>
                  <td className="p-3 border-b">Session</td>
                </tr>
                {/* Add vendors here if/when enabled (e.g., Google Analytics) */}
                {/* <tr>
                  <td className="p-3 border-b">Google Analytics</td>
                  <td className="p-3 border-b">Usage analytics (consent-based in EEA/UK)</td>
                  <td className="p-3 border-b">Analytics</td>
                  <td className="p-3 border-b">14 months</td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            To check your current build: DevTools → Application/Storage → Cookies.
          </p>
        </section>

        {/* Security */}
        <section id="security" className="space-y-4">
          <h2 className="text-2xl font-semibold">15) Security</h2>
          <p>
            We implement defense-in-depth controls: encryption in transit and at rest; role-based, least-privilege access;
            zero-trust network posture; vulnerability management and logging/monitoring; vendor due diligence; and incident response procedures.
            No system is perfectly secure; we cannot guarantee absolute security.
          </p>
        </section>

        {/* Changes */}
        <section id="changes" className="space-y-4">
          <h2 className="text-2xl font-semibold">16) Changes to this policy</h2>
          <p>
            We may update this policy from time to time. We will post the updated version with a new <strong>effective date</strong> and,
            if changes are material, provide a more prominent notice or obtain consent where required.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-4">
          <h2 className="text-2xl font-semibold">17) Contact Us</h2>
          <p>
            <strong>Data Protection Officer:</strong>{" "}
            <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@sufoniq.com">
              privacy@sufoniq.com
            </a>
          </p>
          <p><strong>Postal address:</strong> UAB Skillaxis (Sufoniq), Architektų g. 56-101, LT-04111, Vilnius, Lithuania</p>
          <p>
            <strong>Supervisory authority (EU):</strong> You have the right to lodge a complaint with your local authority.
            In Lithuania: State Data Protection Inspectorate (vdai.lrv.lt).
          </p>
          <p><strong>United States:</strong> For CPRA purposes, you may contact us at{" "}
            <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@sufoniq.com">privacy@sufoniq.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
