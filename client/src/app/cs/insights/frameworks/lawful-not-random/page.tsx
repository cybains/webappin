import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/cs/insights/frameworks/lawful-not-random","Proč imigrační rozhodnutí působí nepředvídatelně | Sufoniq","Neprůhledné postupy mohou působit nahodile. Jak rozdílné prověřování, správní uvážení a omezené informace ovlivňují přeshraniční přesuny.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks", "lawful-not-random"])!} locale="cs"/>;}
