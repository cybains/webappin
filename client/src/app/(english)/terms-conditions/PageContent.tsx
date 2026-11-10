import {getTranslator} from '@/lib/i18n/server';
import type {Locale} from '@/lib/i18n/shared';
import Link from "@/components/LocalizedLink";

import styles from "../privacy-policy/page.module.css";



const sections = [
  ["who-we-are", "Who we are and when terms apply"],
  ["services", "Agreeing the work"],
  ["plans-payments", "Fees and payment"],
  ["responsibilities", "Responsibilities and decisions"],
  ["privacy", "Information and confidentiality"],
  ["acceptable-use", "Using the website"],
  ["termination", "Changing or ending agreed work"],
  ["consumer-rights", "Consumer rights"],
  ["liability", "Responsibility for loss"],
  ["law", "Complaints and governing law"],
  ["changes", "Changes to these terms"],
  ["contact", "Contact"],
];
const contact = <a href="mailto:support@sufoniq.com">support@sufoniq.com</a>;

export default function TermsAndConditionsPage({locale="en"}:{locale?:Locale}) {
  const t=getTranslator(locale);
  return (
    <main className={`${styles.page} sufoniq-page`}><div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{t("UAB Skillaxis · Sufoniq")}</p>
        <h1>{t("Terms and conditions")}</h1>
        <p className={styles.updated}>{t("Last updated: ")}<time dateTime="2026-11-09">{t("November 9, 2026")}</time></p>
        <p className={styles.intro}>{t("Your enquiry starts a conversation. Recruitment work, responsibilities and any employer fees are agreed in writing before delivery begins. These terms explain the basis for using our website and arranging support.")}</p>
      </header>
      <nav aria-label={t("Terms and conditions sections")} className={styles.navigation}>
        <h2>{t("In these terms")}</h2>
        <ol>{sections.map(([id, title]) => <li key={id}><a href={`#${id}`}>{t(title)}</a></li>)}</ol>
      </nav>

      <section id="who-we-are"><h2>{t("1. Who we are and when terms apply")}</h2>
        <p>{t("Sufoniq is operated by UAB Skillaxis, company code 307395574, registered at Architektų g. 56-101, LT-04111, Vilnius, Lithuania. References to “we” or “us” mean UAB Skillaxis.")}</p>
        <p>{t("These terms describe use of sufoniq.com and the general basis on which we arrange recruitment and related preparation services. Sending a form, email or WhatsApp message does not create a paid engagement, reserve candidates or commit either side to proceed.")}</p>
        <p>{t("A service engagement is formed when we and the client accept a written proposal or service agreement. We provide the applicable terms before agreement. That document takes priority over these general terms where they differ, subject to mandatory law. Employers and job seekers have different responsibilities; provisions expressly concerning employer fees apply to the contracting business.")}</p>
        <p id="eligibility">{t("If you agree work on behalf of a company, you must have authority to do so. Individuals entering a service agreement must have the legal capacity to enter it.")}</p>
      </section>

      <section id="services"><h2>{t("2. Agreeing the work")}</h2>
        <p>{t("Depending on the agreed brief, support may include candidate sourcing and screening, recruitment coordination, preparation for an employment start, or identifying qualification requirements for a role and destination.")}</p>
        <p>{t("Before work begins, the written agreement identifies:")}</p>
        <ul>
          <li>{t("The role or candidate situation, destination and work included.")}</li>
          <li>{t("What you will receive and which checks we will carry out.")}</li>
          <li>{t("Each party’s responsibilities, required information and external dependencies.")}</li>
          <li>{t("Any indicative milestones, fees, payment triggers, taxes and agreed expenses.")}</li>
          <li>{t("How changes, cancellation and any agreed replacement arrangements will be handled.")}</li>
        </ul>
        <p>{t("Website examples illustrate our approach; they are not offers of a particular candidate, job, permit or start date. Country-specific requirements and suitability are assessed for the actual engagement.")}</p>
      </section>

      <section id="plans-payments"><h2>{t("3. Fees and payment")}</h2>
        <p><strong>{t("Sufoniq does not charge job seekers.")}</strong> {t("Our recruitment fee model is employer-funded. Separate authority or third-party costs, such as visa, translation or examination fees, may apply; we discuss relevant costs and who pays them before agreeing work.")}</p>
        <p>{t("Employer fees are individually quoted. The written agreement states the amount or calculation method, applicable taxes, due dates, the work or milestone that triggers payment and any approved expenses. Costs outside that agreement require further agreement.")}</p>
        <p>{t("A request for information does not authorise a charge. There is no website checkout or automatically renewing subscription. Refunds and cancellation charges depend on the agreed service terms and applicable law; these terms do not impose a blanket non-refundable-fee rule.")}</p>
      </section>

      <section id="responsibilities"><h2>{t("4. Responsibilities and decisions")}</h2>
        <p>{t("We carry out the agreed work with reasonable care and skill. Our screening is limited to the checks described in the proposal and the evidence available; we distinguish what has been checked from what remains unresolved.")}</p>
        <ul>
          <li><strong>{t("Employers")}</strong> {t("provide accurate role requirements, lawful employment terms and timely decisions. They retain responsibility for selection, employment contracts and their legal duties as employers.")}</li>
          <li><strong>{t("Candidates")}</strong> {t("provide accurate information and genuine documents, confirm their interest and availability, and tell us about material changes.")}</li>
          <li><strong>{t("Authorities and relevant professional bodies")}</strong> {t("decide on permits, visas, recognition, registration and licensing. Professional advice is provided by an appropriately authorised adviser where required and separately arranged.")}</li>
        </ul>
        <p>{t("We do not guarantee a hire, a job offer, approval by an authority, recognition of a qualification or a particular arrival date. Any estimated timeline depends on the identified requirements and third-party decisions. This does not remove our responsibility for our own agreed work.")}</p>
        <p>{t("A candidate must not start work before the required authorisations are in place. Recruitment coordination does not itself authorise employment or professional practice.")}</p>
      </section>

      <section id="privacy"><h2>{t("5. Information and confidentiality")}</h2>
        <p>{t("Our ")}<Link locale={locale} href="/privacy-policy">{t("privacy policy")}</Link> {t("explains how we handle enquiries, service information, disclosures and privacy requests. It is a notice about data processing, not a request to waive privacy rights.")}</p>
        <p>{t("We do not share candidate details with prospective employers or recruitment partners before the candidate agrees to the proposed introduction. Service providers used to deliver and store communications are described separately in the privacy policy.")}</p>
        <p>{t("Use candidate and business information only for the recruitment or service purpose for which it was supplied. Do not publish candidate documents or disclose confidential information to people who have no need or lawful basis to receive it. This does not prevent disclosures required by law or protected reporting.")}</p>
        <p id="your-content">{t("You retain your rights in the information and documents you provide. Providing them permits the handling needed for the requested or agreed service, subject to the privacy policy and applicable law; it does not give us an unrestricted right to publish or reuse them.")}</p>
        <p>{t("If an engagement requires us to process personal data solely on a business client’s instructions, the parties must put the required data processing agreement in place before that processing begins. We do not represent that an unpublished standard DPA is already part of every engagement.")}</p>
      </section>

      <section id="acceptable-use"><h2>{t("6. Using the website")}</h2>
        <p>{t("Use the website and enquiry channels lawfully. Do not impersonate another person, send fraudulent documents, disclose information you are not entitled to share, introduce malware, interfere with the website or attempt unauthorised access.")}</p>
        <p id="export">{t("We cannot undertake work prohibited by applicable sanctions, immigration, employment or other law. Any required eligibility checks are considered for the actual parties and engagement.")}</p>
        <p id="ip">{t("Website text, design, software and branding belong to UAB Skillaxis or the relevant rights holders. You may read, link to and share links to our public pages, including for internal assessment of our services. Other reuse must respect applicable intellectual property rights and any permission given.")}</p>
        <p>{t("The website may occasionally be unavailable. Links to authorities and other services are provided for reference; those organisations control their own websites and decisions. An external link does not itself establish a partnership.")}</p>
      </section>

      <section id="termination"><h2>{t("7. Changing or ending agreed work")}</h2>
        <p>{t("Contact us if requirements change or you want to pause or end an engagement. Changes to scope, fees or responsibilities must be agreed in writing. A new version of this website does not alter an existing service agreement.")}</p>
        <p>{t("For business engagements, notice periods, payment for completed work, approved external costs, refunds and any replacement arrangements are set out in the written agreement. No replacement guarantee is implied unless expressly agreed.")}</p>
        <p>{t("We may decline an enquiry or stop work that would be unlawful. Any suspension or termination of agreed work, including for non-payment or missing information, is handled under the service agreement and applicable law. We explain the reason and practical next steps where lawful to do so.")}</p>
        <p>{t("Ending an engagement does not remove accrued lawful payment obligations, confidentiality duties or privacy rights. Information is handled according to the privacy policy and applicable retention requirements.")}</p>
      </section>

      <section id="consumer-rights"><h2>{t("8. Consumer rights")}</h2>
        <p>{t("A consumer is an individual acting outside their trade or profession. Mandatory consumer rights are preserved. Our job-seeker support is free of Sufoniq charges; the following paid-service provisions apply only if a separate paid consumer service is lawfully offered and agreed.")}</p>
        <p>{t("For a covered distance service contract, the usual withdrawal period is 14 days from conclusion of the contract. Before agreeing such a service, we provide the applicable information, withdrawal instructions and model withdrawal form. You can withdraw by sending an unambiguous statement to ")}{contact} {t("or our postal address; using the model form is optional.")}</p>
        <p>{t("Starting a service during that period requires your express request. If you then withdraw, a proportionate payment for work already supplied may be due only where the legal conditions have been met. For a paid service, loss of the withdrawal right on full performance requires the prior express consent and acknowledgement required by law. Reading this page or making an enquiry does not give that consent.")}</p>
        <p>{t("Where a withdrawal refund is due, it is made without undue delay and within the applicable statutory deadline, normally 14 days after notification, using the original payment method unless otherwise expressly agreed and without a refund fee. These terms do not restrict other remedies available under consumer law.")}</p>
      </section>

      <section id="liability"><h2>{t("9. Responsibility for loss")}</h2>
        <p>{t("Each party remains responsible for its obligations under the agreed service and applicable law. A third party’s decision is not a promised outcome, but its involvement does not automatically excuse a failure in our own work.")}</p>
        <p>{t("Any business-specific liability limit or allocation of risk must be set out in the written service agreement and is subject to applicable law. This website does not impose an automatic fee-based liability cap or a general duty for clients to indemnify us against every claim.")}</p>
        <p>{t("Nothing in these terms excludes or limits liability where doing so would be unlawful, including liability for fraud or intentional misconduct, or removes mandatory consumer rights and remedies. Any unenforceable provision applies only to the extent permitted by law.")}</p>
      </section>

      <section id="law"><h2>{t("10. Complaints and governing law")}</h2>
        <p>{t("Send complaints to ")}{contact}{t(", explaining the issue and the resolution you seek. We review consumer complaints without charge and provide a reasoned written response within 14 days where Lithuanian consumer complaint rules apply.")}</p>
        <p>{t("If a consumer complaint remains unresolved, you may apply to the ")}<a href="https://vvtat.lrv.lt/en/how-to-submit-a-request/">{t("Lithuanian State Consumer Rights Protection Authority")}</a> {t("where it has jurisdiction, or another competent dispute-resolution body. Access to the courts and mandatory consumer protections remains unaffected.")}</p>
        <p>{t("These general terms are governed by Lithuanian law. This choice does not deprive consumers of mandatory protections applicable in their country of habitual residence. Business dispute arrangements are specified in the service agreement; consumer jurisdiction rights are not restricted by these terms.")}</p>
      </section>

      <section id="changes"><h2>{t("11. Changes to these terms")}</h2>
        <p>{t("The date above identifies this version. Updates apply to future use and future agreements; they do not retrospectively change agreed work. Changes to an existing engagement require the agreement or lawful procedure specified in that engagement.")}</p>
      </section>

      <section id="contact"><h2>{t("12. Contact")}</h2>
        <p><strong>{t("Service enquiries and complaints:")}</strong> {contact}</p>
        <p><strong>{t("Privacy requests:")}</strong> <a href="mailto:privacy@sufoniq.com">privacy@sufoniq.com</a></p>
        <p><strong>{t("Postal address:")}</strong> {t("UAB Skillaxis, Architektų g. 56-101, LT-04111, Vilnius, Lithuania.")}</p>
      </section>
    </div></main>
  );
}
