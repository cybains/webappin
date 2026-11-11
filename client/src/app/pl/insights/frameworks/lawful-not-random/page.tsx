import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/pl/insights/frameworks/lawful-not-random","Dlaczego decyzje migracyjne wydają się losowe | Sufoniq","Uznaniowość, ocena ryzyka i ograniczona informacja zwrotna: dlaczego zgodne z prawem systemy migracyjne mogą być nieczytelne dla wnioskodawców.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks", "lawful-not-random"])!} locale="pl"/>;}
