import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/pl/insights/frameworks/cross-border-hiring-decisions","Rekrutacja z zagranicy: ludzie, zezwolenia i kwalifikacje | Sufoniq","Trzy pytania przed zatrudnieniem z zagranicy: dopasowanie rynku, uprawnienia kandydata i kwalifikacje. Jak połączyć je w plan rekrutacji.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks","cross-border-hiring-decisions"])!} locale="pl"/>;}
