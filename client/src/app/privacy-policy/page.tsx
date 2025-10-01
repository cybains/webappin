import type { Metadata } from "next";

const LAST_UPDATED = "September 20, 2023";

export const metadata: Metadata = {
  title: "Privacy Policy | Inquos",
  description:
    "Learn how Inquos collects, uses, and protects personal data across our digital relocation platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-[var(--accent)]">Privacy Policy</p>
          <h1 className="text-4xl font-bold">Modern Data Practices for Global Talent</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Inquos empowers professionals to navigate global opportunities through a tech-forward
            platform. This privacy policy explains how we collect, safeguard, and leverage data to
            deliver personalized experiences across AI-powered workflows, analytics, and
            cross-border services.
          </p>
        </header>

        <nav aria-label="Privacy policy sections" className="bg-background/60 border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Jump to a section</h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm">
            <li><a className="hover:underline" href="#data-collection">Data Collection & Sources</a></li>
            <li><a className="hover:underline" href="#usage">How We Use Your Data</a></li>
            <li><a className="hover:underline" href="#analytics">AI & Analytics</a></li>
            <li><a className="hover:underline" href="#cookies">Cookies & Tracking</a></li>
            <li><a className="hover:underline" href="#sharing">Third-Party Sharing</a></li>
            <li><a className="hover:underline" href="#security">Security & Storage</a></li>
            <li><a className="hover:underline" href="#rights">Your Rights</a></li>
            <li><a className="hover:underline" href="#contact">Contact Us</a></li>
          </ul>
        </nav>

        <section id="data-collection" className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Data Collection & Sources</h2>
          <p>
            We gather information directly from you when you create an account, upload a CV, request
            relocation insights, or interact with our support team. We also collect data automatically
            through device signals, usage patterns, cookies, and location preferences. Where legally
            permissible, we enrich your profile with publicly available professional data and licensed
            third-party datasets to surface relevant opportunities.
          </p>
        </section>

        <section id="usage" className="space-y-4">
          <h2 className="text-2xl font-semibold">2. How We Use Your Data</h2>
          <p>
            Personal data enables us to deliver cross-border job matches, immigration guidance, and
            localized market intelligence. We use your information to authenticate accounts, optimize
            platform performance, localize content, and fulfill contractual obligations. Automated
            decision support may suggest roles or pathways; however, final decisions rest with human
            reviewers and partner employers.
          </p>
        </section>

        <section id="analytics" className="space-y-4">
          <h2 className="text-2xl font-semibold">3. AI & Analytics</h2>
          <p>
            We deploy machine learning to analyze skills, career trajectories, and destination
            requirements. Models are routinely evaluated for fairness, bias, and relevance. We never
            sell personal data, and anonymized insights are used only to improve services and inform
            aggregate reporting.
          </p>
        </section>

        <section id="cookies" className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Cookies & Tracking Technologies</h2>
          <p>
            Cookies, pixels, and device identifiers help us remember your preferences, keep sessions
            secure, and measure feature adoption. You can adjust cookie preferences in-app or within
            your browser. Essential cookies are required for core functionality, while analytics and
            personalization cookies are optional.
          </p>
        </section>

        <section id="sharing" className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Third-Party Integrations & Sharing</h2>
          <p>
            We collaborate with vetted partners—including visa specialists, background-check providers,
            and mobility services—to deliver a seamless relocation experience. Data is shared only when
            necessary, under strict contracts, and with transparent consent. We may disclose information
            to comply with legal obligations or safeguard the rights and safety of our users and
            platform.
          </p>
        </section>

        <section id="security" className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Security & Storage</h2>
          <p>
            Inquos applies encryption in transit and at rest, zero-trust access controls, and continuous
            monitoring to protect your data. We store information within regions aligned to regulatory
            requirements and retain personal data only for as long as needed to provide our services or
            satisfy legal obligations.
          </p>
        </section>

        <section id="rights" className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Your Rights & Choices</h2>
          <p>
            Depending on your location, you may access, correct, port, or delete personal data, and
            object to automated processing. GDPR, CCPA, and similar frameworks empower you to withdraw
            consent and lodge complaints with your supervisory authority. Submit requests through the
            in-app privacy dashboard or by contacting us directly.
          </p>
        </section>

        <section id="contact" className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
          <p>
            Questions or concerns? Email our Data Protection Officer at
            {" "}
            <a className="text-[var(--accent)] hover:underline" href="mailto:privacy@inquos.com">
              privacy@inquos.com
            </a>
            {" "}
            or write to Inquos Privacy, 123 Futureproof Lane, Tallinn, Estonia.
          </p>
        </section>
      </div>
    </main>
  );
}
