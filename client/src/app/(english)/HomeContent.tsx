import { getTranslator } from '@/lib/i18n/server';
import type { Locale } from '@/lib/i18n/shared';
import { homepageSchema } from "@/lib/homepage-schema";


import Link from "@/components/LocalizedLink";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import HiringDetails from "@/components/HiringDetails";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import HomepageMap from "@/components/HomepageMap";
import HeroMapLegend from "@/components/HeroMapLegend";

const sectionSpacing = "relative z-10 px-6 py-12 md:px-8 md:py-16 scroll-mt-24";

function HiringExample({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <section id="hiring-example" className={sectionSpacing} aria-labelledby="example-title">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="sufoniq-meta-label">{t("Illustrative hiring example")}</p>
          <h2 id="example-title" className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{t("Start with the vacancy that is holding you back.")}</h2>
          <p className="sufoniq-body-text">{t("Suppose local advertising hasn’t brought the people you need. Before widening the search, we work through the job, the terms and what candidates need to bring. That gives sourcing and screening a clear brief.")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <article className="space-y-3 border-t border-[color:var(--card-border)] pt-5"><h3 className="text-lg font-semibold leading-snug">{t("Make the requirement specific")}</h3><p className="text-sm sufoniq-body-text">{t("Separate essential skills from preferences. Clarify pay, shifts and location so candidates understand the job before entering your interview process.")}</p></article>
          <article className="space-y-3 border-t border-[color:var(--card-border)] pt-5"><h3 className="text-lg font-semibold leading-snug">{t("Agree what screening must establish")}</h3><p className="text-sm sufoniq-body-text">{t("Set the skills evidence and language criteria, then identify the qualification and right-to-work checks relevant to each candidate.")}</p></article>
          <article className="space-y-3 border-t border-[color:var(--card-border)] pt-5"><h3 className="text-lg font-semibold leading-snug">{t("Prepare for the move to work")}</h3><p className="text-sm sufoniq-body-text">{t("Identify the document and permit actions, who owns them and what affects timing. Keep those actions connected to interviews, offers and your planned start.")}</p></article>
        </div>
        <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 underline underline-offset-4">{t("Discuss your hiring requirement ")}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function Services({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <section id="services" className={`${sectionSpacing}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="sufoniq-meta-label">{t("Recruitment that starts with your vacancy")}</p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
            {t("You need people who fit the work—and a plan to get them started.")}</h2>
          <p className="text-sm md:text-base sufoniq-body-text">
            {t("An open role can leave your team covering shifts, waiting on a project or reviewing applications that miss the mark. We help you widen the search, assess candidates against the work and prepare the steps behind an international hire.")}</p>
          <p className="text-sm sufoniq-body-text"><strong className="font-semibold text-foreground">{t("Roles we focus on:")}</strong> {t("skilled trades, professional driving, hospitality and industrial work—including electricians, welders, truck and bus drivers, cooks, chefs, CNC operators and maintenance technicians.")}</p>
          <p className="text-sm sufoniq-body-text">{t("Hiring for a different role? Tell us the requirement. We’ll discuss how our support fits your search.")}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="sufoniq-card">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">{t("When the local search comes up short")}</p>
            <h3 className="text-lg font-semibold mb-2">{t("Find candidates beyond your local market")}</h3>
            <p className="text-sm sufoniq-body-text">
              {t("Review the role, pay and location together, distinguish essential skills from preferences, and agree where to reach suitable candidates internationally.")}</p>
          </div>
          <div className="sufoniq-card">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">{t("When reviewing CVs isn’t enough")}</p>
            <h3 className="text-lg font-semibold mb-2">{t("Screen for the work you need done")}</h3>
            <p className="text-sm sufoniq-body-text">
              {t("Give screening clear criteria: the experience, skills and language needed for the job. Bring relevant evidence and unanswered questions into your hiring decision.")}</p>
          </div>
          <div className="sufoniq-card">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">{t("When an accepted offer is only the beginning")}</p>
            <h3 className="text-lg font-semibold mb-2">{t("Prepare the steps behind the start date")}</h3>
            <p className="text-sm sufoniq-body-text">
              {t("Coordinate the agreed document, permit and qualification work alongside your hiring process. Give each action an owner so your team and the candidate know what happens next.")}</p>
          </div>
        </div>
        <div className="max-w-3xl border-t border-[color:var(--card-border)] pt-5"><h3 className="text-base font-semibold">{t("Keep your team. Add support where it helps.")}</h3><p className="mt-2 text-sm sufoniq-body-text">{t("Already working with an internal recruiter or an agency? We can agree a defined part of the work—sourcing, screening or mobility coordination—alongside your existing process. You retain the hiring decision.")}</p></div>
        <div className="flex flex-wrap gap-5 text-sm font-semibold"><a href="#contact" className="text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{t("Discuss a role →")}</a><Link locale={locale} href="/employers" className="text-slate-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{t("Explore employer support")}</Link></div>
      </div>
    </section>
  );
}

function CompanySection({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <section id="company" className={sectionSpacing} aria-labelledby="company-title">
      <div className="mx-auto max-w-6xl sufoniq-card space-y-4">
        <p className="sufoniq-meta-label">{t("Who you are dealing with")}</p>
        <h2 id="company-title" className="text-3xl md:text-4xl font-semibold">{t("Sufoniq. Recruitment and mobility, together.")}</h2>
        <p className="max-w-3xl text-base sufoniq-body-text">{t("Sufoniq is operated by UAB Skillaxis, headquartered in Vilnius, with management in Vienna and recruitment and operations in the Czech Republic. We support cross-border recruitment and mobility in Europe.")}</p>
        <ul className="flex flex-wrap gap-2" aria-label={t("Company facts")}>
          <li className="inline-flex w-fit items-center rounded-full border border-black/10 bg-background/50 px-3 py-1 text-xs text-muted-foreground">{t("Registered in Lithuania (UAB Skillaxis) · company code 307395574")}</li>
          <li className="inline-flex w-fit items-center rounded-full border border-black/10 bg-background/50 px-3 py-1 text-xs text-muted-foreground">{t("Operated from Vienna, Austria")}</li>
          <li className="inline-flex w-fit items-center rounded-full border border-black/10 bg-background/50 px-3 py-1 text-xs text-muted-foreground">{t("Scope and costs agreed in writing")}</li>
        </ul>
        <p className="max-w-3xl text-sm sufoniq-body-text">{t("Your hiring decision stays with you. We agree the work, responsibilities and costs in writing before delivery begins.")}</p>
        <Link locale={locale} href="/about" className="inline-flex text-sm font-semibold text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{t("About Sufoniq →")}</Link>
      </div>
    </section>
  );
}

export default function Home({locale = "en"}: {locale?: Locale}) {
  return (
    <main className="relative isolate min-h-screen bg-background text-foreground">
      {locale === "en" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema).replace(/</g, "\\u003c") }} />}
      <div className="absolute left-0 top-0 -z-10 h-screen w-full pointer-events-none"><HomepageMap /></div>
      <div id="hero" className="relative z-10 bg-transparent"><Hero locale={locale} /></div>
      <HeroMapLegend locale={locale} />
      <StructuralGridBand>
        <Services locale={locale} />
        <HiringExample locale={locale} />
        <CompanySection locale={locale} />
        <Contact locale={locale} />
        <HiringDetails locale={locale} />
      </StructuralGridBand>
    </main>
  );
}
