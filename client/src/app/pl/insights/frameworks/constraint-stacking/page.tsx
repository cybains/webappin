import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/pl/insights/frameworks/constraint-stacking","Podobne profile, różne decyzje migracyjne | Sufoniq","Dlaczego podobni kandydaci otrzymują różne decyzje? Analiza nakładających się wymagań, terminów, dowodów i ograniczeń instytucjonalnych.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks", "constraint-stacking"])!} locale="pl"/>;}
