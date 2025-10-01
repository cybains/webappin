import type { Metadata } from "next";

const LAST_UPDATED = "September 20, 2023";

export const metadata: Metadata = {
  title: "Terms & Conditions | Inquos",
  description:
    "Review the terms that govern your use of Inquos' relocation intelligence platform and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-backgroundLight text-textLight dark:bg-backgroundDark dark:text-textDark py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-[var(--accent)]">Terms & Conditions</p>
          <h1 className="text-4xl font-bold">Ground Rules for a Future-Proof Relocation Experience</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            These terms govern your access to the Inquos platform, our AI-augmented relocation tools,
            and partner services. By creating an account or using our site, you agree to these
            conditions, so please read them carefully.
          </p>
        </header>

        <nav aria-label="Terms and conditions sections" className="bg-background/60 border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Jump to a section</h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm">
            <li><a className="hover:underline" href="#eligibility">Eligibility & Accounts</a></li>
            <li><a className="hover:underline" href="#responsibilities">User Responsibilities</a></li>
            <li><a className="hover:underline" href="#services">Services & Availability</a></li>
            <li><a className="hover:underline" href="#ip">Intellectual Property</a></li>
            <li><a className="hover:underline" href="#ai-disclaimer">AI & Automation</a></li>
            <li><a className="hover:underline" href="#liability">Limitations of Liability</a></li>
            <li><a className="hover:underline" href="#termination">Termination</a></li>
            <li><a className="hover:underline" href="#governing-law">Governing Law & Contact</a></li>
          </ul>
        </nav>

        <section id="eligibility" className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Eligibility & Accounts</h2>
          <p>
            You must be at least 18 and legally able to enter binding agreements to use Inquos. Keep
            your account credentials confidential and notify us immediately if you suspect unauthorized
            use. We reserve the right to decline or deactivate accounts that violate these terms or
            applicable laws.
          </p>
        </section>

        <section id="responsibilities" className="space-y-4">
          <h2 className="text-2xl font-semibold">2. User Responsibilities</h2>
          <p>
            Provide accurate information, respect other community members, and comply with immigration
            and employment regulations in your destination country. Do not misuse the platform for
            unlawful activity, reverse engineer our services, or deploy malicious code.
          </p>
        </section>

        <section id="services" className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Services & Availability</h2>
          <p>
            We strive for 24/7 uptime, but maintenance windows, beta features, or third-party outages
            may interrupt access. We may modify or discontinue features at any time. Premium features or
            partner offerings may carry additional terms or fees disclosed at the time of engagement.
          </p>
        </section>

        <section id="ip" className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Intellectual Property</h2>
          <p>
            All platform content, branding, algorithms, and curated datasets belong to Inquos or our
            licensors. You retain ownership of content you upload but grant us a license to host,
            process, and display it as needed to operate the services. Do not remove proprietary notices
            or use our marks without permission.
          </p>
        </section>

        <section id="ai-disclaimer" className="space-y-4">
          <h2 className="text-2xl font-semibold">5. AI & Automation Disclaimer</h2>
          <p>
            Recommendations and insights may be generated using machine learning models. While we test
            for accuracy and fairness, outputs may not account for every personal circumstance. Treat AI
            suggestions as guidance, not legal or financial advice. Engage professional advisors before
            making high-stakes decisions.
          </p>
        </section>

        <section id="liability" className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Limitations of Liability</h2>
          <p>
            To the maximum extent allowed by law, Inquos and its partners are not liable for indirect,
            incidental, or consequential damages arising from your use of the platform. Our total
            liability for any claim is limited to the fees paid for the relevant services during the
            preceding 12 months.
          </p>
        </section>

        <section id="termination" className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Termination</h2>
          <p>
            You may close your account at any time through settings or by contacting support. We may
            suspend or terminate access for policy violations, security risks, or inactivity. Upon
            termination, certain obligations—such as confidentiality, IP rights, and payment terms—will
            continue to apply.
          </p>
        </section>

        <section id="governing-law" className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Governing Law & Contact</h2>
          <p>
            These terms are governed by the laws of Estonia, without regard to conflict-of-law
            principles. Any disputes will be resolved in the courts of Tallinn, Estonia, unless another
            jurisdiction is mandated by applicable law. Questions? Email
            {" "}
            <a className="text-[var(--accent)] hover:underline" href="mailto:legal@inquos.com">
              legal@inquos.com
            </a>
            {" "}
            or write to Inquos Legal, 123 Futureproof Lane, Tallinn, Estonia.
          </p>
        </section>
      </div>
    </main>
  );
}
