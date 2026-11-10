import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/de/insights/frameworks/constraint-stacking","Ähnliche Bewerber, unterschiedliche Entscheidungen | Sufoniq","Warum ähnliche Fälle unterschiedlich ausgehen: Wie Zeitpunkt, Voraussetzungen und Arbeitgeberbedingungen bei grenzüberschreitender Beschäftigung zusammenwirken.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks", "constraint-stacking"])!} locale="de"/>;}
