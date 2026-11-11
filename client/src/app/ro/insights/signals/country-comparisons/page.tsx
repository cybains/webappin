import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/ro/insights/signals/country-comparisons","Unde se găsește cel mai ușor de lucru în Europa? | Sufoniq","De ce clasamentele de țări pot induce în eroare? Contează calificările, limba, documentele și o cale fezabilă către angajare.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals","country-comparisons"])!} locale="ro"/>;}
