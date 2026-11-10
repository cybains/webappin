import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/cs/insights/signals/correct-but-stuck","Proč se zpozdí i úplná žádost o pobyt | Sufoniq","I úplná žádost může čekat kvůli frontám, kapacitě a předávání mezi systémy. Proč splnění podmínek samo neurčuje rychlost vyřízení.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals", "correct-but-stuck"])!} locale="cs"/>;}
