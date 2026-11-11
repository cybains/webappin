import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/ro/insights/signals/churn-is-signal","Fluctuația după angajări internaționale | Sufoniq","De ce plecările după relocare se grupează devreme? Dificultăți nerezolvate privind salariile, șederea, integrarea și viața zilnică.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals", "churn-is-signal"])!} locale="ro"/>;}
