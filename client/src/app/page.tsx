import { createPageMetadata } from "@/lib/seo";
import { homepageSchema } from "@/lib/homepage-schema";
export const metadata = createPageMetadata("/", "Recruitment for Hard-to-Fill Roles in Europe | Sufoniq", "Struggling to hire locally? Sufoniq connects international recruitment with permit, document and start-date coordination. Tell us about your role.");

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import HiringDetails from "@/components/HiringDetails";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import HomepageMap from "@/components/HomepageMap";
import HeroMapLegend from "@/components/HeroMapLegend";

const sectionSpacing = "relative z-10 px-6 py-12 md:px-8 md:py-16 scroll-mt-24";

function HiringExample() {
  return (
    <section id="hiring-example" className={sectionSpacing} aria-labelledby="example-title">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="sufoniq-meta-label">Illustrative hiring example</p>
          <h2 id="example-title" className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Start with the vacancy that is holding you back.</h2>
          <p className="sufoniq-body-text">Suppose local advertising hasn’t brought the people you need. Before widening the search, we work through the job, the terms and what candidates need to bring. That gives sourcing and screening a clear brief.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          <article className="space-y-3 border-t border-[color:var(--card-border)] pt-5"><h3 className="text-lg font-semibold leading-snug">Make the requirement specific</h3><p className="text-sm sufoniq-body-text">Separate essential skills from preferences. Clarify pay, shifts and location so candidates understand the job before entering your interview process.</p></article>
          <article className="space-y-3 border-t border-[color:var(--card-border)] pt-5"><h3 className="text-lg font-semibold leading-snug">Agree what screening must establish</h3><p className="text-sm sufoniq-body-text">Set the skills evidence and language criteria, then identify the qualification and right-to-work checks relevant to each candidate.</p></article>
          <article className="space-y-3 border-t border-[color:var(--card-border)] pt-5"><h3 className="text-lg font-semibold leading-snug">Prepare for the move to work</h3><p className="text-sm sufoniq-body-text">Identify the document and permit actions, who owns them and what affects timing. Keep those actions connected to interviews, offers and your planned start.</p></article>
        </div>
        <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 underline underline-offset-4">Discuss your hiring requirement <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className={`${sectionSpacing}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="sufoniq-meta-label">Recruitment that starts with your vacancy</p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
            You need people who fit the work—and a plan to get them started.
          </h2>
          <p className="text-sm md:text-base sufoniq-body-text">
            An open role can leave your team covering shifts, waiting on a project or reviewing applications that miss the mark. We help you widen the search, assess candidates against the work and prepare the steps behind an international hire.
          </p>
          <p className="text-sm sufoniq-body-text"><strong className="font-semibold text-foreground">Roles we focus on:</strong> skilled trades, professional driving, hospitality and industrial work—including electricians, welders, truck and bus drivers, cooks, chefs, CNC operators and maintenance technicians.</p>
          <p className="text-sm sufoniq-body-text">Hiring for a different role? Tell us the requirement. We’ll discuss how our support fits your search.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="sufoniq-card">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">When the local search comes up short</p>
            <h3 className="text-lg font-semibold mb-2">Find candidates beyond your local market</h3>
            <p className="text-sm sufoniq-body-text">
              Review the role, pay and location together, distinguish essential skills from preferences, and agree where to reach suitable candidates internationally.
            </p>
          </div>
          <div className="sufoniq-card">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">When reviewing CVs isn’t enough</p>
            <h3 className="text-lg font-semibold mb-2">Screen for the work you need done</h3>
            <p className="text-sm sufoniq-body-text">
              Give screening clear criteria: the experience, skills and language needed for the job. Bring relevant evidence and unanswered questions into your hiring decision.
            </p>
          </div>
          <div className="sufoniq-card">
            <p className="mb-3 text-xs font-semibold text-muted-foreground">When an accepted offer is only the beginning</p>
            <h3 className="text-lg font-semibold mb-2">Prepare the steps behind the start date</h3>
            <p className="text-sm sufoniq-body-text">
              Coordinate the agreed document, permit and qualification work alongside your hiring process. Give each action an owner so your team and the candidate know what happens next.
            </p>
          </div>
        </div>
        <div className="max-w-3xl border-t border-[color:var(--card-border)] pt-5"><h3 className="text-base font-semibold">Keep your team. Add support where it helps.</h3><p className="mt-2 text-sm sufoniq-body-text">Already working with an internal recruiter or an agency? We can agree a defined part of the work—sourcing, screening or mobility coordination—alongside your existing process. You retain the hiring decision.</p></div>
        <div className="flex flex-wrap gap-5 text-sm font-semibold"><a href="#contact" className="text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Discuss a role →</a><Link href="/employers" className="text-slate-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">Explore employer support</Link></div>
      </div>
    </section>
  );
}

function CompanySection() {
  return (
    <section id="company" className={sectionSpacing} aria-labelledby="company-title">
      <div className="mx-auto max-w-6xl sufoniq-card space-y-4">
        <p className="sufoniq-meta-label">Who you are dealing with</p>
        <h2 id="company-title" className="text-3xl md:text-4xl font-semibold">Sufoniq. Recruitment and mobility, together.</h2>
        <p className="max-w-3xl text-base sufoniq-body-text">Sufoniq is operated by UAB Skillaxis, headquartered in Vilnius, with management in Vienna and recruitment and operations in the Czech Republic. We support cross-border recruitment and mobility in Europe.</p>
        <ul className="flex flex-wrap gap-2" aria-label="Company facts">
          <li className="inline-flex w-fit items-center rounded-full border border-black/10 bg-background/50 px-3 py-1 text-xs text-muted-foreground">Registered in Lithuania (UAB Skillaxis) · company code 307395574</li>
          <li className="inline-flex w-fit items-center rounded-full border border-black/10 bg-background/50 px-3 py-1 text-xs text-muted-foreground">Operated from Vienna, Austria</li>
          <li className="inline-flex w-fit items-center rounded-full border border-black/10 bg-background/50 px-3 py-1 text-xs text-muted-foreground">Scope and costs agreed in writing</li>
        </ul>
        <p className="max-w-3xl text-sm sufoniq-body-text">Your hiring decision stays with you. We agree the work, responsibilities and costs in writing before delivery begins.</p>
        <Link href="/about" className="inline-flex text-sm font-semibold text-sky-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">About Sufoniq →</Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative isolate min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema).replace(/</g, "\\u003c") }} />
      <div className="absolute left-0 top-0 -z-10 h-screen w-full pointer-events-none"><HomepageMap /></div>
      <div id="hero" className="relative z-10 bg-transparent"><Hero /></div>
      <HeroMapLegend />
      <StructuralGridBand>
        <Services />
        <HiringExample />
        <CompanySection />
        <Contact />
        <HiringDetails />
      </StructuralGridBand>
    </main>
  );
}
