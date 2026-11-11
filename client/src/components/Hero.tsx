import { getTranslator } from '@/lib/i18n/server';
import type { Locale } from '@/lib/i18n/shared';
import Link from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";


export default function Hero({locale = "en"}: {locale?: Locale}) {
  const t=getTranslator(locale);
  return (
    <section
      className="hero relative min-h-[70vh] flex flex-col justify-start items-start text-left px-6 md:px-8 pt-12 md:pt-16 pb-10"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="relative z-10 w-full space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">{t("International recruitment · Europe")}</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-gray-950 tracking-tight text-balance relative leading-[0.95]">
          {t("Find the people you need.")}<span className="block">
            {t("Look beyond the local market.")}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
          {t("When the right people are hard to find locally, Sufoniq helps you recruit across borders. We connect sourcing and screening with the permits, documents and practical steps that get a hire ready to start.")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#contact" className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center rounded-2xl px-5 sm:px-8 py-3 text-sm sm:text-base font-semibold bg-[color:var(--primary)] text-[color:var(--primary-foreground)] transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
            {t("Discuss a role ")}<ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <a href="#hiring-example" className="text-sm font-semibold text-slate-800 underline underline-offset-4 decoration-slate-400 hover:decoration-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4">{t("See an example")}</a>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {t("Sufoniq · operated by UAB Skillaxis")}</p>
        <p className="text-sm text-slate-700">{t("Looking for work? ")}<Link locale={locale} href="/work-in-europe" className="font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{t("Explore job-seeker support")}</Link></p>
      </div>
    </section>
  );
}
