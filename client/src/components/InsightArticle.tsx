import {articleSchema as createArticleSchema,serializeSchema} from '@/lib/structured-data';
import {SITE_URL} from '@/lib/seo';
import {getTranslator} from '@/lib/i18n/server';
import {localizedHref,type Locale} from '@/lib/i18n/shared';
import {localizeInsight} from '@/lib/i18n/insights';
import type {BodyBlock,InsightContent} from '@/lib/insights/content';
import {INSIGHTS} from '@/lib/insights';
import Link from '@/components/LocalizedLink';
import {StructuralGridBand} from '@/components/StructuralGridBand';
function renderBlock(block: BodyBlock, index: number, locale:Locale) {
  const t=getTranslator(locale);
  switch (block.type) {
    case "heading":
      return (
        <h2 key={index} className="text-xl font-semibold text-slate-900">
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote key={index} className="text-base italic text-slate-700">
          {block.text}
        </blockquote>
      );
    case "paragraph":
      return (
        <p key={index} className="text-base leading-relaxed text-slate-700">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="list-disc list-inside space-y-1 text-base text-slate-700">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={index} className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm text-slate-700">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th
                    key={column}
                    className="border-b border-slate-300 bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="align-top">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border-b border-slate-200 px-3 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "faq":
      return (
        <div key={index} className="space-y-4">
          {block.items.map((item) => (
            <div key={item.q}>
              <h3 className="font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-1 text-base leading-relaxed text-slate-700">{item.a}</p>
            </div>
          ))}
        </div>
      );
    case "source":
      return (
        <p key={index} className="text-sm leading-relaxed text-slate-600">
          {t("Source:")} <a href={block.href} className="text-sky-800 underline underline-offset-4">{block.text}</a>
        </p>
      );
    case "link":
      return (
        <div key={index} className="pt-2">
          <Link locale={locale}
            href={block.href}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {block.text}
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default function InsightArticle({insight:original,locale="en"}:{insight:InsightContent;locale?:Locale}) {
  const t=getTranslator(locale);
  const insight=localizeInsight(original,t);
  const articleSchema = createArticleSchema(localizedHref("/insights/" + insight.slugParts.join("/"),locale), insight.title, insight.framing, insight.tags);
  if(locale !== "en") { for(const node of articleSchema["@graph"]){ if("inLanguage" in node)node.inLanguage=locale;if("itemListElement" in node)node.itemListElement.forEach((item,index)=>{item.item=localizedHref(new URL(item.item).pathname,locale);item.item=new URL(item.item,SITE_URL).href;item.name=index===0?t("Home"):index===1?t("Insights"):insight.title;});} }
  const related = INSIGHTS.filter((item) => item.slug !== insight.slug)
    .sort((a, b) => {
      const scoreA = (a.tags ?? []).filter((tag) => original.tags?.includes(tag)).length;
      const scoreB = (b.tags ?? []).filter((tag) => original.tags?.includes(tag)).length;
      return scoreB - scoreA;
    })
    .slice(0, 3);
  const faqItems = insight.content.flatMap((block) => (block.type === "faq" ? block.items : []));
  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  return (
    <StructuralGridBand className="sufoniq-page article-page bg-[var(--background)] text-slate-900 min-h-screen">
      <div className="relative z-10">
        <div className="sufoniq-container py-16">
          <div className="sufoniq-article space-y-10">
            <div className="space-y-2">
              <Link locale={locale} href="/insights" className="text-sm font-medium text-primary hover:underline flex items-center gap-2">
                {t("← Back to Insights")}
              </Link>
              <p className="text-xs uppercase tracking-[0.13em] text-slate-500">{t("Interpretation, not advice.")}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.13em] text-slate-500">{t(insight.type)}</p>
              <h1 className="text-3xl font-semibold md:text-4xl">{insight.title}</h1>
              <p className="text-base leading-relaxed text-slate-700">{insight.framing}</p>
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.13em] text-slate-600">
                {insight.date && <span>{insight.date ? t(insight.date) : null}</span>}
                {insight.readTime && <span>{insight.readTime ? t(insight.readTime) : null}</span>}
              </div>
            </div>
            <div className="space-y-6">
              {insight.content.map((block, index) => renderBlock(block, index, locale))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs uppercase tracking-[0.13em] text-slate-500">{t("Interpretation")}</p>
                <p className="mt-2 text-base leading-relaxed text-slate-700">{insight.interpretation}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-xs uppercase tracking-[0.13em] text-slate-500">{t("Boundary")}</p>
                <p className="mt-2 text-base leading-relaxed text-slate-700">{insight.boundary}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5">
              <p className="text-xs uppercase tracking-[0.13em] text-slate-500">{t("What this article is not")}</p>
              <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-slate-600">
                {insight.whatThisIsNot.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {related.length > 0 && (
              <div>
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
            )}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: serializeSchema(articleSchema) }}
            />
            {faqSchema && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }}
              />
            )}
          </div>
        </div>
      </div>
    </StructuralGridBand>
  );
}
