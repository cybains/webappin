import { articleSchema, serializeSchema } from "@/lib/structured-data";
import Link from "@/components/LocalizedLink";
import {getTranslator} from "@/lib/i18n/server";
import {localizedHref,type Locale} from "@/lib/i18n/shared";
import {SITE_URL} from "@/lib/seo";
import { StructuralGridBand } from "@/components/StructuralGridBand";
import { BetterGrowthChapters } from "@/components/BetterGrowthHomepage";
import { INSIGHTS } from "@/lib/insights";

export default function GrowthArticle({locale="en"}:{locale?:Locale}) {
  const t=getTranslator(locale);
  const growth=INSIGHTS.find(item=>item.slug === "growth")!;
  const related=INSIGHTS.filter(item=>item.slug !== "growth").slice(0,3);
  const headline=t(growth.title),framing=t(growth.framing);
  const growthSchema=articleSchema(localizedHref("/insights/growth",locale),headline,framing,growth.tags?.map(t));
  if(locale === "de") { for(const node of growthSchema["@graph"]){ if("inLanguage" in node)node.inLanguage="de";if("itemListElement" in node)node.itemListElement.forEach((item,index)=>{item.item=new URL(localizedHref(new URL(item.item).pathname,"de"),SITE_URL).href;item.name=index===0?"Startseite":index===1?"Einblicke":headline;});} }
  return (
    <StructuralGridBand className="sufoniq-page article-page bg-[var(--background)] text-slate-900 min-h-screen">
      <div className="relative z-10">
        <div className="sufoniq-container pt-10 pb-4 space-y-2">
          <Link locale={locale}
            href="/insights"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-2"
          >
            {t("← Back to Insights")}
          </Link>
          <p className="text-xs uppercase tracking-[0.13em] text-slate-500">{t("Interpretation, not advice.")}</p>
        </div>
        <div className="sufoniq-container pt-4 space-y-3">
          <p className="text-xs uppercase tracking-[0.13em] text-slate-500">
            {t(growth.type)}
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            {headline}
          </h1>
          {growth?.framing && (
            <p className="text-base leading-relaxed text-slate-700">{framing}</p>
          )}
        </div>
        <BetterGrowthChapters />
        <div className="sufoniq-container pb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-base leading-relaxed text-slate-700">
              {t("Charts show where growth is. Hiring decides what happens next — put your role, destination and requirements into the intake form.")}
            </p>
            <Link locale={locale}
              href="/employers#employer-enquiry"
              className="mt-4 inline-block font-medium text-primary hover:underline"
            >
              {t("Tell us the role →")}
            </Link>
          </div>
        </div>
        <div className="sufoniq-container pb-16">
          <h2 className="text-xl font-semibold text-slate-900">{t("Related insights")}</h2>
          <ul className="mt-3 space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link locale={locale}
                  prefetch={false}
                  href={`/insights/${item.slug}`}
                  className="font-medium text-primary hover:underline"
                >
                  {t(item.title)} →
                </Link>
                <span className="ml-3 text-xs uppercase tracking-[0.13em] text-slate-600">
                  {t(item.type)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeSchema(growthSchema) }}
        />
      </div>
    </StructuralGridBand>
  );
}
