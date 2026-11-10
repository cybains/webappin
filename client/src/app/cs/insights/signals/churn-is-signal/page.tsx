import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/cs/insights/signals/churn-is-signal","Fluktuace po náboru ze zahraničí | Sufoniq","Proč zaměstnanci po přestěhování odcházejí: jak očekávání, pracovní podmínky a praktická podpora ovlivňují udržení lidí po mezinárodním náboru.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals", "churn-is-signal"])!} locale="cs"/>;}
