import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/pl/insights/rules/lithuania-foreign-worker-quota-2026","Litewski limit pracowników 2026: co po wyczerpaniu? | Sufoniq","Zatrudnienie na Litwie po wyczerpaniu limitu: warunki wynagrodzenia, status kandydata i listopadowe zasady składania wniosków.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["rules","lithuania-foreign-worker-quota-2026"])!} locale="pl"/>;}
