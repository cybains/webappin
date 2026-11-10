import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/de/insights/signals/correct-but-stuck","Warum vollständige Anträge trotzdem warten | Sufoniq","Auch vollständige Anträge können sich verzögern. Wie Auslastung, Prioritäten und Prüfungen die Bearbeitung grenzüberschreitender Verfahren beeinflussen.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals", "correct-but-stuck"])!} locale="de"/>;}
