import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/ro/insights/frameworks/constraint-stacking","Profiluri similare, decizii de imigrație diferite | Sufoniq","De ce candidați similari pot primi rezultate diferite? Analiză a cerințelor cumulate, dovezilor, calendarului și limitelor instituționale.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks", "constraint-stacking"])!} locale="ro"/>;}
