import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/ro/insights/frameworks/cross-border-hiring-decisions","Recrutare din străinătate: oameni, permise și calificări | Sufoniq","Trei întrebări înaintea angajării internaționale: piața de recrutare, eligibilitatea candidatului și calificările. Cum se leagă într-un plan.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks","cross-border-hiring-decisions"])!} locale="ro"/>;}
