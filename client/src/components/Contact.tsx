import {contactHref} from "@/lib/i18n/shared";
import { getTranslator } from '@/lib/i18n/server';
import type { Locale } from '@/lib/i18n/shared';
import WorkforceEnquiryForm from "./WorkforceEnquiryForm";

export default function Contact({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <section id="contact" className="relative z-10 px-6 py-12 md:px-8 md:py-16 scroll-mt-24 text-foreground" aria-labelledby="contact-title">
      <div className="max-w-6xl mx-auto grid gap-8 lg:gap-12 lg:grid-cols-2 items-start">
        <div className="space-y-5">
          <p className="sufoniq-meta-label">{t("Talk to us")}</p>
          <h2 id="contact-title" className="max-w-xl text-3xl md:text-4xl font-semibold leading-tight tracking-tight">{t("Bring us one hard-to-fill role.")}</h2>
          <p className="text-base sufoniq-body-text">{t("Send the job description—or just tell us the role, location and target start date. We’ll discuss where the search is getting stuck, how we can support it and what a sensible first action looks like.")}</p>
          <div className="space-y-3 border-t border-[color:var(--card-border)] pt-5">
            <h3 className="text-base font-semibold">{t("What you get from the first conversation")}</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm sufoniq-body-text">
              <li>{t("A discussion of what is making the role hard to fill: candidate reach, requirements, terms or the steps to starting work.")}</li>
              <li>{t("A clear explanation of where Sufoniq can contribute alongside your team or existing recruiter.")}</li>
              <li>{t("A proposed next action. Any delivery work, responsibilities and costs are agreed in writing before work begins.")}</li>
            </ol>
          </div>
          <p className="text-sm sufoniq-body-text">{t("Prefer a direct conversation? Email ")}<a href={contactHref("mailto:support@sufoniq.com",locale,t)} className="font-semibold text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{t("support@sufoniq.com")}</a> {t("or ")}<a href={contactHref("https://wa.me/420778604430",locale,t)} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{t("contact us on WhatsApp")}</a>.</p>
          <p className="text-xs text-muted-foreground">{t("UAB Skillaxis · Architektų g. 56-101, LT-04111 Vilnius, Lithuania")}</p>
        </div>
        <WorkforceEnquiryForm />
      </div>
    </section>
  );
}
