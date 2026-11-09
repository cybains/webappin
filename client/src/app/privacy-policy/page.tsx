import { createPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = {
  ...createPageMetadata("/privacy-policy", "Privacy Policy | Sufoniq", "How Sufoniq, operated by UAB Skillaxis, handles recruitment and business enquiries, sharing, retention and your privacy rights."),
  robots: { index: false, follow: true },
};
const privacyEmail = <a href="mailto:privacy@sufoniq.com">privacy@sufoniq.com</a>;
const sections = [["controller", "Who handles your data"], ["collection", "Information we receive"], ["purposes", "How we use it"], ["sharing", "Who receives it"], ["transfers", "International processing"], ["retention", "Retention"], ["cookies", "Website and external services"], ["security", "Security"], ["rights", "Your rights"], ["contact", "Contact and updates"]];

export default function PrivacyPolicyPage() {
  return (
    <main className={`${styles.page} sufoniq-page`}><div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>UAB Skillaxis · Sufoniq</p>
        <h1>Privacy policy</h1>
        <p className={styles.updated}>Last updated: November 9, 2026</p>
        <p className={styles.intro}>When you contact Sufoniq about hiring, finding work or our services, you share information with us. This policy explains what we use it for, who may receive it and how to exercise your privacy rights.</p>
      </header>
      <nav aria-label="Privacy policy sections" className={styles.navigation}><h2>In this policy</h2><ol>{sections.map(([id, title]) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol></nav>

      <section id="controller"><h2>1. Who handles your data</h2>
        <p>UAB Skillaxis operates Sufoniq and is the data controller for the enquiries and business communications described here. This means we decide why and how that information is used.</p>
        <dl className={styles.facts}>
          <div><dt>Company</dt><dd>UAB Skillaxis · company code 307395574</dd></div>
          <div><dt>Registered address</dt><dd>Architektų g. 56-101, LT-04111, Vilnius, Lithuania</dd></div>
          <div><dt>Privacy contact</dt><dd>{privacyEmail}</dd></div>
        </dl>
        <p id="scope">This policy covers this website and related recruitment and business correspondence, including email and messages you choose to send through WhatsApp. If an agreed service involves additional uses of your information, we explain those uses before that processing begins.</p>
        <p>Employers are responsible for their own hiring decisions and use of candidate information. Where we process information solely on a client’s documented instructions, the relevant service agreement defines that arrangement and the client’s privacy notice also applies.</p>
      </section>

      <section id="collection"><h2>2. Information we receive</h2>
        <ul>
          <li><strong>Contact details:</strong> your name, email address and any telephone number or other contact details you provide.</li>
          <li><strong>Recruitment enquiries:</strong> your trade, experience, preferred country and information you include about finding work.</li>
          <li><strong>Employer enquiries:</strong> your company, hiring country, role requirements, staffing numbers, timing and any training or qualification support you describe.</li>
          <li><strong>Correspondence and service records:</strong> messages, agreed requirements and information needed to respond or carry out agreed work. This may include a CV, employment history or qualification documents if you later provide them for that purpose.</li>
          <li><strong>Technical information:</strong> hosting and email providers may process IP addresses, browser information, delivery records and error or security logs to operate and protect their services.</li>
        </ul>
        <p id="sources">Most information comes directly from you. If an employer or another person provides your details for a recruitment enquiry, we explain the source and intended use when contacting you, unless a lawful exception applies. Only share another person’s information where you are entitled to do so.</p>
        <p id="notice">Required fields are marked on each form. Without the required contact and enquiry details, we may be unable to respond or assess your request. Other fields are optional. Initial enquiries do not require a passport, identity document, medical information or bank details; please do not include these in a general enquiry.</p>
        <p>Our recruitment services are not intended for children under 16. Contact our privacy email if you believe a child has supplied personal information.</p>
      </section>

      <section id="purposes"><h2>3. How and why we use it</h2>
        <p>We use information for the enquiry or work it relates to. The legal basis depends on the purpose and your relationship with us:</p>
        <ul>
          <li><strong>Responding to your individual service request:</strong> taking steps at your request before entering a contract, where necessary for that request (GDPR Article 6(1)(b)).</li>
          <li><strong>Handling employer and other business enquiries:</strong> our legitimate interest in responding to relevant enquiries, assessing requirements and maintaining business relationships (Article 6(1)(f)).</li>
          <li><strong>Providing agreed services:</strong> performing a contract with you where necessary (Article 6(1)(b)); for a client company’s representatives, our legitimate interest in administering that relationship (Article 6(1)(f)).</li>
          <li><strong>Introducing candidates:</strong> your consent before sharing candidate details with a prospective employer or recruitment partner (Article 6(1)(a)). We explain the proposed recipient and purpose first.</li>
          <li><strong>Protecting communications and handling disputes:</strong> our legitimate interest in preventing misuse, resolving complaints and establishing or defending legal claims (Article 6(1)(f)).</li>
          <li><strong>Keeping legally required records:</strong> compliance with applicable legal obligations, such as accounting obligations where a paid service is agreed (Article 6(1)(c)).</li>
        </ul>
        <p>Where we rely on legitimate interests, your interests and privacy rights must also be considered. You can object to that processing. Where we rely on consent, you can withdraw it at any time; this does not affect processing already carried out lawfully.</p>
        <p>Sending an enquiry does not subscribe you to marketing. We do not sell personal information or share it for targeted advertising.</p>
        <p id="ai"><strong>Human review:</strong> our website enquiry forms do not automatically score candidates, reject applications or make hiring decisions. A member of the team handles the enquiry; employers make their own hiring decisions.</p>
      </section>

      <section id="sharing"><h2>4. Who receives it</h2>
        <p>Information is used by team members who need it for your enquiry or agreed work, and by providers needed to run the website and communications.</p>
        <ul>
          <li><strong>Website and email providers:</strong> hosting services handle website requests, and Resend delivers form enquiries to our business mailbox. Our email service provider processes received messages and replies.</li>
          <li><strong>Prospective employers or recruitment partners:</strong> candidate information is shared only after you agree to the proposed introduction. Their own privacy information governs their subsequent independent use.</li>
          <li><strong>Professional advisers and authorities:</strong> relevant information may be disclosed where needed for an agreed service, a legal obligation or establishing or defending legal claims. Disclosure is limited to what is necessary for that purpose.</li>
        </ul>
        <p>Permission for a candidate introduction is separate from using service providers to deliver and store your enquiry.</p>
      </section>

      <section id="transfers"><h2>5. International processing</h2>
        <p>Some service providers process information outside the European Economic Area. Resend states that it stores data in the United States, including when an EU email-sending region is selected. Its standard data processing agreement includes EU Standard Contractual Clauses for international transfers.</p>
        <p>Read <a href="https://resend.com/security">Resend’s processing and security information</a> and <a href="https://resend.com/legal/dpa">data processing agreement</a>. Contact our privacy email for information about the recipients and transfer safeguards relevant to your enquiry or agreed service.</p>
        <p>If a proposed candidate introduction involves a recipient outside the EEA, we explain that recipient and the relevant transfer arrangements before sharing information. Agreeing to an introduction does not remove the requirement for lawful international transfers.</p>
      </section>

      <section id="retention"><h2>6. How long we keep it</h2>
        <p>We retain personal information only while it is needed for the purpose for which it was collected. The relevant criteria are:</p>
        <ul>
          <li>Whether an enquiry remains active and whether you have asked us to continue helping with hiring or finding work.</li>
          <li>Whether agreed work is ongoing and which records are needed to complete and account for it.</li>
          <li>Whether a record must be kept under an applicable legal obligation.</li>
          <li>Whether specific records are needed for an unresolved complaint, dispute or legal claim, and for how long that need continues.</li>
        </ul>
        <p>Once these purposes no longer apply, information is deleted or anonymised. A need to retain an invoice or agreement does not justify keeping every candidate document or message indefinitely. You can ask about retention of your records or request deletion; legal obligations and other applicable exceptions may affect what can be deleted.</p>
      </section>

      <section id="cookies"><h2>7. Website and external services</h2>
        <p id="cookie-list">Our public enquiry forms do not require an account or login. We do not use these forms to set advertising cookies or build advertising profiles. Hosting and security services may process technical request information to deliver and protect the website.</p>
        <p>You can manage cookies and other website storage through your browser settings. If we introduce optional cookie-based analytics or advertising, we will explain the relevant providers, purposes and durations and obtain consent where required before enabling them.</p>
        <p>WhatsApp buttons open an external service when you choose to use them. WhatsApp processes information under its own privacy terms, and we receive the contact details and messages you send us there. You can use our form or email instead. Other external links are subject to the destination’s privacy information.</p>
      </section>

      <section id="security"><h2>8. Protecting your information</h2>
        <p>We use personal information for the business purposes described here and limit access to people who need it for those purposes. We use service providers to deliver and store communications. Send only what is needed for your enquiry; if further documents are necessary, we explain what is needed and how to provide them.</p>
        <p>No online service can guarantee absolute security. If you believe information has been sent to the wrong person or otherwise exposed, contact our privacy email so we can investigate.</p>
      </section>

      <section id="rights"><h2>9. Your rights</h2>
        <p>Under the GDPR, subject to its conditions and exceptions, you can:</p>
        <ul>
          <li>Ask whether we hold your personal information and request access to it.</li>
          <li>Ask us to correct inaccurate or incomplete information.</li>
          <li>Request deletion or restriction of processing.</li>
          <li>Object to processing based on legitimate interests, including direct marketing.</li>
          <li>Request a portable copy where processing is automated and based on consent or a contract.</li>
          <li>Withdraw consent and exercise applicable rights concerning solely automated decisions.</li>
        </ul>
        <p>Email {privacyEmail} to make a request. We may ask for proportionate information to verify your identity, so we do not disclose information to the wrong person. Do not send identity documents unless we explain why they are necessary.</p>
        <p>We respond without undue delay and normally within one month. Where the GDPR permits an extension of up to two further months because of the complexity or number of requests, we explain the reason within the first month. If we cannot fulfil a request, we explain why and the available complaint options.</p>
        <p>You can complain to a competent data protection authority, including the <a href="https://vdai.lrv.lt/en/">Lithuanian State Data Protection Inspectorate</a>, or the authority where you live or work. You do not have to contact us first.</p>
        <p>Where other privacy laws apply, including UK or US state privacy laws, you may have additional rights to access, correct, delete or obtain your information, limit certain uses, opt out or appeal a decision. Contact us to exercise any applicable right. We do not discriminate against you for exercising privacy rights.</p>
      </section>

      <section id="contact"><h2>10. Contact and updates</h2>
        <p><strong>Privacy contact:</strong> {privacyEmail}</p>
        <p>You can also write to UAB Skillaxis, Architektų g. 56-101, LT-04111, Vilnius, Lithuania, with “Privacy request” in the correspondence.</p>
        <p id="changes">We update this policy when our processing changes. The date at the top identifies the latest revision. Where required, we provide a separate notice or seek consent before a new use of your information.</p>
      </section>
    </div></main>
  );
}
