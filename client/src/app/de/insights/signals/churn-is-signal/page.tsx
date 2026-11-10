import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/de/insights/signals/churn-is-signal","Fluktuation nach internationaler Personalgewinnung | Sufoniq","Warum Beschäftigte nach einem Umzug wieder gehen: Wie Arbeitsbedingungen, Einarbeitung und ungelöste Alltagsfragen die Mitarbeiterbindung beeinflussen.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals", "churn-is-signal"])!} locale="de"/>;}
