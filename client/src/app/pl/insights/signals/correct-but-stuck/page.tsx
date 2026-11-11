import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/pl/insights/signals/correct-but-stuck","Dlaczego poprawny wniosek pobytowy nadal czeka | Sufoniq","Poprawne dokumenty nie zawsze oznaczają postęp. Jak obciążenie kolejek, priorytety i sprawdzenia między systemami wpływają na czas oczekiwania.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals", "correct-but-stuck"])!} locale="pl"/>;}
