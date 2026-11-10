import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/cs/insights/rules/lithuania-foreign-worker-quota-2026","Litevská kvóta 2026: nábor po vyčerpání limitu | Sufoniq","Přehled litevské kvóty pro zahraniční pracovníky, mzdových podmínek a způsobů podání. Co ověřit před plánováním nástupu.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["rules","lithuania-foreign-worker-quota-2026"])!} locale="cs"/>;}
