import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/pl/insights/signals/churn-is-signal","Rotacja po zatrudnieniu z zagranicy | Sufoniq","Dlaczego odejścia po przeprowadzce skupiają się wcześnie? Analiza nierozwiązanych trudności w wypłatach, pobycie, wdrożeniu i codziennym życiu.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals", "churn-is-signal"])!} locale="pl"/>;}
