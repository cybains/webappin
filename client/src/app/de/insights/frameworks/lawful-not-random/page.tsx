import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/de/insights/frameworks/lawful-not-random","Warum Entscheidungen über Zuwanderung unberechenbar wirken | Sufoniq","Fehlende Einblicke können rechtsgebundene Verfahren willkürlich erscheinen lassen. Wie Ermessensspielräume und Risikoprüfungen Entscheidungen prägen.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks", "lawful-not-random"])!} locale="de"/>;}
