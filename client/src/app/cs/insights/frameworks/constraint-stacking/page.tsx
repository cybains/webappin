import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/cs/insights/frameworks/constraint-stacking","Proč podobné žádosti dopadají jinak | Sufoniq","Podobní uchazeči mohou získat rozdílné výsledky, když se spojí časové okolnosti, podmínky zaměstnání a požadavky na uchazeče. Co rozhodnutí ovlivňuje.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks", "constraint-stacking"])!} locale="cs"/>;}
